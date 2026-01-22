import type React from "react";
import { useState, useRef } from "react";
import { Download, ArrowsClockWise, X , CloudCheck, WarningCircle} from "@/data/constants/icons.constants";

interface FileUploadProps {
  supportedFormats?: string[];
  maxSizeMB?: number;
  onFileChange?: (file: File | null) => void;
  onBlur?: () => void;
  value?: File | null;
  error?: { message?: string };
}

export function FileUpload({
  supportedFormats = [".doc", ".docx", ".pdf"],
  maxSizeMB = 10,
  onFileChange,
  onBlur,
  value,
  error,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange?.(selectedFile);
      onBlur?.();
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileChange?.(null);
    onBlur?.();
  };

  const handleRefresh = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + sizes[i];
  };

  const truncateFileName = (name: string, maxLength: number = 30): string => {
    if (name.length <= maxLength) return name;
    const half = Math.floor((maxLength - 3) / 2);
    return name.substring(0, half) + "..." + name.substring(name.length - half);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept={supportedFormats.join(",")}
      />

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className={`flex border rounded-lg justify-center cursor-pointer h-[44px] ${error ? "border-red" : "border-grey-200"}`}
        >
          <div className="flex justify-center items-center  text-brand-primary">
            <Download size={20} />
            <span className="text-sm font-normal">Upload</span>
          </div>
        </div>
      ) : (
        <div
          className={`flex border rounded-lg p-2 justify-between h-[44px] ${error ? "border-red" : "border-input"}`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {error ? <WarningCircle size={25} className="text-red flex-shrink-0" /> : <CloudCheck size={25} className= "text-green flex-shrink-0 "/>}
            <div className="flex items-center gap-2 min-w-0">
              <p
                className="text-sm font-normal text-brand-primary"
                title={file.name}
              >
                {truncateFileName(file.name)}
              </p>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
              <p className="text-sm text-brand-primary font-normal">
                {getFileSize(file.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ArrowsClockWise
              size={22}
              className="text-brand-primary cursor-pointer"
              onClick={handleRefresh}
            />
            <X
              size={22}
              className="text-red cursor-pointer"
              onClick={handleRemove}
            />
          </div>
        </div>
      )}
      {!error && (
        <div className="flex justify-between items-center mt-2 text-xs">
          <p className="text-grey-400">
            Supported formats : {supportedFormats.join(" ")}
          </p>
          <p className="text-grey-400">Max size : {maxSizeMB}MB</p>
        </div>
      )}
    </div>
  );
}
