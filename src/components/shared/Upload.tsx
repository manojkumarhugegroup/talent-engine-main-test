"use client";

import { useState } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import clsx from "clsx";

interface FileUploadProps {
  onFileSelect: (files: File[], base64Files: string[]) => void;
  accept: Record<string, string[]>; // e.g., { "application/pdf": [".pdf"] }
  maxSize: number; // In bytes, e.g., 3 * 1024 * 1024 for 3MB
  minSize?: number; // Optional min size
  multiple: boolean;
}

const FileUpload = ({
  onFileSelect,
  accept,
  maxSize,
  minSize = 1024,
  multiple,
}: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleDrop = async (acceptedFiles: File[]) => {
    setError(null);

    // ✅ STRICT SINGLE FILE VALIDATION
    if (!multiple && acceptedFiles.length > 1) {
      setError("Only one file can be uploaded.");
      return;
    }

    const file = acceptedFiles[0];

    // ✅ File type validation (PDF only)

    // ✅ File type validation (check if the file type is allowed)
    const allowedTypes = Object.keys(accept);
    const isValidType = allowedTypes.some((type) => file.type.includes(type));

    if (!isValidType) {
      setError(`File "${file.name}" is not a valid file type.`);
      return;
    }
    // const isPDF = file.type === "application/pdf";
    // if (!isPDF) {
    //   setError(`File "${file.name}" is not a PDF.`);
    //   return;
    // }

    // ✅ File size validation
    if (file.size > maxSize) {
      setError(
        `File "${file.name}" exceeds ${(maxSize / 1024 / 1024).toFixed(
          1
        )}MB limit.`
      );
      return;
    }

    if (file.size < minSize) {
      setError(`File "${file.name}" is too small (minimum ${minSize} bytes).`);
      return;
    }

    try {
      const base64 = await toBase64(file);
      onFileSelect([file], [base64]);
    } catch (err) {
      console.error(err);
      setError("Error while reading the file.");
    }
  };

  const handleError = (err: unknown) => {
    let message = "Invalid file format or error occurred.";

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err;
    }

    if (message.includes("larger than")) {
      message = "File size exceeds the maximum allowed limit (3MB).";
    } else if (message.includes("smaller than")) {
      message = "File is too small.";
    }

    setError(message);
  };

  return (
    <div>
      <Dropzone
        multiple={multiple}
        accept={accept}
        maxFiles={1}
        maxSize={maxSize}
        minSize={minSize}
        onDrop={handleDrop}
        onError={handleError}
        className={clsx(
          "border-2 border-dashed rounded-md transition-colors bg-transparent hover:bg-transparent",
          error ? "border-red-500" : "border-gray-300"
        )}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
