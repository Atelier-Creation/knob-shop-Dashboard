import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { Trash2, CloudUpload } from "lucide-react"; // Import CloudUpload for the empty state icon
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
// Add a 'multiple' prop to control single/multiple file uploads
export default function ImageUploader({
  image,
  onImageUpload,
  multiple = false,
}) {
  // Only use internal preview and deleteToken if we're dealing with a single image
  const [singlePreview, setSinglePreview] = useState(image || null);
  const [singleDeleteToken, setSingleDeleteToken] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // This can still be for the current upload
  const [isUploading, setIsUploading] = useState(false); // New state to show overall uploading status

  const fileInputRef = useRef(null); // Keep for direct input click

  const cloudName = import.meta.env.cloudinery_name || "dpea4iv0b";
  const uploadPreset =
    import.meta.env.cloudinery_presetName || "product_upload";

  const s3 = useMemo(() => {
    return new S3Client({
      endpoint: "https://blr1.digitaloceanspaces.com",
      region: "us-east-1", // Required by AWS SDK, irrelevant for DO
      credentials: {
        accessKeyId: import.meta.env.VITE_DO_SPACES_KEY,
        secretAccessKey: import.meta.env.VITE_DO_SPACES_SECRET,
      },
    });
  }, []);

  const uploadToSpaces = useCallback(
    async (file, onProgress) => {
      if (!file) return null;
      const safeFileName = file.name.replace(/\s+/g, "_");

      const bucketName = "knobsshopcdn";
      const fileKey = `uploads/${Date.now()}-${safeFileName}`;

      try {
        const parallelUploads3 = new Upload({
          client: s3,
          params: {
            Bucket: bucketName,
            Key: fileKey,
            Body: file,
            ACL: "public-read",
            ContentType: file.type,
          },
          queueSize: 1, // optional: helps show accurate progress for single files
          partSize: 5 * 1024 * 1024, // optional: default is 5MB
          leavePartsOnError: false,
        });

        parallelUploads3.on("httpUploadProgress", (progress) => {
          if (
            progress.loaded &&
            progress.total &&
            typeof onProgress === "function"
          ) {
            const percent = Math.round(
              (progress.loaded / progress.total) * 100
            );
            onProgress(percent);
          }
        });

        await parallelUploads3.done();

        const publicUrl = `https://${bucketName}.blr1.cdn.digitaloceanspaces.com/${fileKey}`;
        return { url: publicUrl, deleteToken: null };
      } catch (err) {
        console.error("Error uploading to Spaces:", err);
        throw err;
      }
    },
    [s3]
  );

  useEffect(() => {
    // Only update internal preview if it's a single image uploader
    if (!multiple) {
      setSinglePreview(image || null);
    }
  }, [image, multiple]);

  // Handle single image delete (only relevant for multiple: false)
  const handleSingleImageDelete = async () => {
    if (singleDeleteToken) {
      try {
        await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: singleDeleteToken }),
          }
        );
        toast.success("Image removed");
      } catch (err) {
        console.error("Image delete failed", err);
        toast.error("Failed to remove image");
      }
    }

    setSinglePreview(null);
    setUploadProgress(0);
    setSingleDeleteToken(null);
    if (onImageUpload) onImageUpload(""); // Notify parent of removal for single image
  };

  // Helper to upload a single file to Cloudinary
  const uploadFileToCloudinary = useCallback(
    async (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            // This progress is for the current *individual* file being uploaded if multiple
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        });

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.secure_url) {
                resolve({ url: res.secure_url, deleteToken: res.delete_token });
              } else {
                reject(
                  new Error("Cloudinary upload failed: " + JSON.stringify(res))
                );
              }
            } catch (error) {
              reject(
                new Error("Error parsing Cloudinary response: " + error.message)
              );
            }
          }
        };

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          true
        );
        xhr.send(formData);
      });
    },
    [cloudName, uploadPreset]
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);
      setUploadProgress(0);

      if (multiple) {
        const uploadedImagesData = [];
        try {
          for (const file of acceptedFiles) {
            const { url, deleteToken } = await uploadToSpaces(
              file,
              setUploadProgress
            );
            console.log(url);
            uploadedImagesData.push({ url, deleteToken });
          }
          if (onImageUpload) onImageUpload(uploadedImagesData);
          toast.success(
            `${acceptedFiles.length} image(s) uploaded successfully`
          );
        } catch (err) {
          console.error("Multi-image upload failed", err);
          toast.error("Failed to upload all images.");
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      } else {
        const file = acceptedFiles[0];
        const localUrl = URL.createObjectURL(file);
        setSinglePreview(localUrl);
        try {
          const { url, deleteToken } = await uploadToSpaces(
            file,
            setUploadProgress
          );
          console.log(url);
          setSingleDeleteToken(deleteToken);
          if (onImageUpload) onImageUpload(url);
          toast.success("Image uploaded successfully");
        } catch (err) {
          console.error("Single image upload failed", err);
          toast.error("Upload failed");
          setSinglePreview(null);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }
    },
    [multiple, onImageUpload, uploadToSpaces]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: multiple, // Use the prop value for multiple
  });

  // Clean up image on unmount (only for single image)
  useEffect(() => {
    return () => {
      if (!multiple && singleDeleteToken) {
        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: singleDeleteToken }),
        }).catch((err) => console.error("Failed to delete temp image", err));
      }
    };
  }, [singleDeleteToken, multiple]);

  const currentPreview = !multiple ? singlePreview : null;

  return (
    <div
      {...getRootProps()}
      className={`group border-2 border-dashed rounded-md p-4 min-h-[160px] text-gray-600 text-sm font-medium flex items-center justify-center cursor-pointer text-center relative overflow-hidden transition-colors duration-200
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        }
        ${isUploading ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      <input ref={fileInputRef} {...getInputProps()} />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-gray-700">Uploading...</p>
          {/* A simple overall progress bar for multiple files */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      ) : (
        <>
          {currentPreview ? (
            <div className="absolute inset-0 w-full h-full rounded-sm overflow-hidden">
              <img
                src={currentPreview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/50 text-white text-xs sm:text-sm font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Change Image
              </div>

              {/* Delete button for single image */}
              {!multiple && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSingleImageDelete();
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}

              {/* Progress bar for single image */}
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
            // Empty state (Click to Upload / Drag & Drop)
            <div className="flex flex-col items-center justify-center space-y-2">
              <CloudUpload size={24} className="text-gray-400" />
              <p className="text-sm text-gray-600">
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Click to Upload
                </span>{" "}
                or
              </p>
              <p className="text-xs text-gray-500">Drag & Drop</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
