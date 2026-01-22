import React from "react";

export interface ExistingDocument {
  id: string;
  file_path: string;
  file_name: string;
  object_type?: string;
  [key: string]: any;
}

export interface UploadedFileItem {
  file: File | ExistingDocument;
  status: "success" | "failed";
  errorMessage?: string;
}

export interface FileUploadFieldProps {
  label?: React.ReactNode;
  required?: boolean;
  supportedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: (File | ExistingDocument)[]) => void;
  error?: string;
  disabled?: boolean;
  initialFiles?: (File | ExistingDocument)[];
  className?: string;
  hideAfterUpload?: boolean;
  uploadCardClassName?: string;
}
