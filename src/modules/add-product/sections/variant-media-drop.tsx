import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import LoaderComponent from "@/components/ui/loader";
import { handlePresignedUrl } from "@/app/actions/misc";

const VariantMultiFileDropzone = ({
  className,
  title,
  name,
}: {
  className?: string;
  title: string;
  name: string;
}) => {
  const { setValue, watch } = useFormContext(); // ✅ Use form context
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // **Watch form state to update UI**
  const existingFiles: string[] = watch(name) ?? [];
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<string[]>(existingFiles); // Local state for UI

  // **Ensure UI updates when form state changes**
  useEffect(() => {
    if (JSON.stringify(existingFiles) !== JSON.stringify(files)) {
      setFiles(existingFiles);
    }
  }, [existingFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      try {
        const uploadedUrls: string[] = [];

        for (const file of acceptedFiles) {
          const filename = file.name.replace(/\s+/g, "-");

          const body = {
            filename,
            contentType: file.type ?? "multipart/form-data",
            size: file.size,
          };

          const result = await handlePresignedUrl(body);

          if (result?.success) {
            await fetch(result?.data?.presignedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": file.type ?? "multipart/form-data",
              },
              body: file,
            });

            uploadedUrls.push(result?.data?.imageUrl);
          }
        }

        // ✅ Update form state and UI
        const newFiles = [...files, ...uploadedUrls];
        setFiles(newFiles);
        setValue(name, newFiles);
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [files, setValue, name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (fileUrl: string) => {
    const updatedFiles = files.filter((f) => f !== fileUrl);
    setFiles(updatedFiles);
    setValue(name, updatedFiles);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="mb-2 text-lg font-medium">{title}</div>

      {/* Upload Area */}
      {files.length === 0 && !loading && (
        <div
          {...getRootProps()}
          className="flex h-28 w-full cursor-pointer items-center justify-center rounded-lg bg-sidebar"
        >
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-gray-600">
              <p>Add Images and Videos</p>
              <Button
                variant="secondary"
                type="button"
                className="flex items-center gap-2 text-sm"
              >
                <Plus />
                <span>Add</span>
              </Button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            {...getInputProps()}
          />
        </div>
      )}

      {/* Additional Upload Button */}
      {files.length > 0 && (
        <div className="flex justify-end">
          <div {...getRootProps()}>
            <Button
              variant="secondary"
              type="button"
              className="flex items-center gap-2 text-sm"
            >
              <Plus />
              <span>Add</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              {...getInputProps()}
            />
          </div>
        </div>
      )}

      {/* Show Spinner while Uploading */}
      {loading && (
        <div className="mt-4 text-center">
          <LoaderComponent />
        </div>
      )}

      {/* Display Uploaded Images */}
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
        {files.map((fileUrl, index) => (
          <div key={index} className="relative aspect-square drop-shadow">
            <picture>
              <img
                src={fileUrl}
                alt={`Uploaded file ${index + 1}`}
                className="size-full rounded-md object-cover"
              />
            </picture>
            <button
              className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-100"
              onClick={() => removeFile(fileUrl)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantMultiFileDropzone;
