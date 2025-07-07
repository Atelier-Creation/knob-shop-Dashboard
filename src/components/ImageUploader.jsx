import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader() {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border  rounded-xl p-4 min-h-[120px] bg-blue-50 text-blue-600 text-sm font-medium flex items-center justify-center cursor-pointer text-center relative overflow-hidden"
    >
      <input {...getInputProps()} />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="absolute inset-0 object-cover w-full h-full rounded-xl"
        />
      ) : (
        <div>
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <>
              Add Images <br /> New Categories
            </>
          )}
        </div>
      )}
    </div>
  );
}
