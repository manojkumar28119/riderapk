import { useState, useRef } from "react";
import {
  Image,
  Check,
  WarningCircle,
  ArrowClockwise,
  X,
} from "@/data/constants/icons.constants";
import {
  ExistingDocument,
  FileUploadFieldProps,
  UploadedFileItem,
} from "@/data/interfaces/file-upload";
import { Labels } from "@/data/constants/labels.contants";

const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes === 0) return ""; // If no bytes provided, return empty string instead "0 Bytes"
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + sizes[i];
};

const getAcceptString = (formats: string[]): string => {
  const mimeTypeMap: { [key: string]: string } = {
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const acceptedTypes = formats.flatMap((format) => {
    const mimeType = mimeTypeMap[format];
    const extension = `.${format}`;
    return mimeType ? [mimeType, extension] : [extension];
  });

  return [...new Set(acceptedTypes)].join(",");
};

const getFileIdentifier = (file: File | ExistingDocument): string => {
  const name = "name" in file ? file.name : file.file_name;
  const size = "size" in file ? file.size : 0;
  return `${name}-${size}`;
};

const isDuplicateFile = (file: File, uploadedFiles: UploadedFileItem[]): boolean => {
  const newFileId = getFileIdentifier(file);
  return uploadedFiles.some((item) => {
    const uploadedFileId = getFileIdentifier(item.file);
    return uploadedFileId === newFileId;
  });
};

export const FileUploadField = ({
  label,
  required = false,
  supportedFormats = ["png", "jpeg", "jpg"],
  maxFileSize = 10 * 1024 * 1024,
  maxFiles = 5,
  onFilesChange,
  disabled = false,
  initialFiles = [],
  className,
  showError = true,
  hideAfterUpload = false,
  uploadCardClassName = "",
}: FileUploadFieldProps & { showError?: boolean }) => {
  const accept = getAcceptString(supportedFormats);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>(
    initialFiles.map((file) => ({
      file,
      status: "success" as const,
    }))
  );
  const [isDragActive, setIsDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (files: FileList | null) => {
    if (!files) return;

    const newUploadedFiles: UploadedFileItem[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        replacingIndex === null &&
        successFileCount + newUploadedFiles.length >= maxFiles
      ) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        break;
      }

      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      const isSupportedFormat = supportedFormats.includes(fileExtension);

      if (!isSupportedFormat) {
        newUploadedFiles.push({
          file,
          status: "failed",
          errorMessage: `Invalid format. Supported: ${supportedFormats.join(", ")}`,
        });
        continue;
      }

      if (file.size > maxFileSize) {
        errors.push(`File size exceeds ${maxFileSize / (1024 * 1024)} MB limit`);
        break;
      }

      if (isDuplicateFile(file, uploadedFiles)) {
        errors.push(`File already uploaded`);
        break;
      }

      newUploadedFiles.push({
        file,
        status: "success",
      });
    }

    let allFiles = [...uploadedFiles, ...newUploadedFiles];

    if (
      replacingIndex !== null &&
      newUploadedFiles.length > 0 &&
      newUploadedFiles[0].status === "success"
    ) {
      allFiles = uploadedFiles.map((item, idx) =>
        idx === replacingIndex ? newUploadedFiles[0] : item
      );
      setReplacingIndex(null);
    }

    setUploadedFiles(allFiles);
    setValidationErrors(errors);

    const successFiles = allFiles
      .filter((f) => f.status === "success")
      .map((f) => f.file);
    onFilesChange?.(successFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const triggerFileUpload = () => {
    if (
      fileInputRef.current &&
      (successFileCount < maxFiles || replacingIndex !== null)
    ) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValidationErrors([]);

    const successFiles = newFiles
      .filter((f) => f.status === "success")
      .map((f) => f.file);
    onFilesChange?.(successFiles);
  };

  const replaceFile = (index: number) => {
    setReplacingIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const successFileCount = uploadedFiles.filter(
    (f) => f.status === "success"
  ).length;
  const isUploadDisabled =
    disabled || (successFileCount >= maxFiles && replacingIndex === null);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      {!(hideAfterUpload && uploadedFiles.length > 0) && (
        <>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileUpload}
            className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-lg transition-colors ${isDragActive
                ? "border-brand-primary bg-blue-50"
                : "border-gray-300"
              } ${isUploadDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className} `}
          >
            <Image size={40} className="text-gray-400" />

            <div className="text-center">
              <p className="text-sm font-medium text-grey-700">
                Drop your image here or{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileUpload();
                  }}
                  disabled={isUploadDisabled}
                  className="text-brand-primary underline disabled:cursor-not-allowed"
                >
                  {Labels.image.selectFile}
                </button>
              </p>
            </div>

          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 px-1">
            {
              maxFiles === 1 ? (
                <>
                  <p>
                    {Labels.image.supportedFormats(supportedFormats)}
                  </p>
                  <p>
                    {Labels.image.singleMaxFileSize(maxFileSize)}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    {Labels.image.supportedFormats(supportedFormats)}
                  </p>
                  <p>
                    {Labels.image.multipleMaxFileSize(maxFiles, maxFileSize)}
                  </p>
                 </>
              )
            }
           
          </div>
        </>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2 w-full">
          <div className="space-y-2">
            {uploadedFiles.map((fileItem, index) => (
              <div
                key={`${"file_name" in fileItem.file ? fileItem.file.file_name : fileItem.file.name}-${index}`}
                className={`h-12 p-2 rounded-lg shadow-sm border inline-flex justify-between items-center w-full transition-colors ${fileItem.status === "success"
                    ? "border border-gray-200"
                    : "border border-red"
                  }`}
              >
                <div className="flex justify-start items-center gap-3 flex-1">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {fileItem.status === "success" ? (
                      <Check size={24} className="text-green" />
                    ) : (
                      <WarningCircle size={20} className="text-red" />
                    )}
                  </div>

                  <div
                    className={`inline-flex flex-col justify-center items-start flex-1 min-w-0 ${uploadCardClassName}`}
                  >
                    <div className="text-sm font-normal truncate">
                      <span
                        className={`turnicate overflow-hidden whitespace-nowrap line-clamp-1 w-full
                         ${fileItem.status === "success"
                            ? "text-slate"
                            : "text-red"
                          } max-w-[120px]`}
                      >
                        {"file_name" in fileItem.file ? fileItem.file.file_name : fileItem.file.name}
                      </span>
                    </div>
                    <div className="text-xs font-light text-zinc-500">
                      {formatFileSize("size" in fileItem.file ? fileItem.file.size : 0)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-start items-center gap-2">
                  <div className="text-sm font-normal">
                    <span
                      className={
                        fileItem.status === "success"
                          ? "text-green"
                          : "text-red"
                      }
                    >
                      {fileItem.status === "success" ? "Successful" : "Failed"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => replaceFile(index)}
                    disabled={disabled}
                    className={`w-6 h-6 p-1 bg-white rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-slate-300 inline-flex flex-col justify-center items-center disabled:cursor-not-allowed ${!disabled && "hover:bg-gray-50"
                      }`}
                    title="Replace"
                  >
                    <ArrowClockwise size={16} className="text-brand-primary" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                    className={`w-6 h-6 p-1 bg-white rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-slate-300 inline-flex flex-col justify-center items-center disabled:cursor-not-allowed ${!disabled && "hover:bg-gray-50"
                      }`}
                    title="Remove"
                  >
                    <X size={16} className="text-brand-primary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-700">
            Uploaded: {successFileCount}/{maxFiles}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {showError || (validationErrors.length > 0) && (
        <div className="flex items-center gap-1 text-red text-xs font-medium">
          <WarningCircle size={16} />
          <span>{validationErrors[0]}</span>
        </div>
      )}
    </div>
  );
};
