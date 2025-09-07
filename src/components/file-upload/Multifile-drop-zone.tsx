import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Plus, X } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { auth } from "@/services/auth";
import LoaderComponent from "../ui/loader";
import { handlePresignedUrl } from "@/app/actions/misc";

function isValidURL(str: string) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

const MultiFileDropzone = ({
  className,
  title,
  name,
  setValue,
  existingFiles = [],
}: {
  className?: string;
  title: string;
  name: string;
  setValue: any;
  existingFiles?: string[];
}) => {
  const form = useFormContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<string[]>(existingFiles); // Store URLs of uploaded files
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // console.log(watch('media'));
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      try {
        for (const file of acceptedFiles) {
          const filename = file.name.replaceAll(/\s+/g, "-");

          const body = {
            filename,
            contentType: file.type ?? "multipart/form-data",
            size: file.size,
          };
          // console.log(body);
          const result = await handlePresignedUrl(body);
          // console.log('presigned', result);
          if (result?.success) {
            await fetch(result?.data?.presignedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": file.type ?? "multipart/form-data",
                // Authorization: `Bearer ${token}`,
              },
              body: file,
            });
            // console.log(uploadAction);
            const accessUrl = result?.data?.imageUrl;
            setFiles((prev) => {
              const newFiles = [...prev, accessUrl];
              setValue(name, newFiles);
              return newFiles;
            });
          }
        }

        // Update form value with all uploaded file URLs
      } catch (error) {
        // console.error('File upload failed:', error);
      } finally {
        setLoading(false);
      }
    },
    [setValue, name, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (fileUrl: string) => {
    const updatedFiles = files.filter((f) => f !== fileUrl);
    setFiles(updatedFiles);
    setValue(name, updatedFiles); // Update form value after removal
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
      {files && files.length > 0 && (
        <div className="flex justify-end">
          <div {...getRootProps()}>
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <Button
                variant="secondary"
                type="button"
                className="flex items-center gap-2 text-sm"
              >
                <Plus />
                <span>Add</span>
              </Button>
            )}
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

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
        {files.length > 0 &&
          files.map((fileUrl, index) => (
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

export default MultiFileDropzone;
