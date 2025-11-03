"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface FileUploadAreaProps {
  onFileUpload: (file: File) => void
  uploadProgress: number | null
  uploadedFileName?: string
  onCancelUpload: () => void
}

export function FileUploadArea({
  onFileUpload,
  uploadProgress,
  uploadedFileName,
  onCancelUpload,
}: FileUploadAreaProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: string | any[]) => {
      // Clear any previous error
      setErrorMsg(null)

      // Check rejections
      if (fileRejections && fileRejections.length > 0) {
        const firstRejection = fileRejections[0]
        for (const err of firstRejection.errors) {
          if (err.code === "file-too-large") {
            setErrorMsg("File is too large. Maximum size is 3 MB.")
            break
          }
          if (err.code === "file-invalid-type") {
            setErrorMsg("Invalid file type. Only PDF or DOC/DOCX allowed.")
            break
          }
          // you can check other err.code values if needed
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        onFileUpload(file)
      }
    },
    [onFileUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024,   // 3 MB in bytes
  })

  if (uploadProgress !== null) {
    return (
      <Card className="border-(--interview) bg-(--key-bg)">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-600"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - uploadProgress / 100)}`}
                  className="text-blue-500 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold">{Math.round(uploadProgress)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-white font-medium">Uploading {Math.round(uploadProgress)}%</p>
              <p className="text-slate-400 text-sm">{uploadedFileName}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onCancelUpload}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-(--bg-candidate) border-(--bg-border) p-0">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-(--interview) bg-(--key-bg) ${
            isDragActive ? "border-blue-500 bg-blue-500/10" : "border-[#3953C2] hover:border-[#3953C2]"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4 ">
            <div className="space-y-2">
              <p className="text-slate-300">
                {isDragActive
                  ? "Drop the resume here..."
                  : "Drag & drop resume here or click to browse"}
              </p>
            </div>
            <Button variant="outline" className="border-(--interview) bg-transparent text-white hover:bg-transparent">
              <Upload className="w-4 h-4 mr-2 text-(--interview)" />
              Upload Resume
            </Button>
          </div>
        </div>

        {/* Display error message if size/type invalid */}
        {errorMsg && (
          <p className="text-sm text-red-500 mt-2 text-left">{errorMsg}</p>
        )}
      </CardContent>
    </Card>
  )
}
