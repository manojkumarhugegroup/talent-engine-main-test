// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { Card, CardContent } from "@/components/ui/card";
// import { FileText, Trash2 } from "lucide-react";

// // Dynamically import Viewer and Worker with SSR disabled
// const Worker = dynamic(
//   () => import('@react-pdf-viewer/core').then(mod => mod.Worker),
//   { ssr: false }
// );

// const Viewer = dynamic(
//   () => import('@react-pdf-viewer/core').then(mod => mod.Viewer),
//   { ssr: false }
// );

// import '@react-pdf-viewer/core/lib/styles/index.css';

// interface AdditionalInformationPreviewProps {
//   file: File;
//   onDelete: () => void;
// }

// export function AdditionalInformationPreview({ file, onDelete }: AdditionalInformationPreviewProps) {
//   const [fileUrl, setFileUrl] = useState<string | null>(null);

//   useEffect(() => {
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     setFileUrl(url);

//     return () => {
//       URL.revokeObjectURL(url);
//     };
//   }, [file]);

//   const isPdf = file.type === "application/pdf";
//   const isImage = file.type.startsWith("image/");

//   return (
//     <Card className="border-gray-200 w-full">
//       <CardContent className="p-4 space-y-4">
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             <FileText className="w-4 h-4" />
//             <span className="text-sm truncate">{file.name}</span>
//           </div>

//           <button
//             onClick={onDelete}
//             className="text-red-500 hover:text-red-600 transition"
//             title="Delete File"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>

//         {fileUrl && (
//           <div
//             className="rounded overflow-hidden border border-gray-300 bg-card w-full"
//             style={{ height: 600 }}
//           >
//             {isPdf ? (
//       <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">

//                 <Viewer
//                   fileUrl={fileUrl}
//                   defaultScale={1}
//                   theme="light"
//                 />
//               </Worker>
//             ) : isImage ? (
//               <img
//                 src={fileUrl}
//                 alt="Uploaded File Preview"
//                 className="w-full object-contain"
//               />
//             ) : (
//               <p className="text-center text-slate-400 text-sm p-4">
//                 File preview not supported. Please upload a PDF or image.
//               </p>
//             )}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";

// Dynamically import Viewer and Worker with SSR disabled
const Worker = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => mod.Worker),
  { ssr: false }
);

const Viewer = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => mod.Viewer),
  { ssr: false }
);

import '@react-pdf-viewer/core/lib/styles/index.css';

interface AdditionalInformationPreviewProps {
  file: File;
  onDelete: () => void;
}

export function AdditionalInformationPreview({ file, onDelete }: AdditionalInformationPreviewProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFileUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");
  const isDocOrDocx = file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const openDocInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  // Dynamically calculate height
  let previewHeight = 600; // Default height for PDF
  if (isImage) {
    previewHeight = 400; // Adjust height for image preview
  } else if (isDocOrDocx) {
    previewHeight = 120; // Adjust height for DOC/DOCX button
  }

  return (
    <Card className="border-gray-200 w-full">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm truncate">{file.name}</span>
          </div>

          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 transition"
            title="Delete File"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {fileUrl && (
          <div
            className="rounded overflow-hidden border border-gray-300 bg-card w-full"
            style={{ height: `${previewHeight}px` }} // Dynamically set height here
          >
            {isPdf ? (
              // For PDF files, render the PDF viewer
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={fileUrl}
                  defaultScale={1}
                  theme="light"
                />
              </Worker>
            ) : isImage ? (
              // For image files, render the image
              <img
                src={fileUrl}
                alt="Uploaded File Preview"
                className="w-full object-contain"
              />
            ) : isDocOrDocx ? (
              // For DOC/DOCX files, show a button to open the file in a new tab
              <div className="text-center mt-4">
                <button type="button"
                  onClick={openDocInNewTab}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  title="View Document"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  View DOC/DOCX
                </button>
              </div>
            ) : (
              <p className="text-center text-slate-400 text-sm p-4">
                File preview not supported. Please upload a PDF, DOC/DOCX, or image.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
