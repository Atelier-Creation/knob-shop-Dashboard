import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function ImageUploader({ image, onImageUpload }) {
  const [preview, setPreview] = useState(image || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteToken, setDeleteToken] = useState(null);
  const fileInputRef = useRef(null);

  const cloudName = import.meta.env.cloudinery_name || "dpea4iv0b";
  const uploadPreset = import.meta.env.cloudinery_presetName || "product_upload";

  useEffect(() => {
  setPreview(image || null);
}, [image]);

  const handleImageDelete = async () => {
    if (deleteToken) {
      try {
        await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: deleteToken }),
        });
        toast.success("Image removed");
      } catch (err) {
        console.error("Image delete failed", err);
        toast.error("Failed to remove image");
      }
    }

    setPreview(null);
    setUploadProgress(0);
    setDeleteToken(null);
    if (onImageUpload) onImageUpload("");
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          }
        });

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            const res = JSON.parse(xhr.responseText);
            if (res.secure_url) {
              setUploadProgress(100);
              setDeleteToken(res.delete_token);
              if (onImageUpload) onImageUpload(res.secure_url);
              toast.success("Image uploaded successfully");
            } else {
              console.error("Upload failed", res);
              toast.error("Upload failed");
            }
          }
        };

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          true
        );
        xhr.send(formData);
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Upload failed");
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // Clean up image on unmount
  useEffect(() => {
    return () => {
      if (deleteToken) {
        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: deleteToken }),
        }).catch((err) => console.error("Failed to delete temp image", err));
      }
    };
  }, [deleteToken]);

  return (
    <div
      {...getRootProps()}
      className="group border-2 border-dashed border-blue-200 rounded-sm p-4 min-h-[160px] bg-blue-50 text-gray-600 text-sm font-medium flex items-center justify-center cursor-pointer text-center relative overflow-hidden"
    >
      <input ref={fileInputRef} {...getInputProps()} />
      {preview ? (
        <div className="absolute inset-0 w-full h-full rounded-sm overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50 text-white text-xs sm:text-sm font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Change Image
          </div>

          {/* Delete button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleImageDelete();
            }}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
            title="Remove image"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>

          {/* Progress bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30">
              <div
                className="h-full bg-blue-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <>
              Drag and Drop <br /> or upload Images
            </>
          )}
        </div>
      )}
    </div>
  );
}
