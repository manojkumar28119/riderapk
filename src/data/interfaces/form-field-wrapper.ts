export interface Option {
  label: string;
  value: string;
}

export interface GroupedOption {
  section: string;
  options: Option[];
}

export interface fieldType {
  text: string,
  email: string,
  password: string,
  number: string,
  textarea: string,
  groupSelect: string[],
  multiSelect: string[],
  select: string[],
  checkbox: boolean,
  switch: boolean,
}

export type FieldTypeString = 
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "groupSelect"
  | "multiSelect"
  | "select"
  | "checkbox"
  | "switch"
  | "radio"
  | "slider"
  | "file"
  | "date"
  | "tel"
  |"fileUpload"

export interface FormFieldWrapperProps {
  control: any
  name: string
  label?: React.ReactNode
  description?: string
  placeholder?: string
  required?: boolean
  type?: FieldTypeString
  options?: Option[] | GroupedOption[]
  className?: string
  isLoading?: boolean
  tooltipContent?: string
  tooltipPosition?: "top" | "bottom" | "left" | "right"
  cutomfunctionality?: () => void
  ActionLink?: React.ReactNode
  supportedFormats?: string[]
  maxSizeMB?: number
  [key: string]: any
}
