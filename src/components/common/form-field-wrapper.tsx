/* FormFieldWrapper Component
 * Universal form field wrapper that renders different field types (text, select, checkbox, etc.)
 * Integrates with React Hook Form for state management and validation
 * Handles loading states, error messages, labels, and tooltips
 */

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  useFormField,
} from "@/components/ui/form";
import type {
  FormFieldWrapperProps,
  Option,
  GroupedOption,
} from "@/data/interfaces/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/common/DatePicker";
import { FileUpload } from "@/components/common/FileUpload";
import {
  MultiSelect,
  MultiSelectOption,
  MultiSelectProps,
} from "../ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "@data/constants/icons.constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { WarningCircle, Eye, EyeSlash } from "@data/constants/icons.constants";
import { Spinner } from "@components/ui/spinner";
import { InfoTooltip } from "@/components/ui/tooltip";
import { FileUploadField } from "@/components/common/FileUploadField";
import type { ExistingDocument } from "@/data/interfaces/file-upload";

/* Type definitions for all field component variants */

export interface FieldComponentProps {
  field: ControllerRenderProps<FieldValues, string>;
  placeholder?: string;
  [key: string]: any;
}

/* Props for single select dropdown field */
interface SelectFieldProps extends FieldComponentProps {
  options: Option[];
  isLoading?: boolean;
  addButton?: boolean;
  addButtonText?: string;
  addButtonTrigger?: () => void;
}

/* Props for grouped/categorized select field */
interface GroupedSelectFieldProps extends FieldComponentProps {
  options: GroupedOption[];
  isLoading?: boolean;
}

/* Props for multi-select field with multiple selections */
interface MultiSelectFieldWrapperProps
  extends FieldComponentProps,
    MultiSelectProps {}

/* Props for checkbox field with label */
interface CheckboxFieldProps extends FieldComponentProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
}

/* Props for radio group field */
interface RadioFieldProps extends FieldComponentProps {
  options: Option[];
}

/* Props for text input field */
interface DefaultFieldProps extends FieldComponentProps {
  type?: string;
  isLoading?: boolean;
}

/* Props for date picker field - requires form control */
interface DateFieldProps extends FieldComponentProps {
  control: any;
  name: string;
}

/* Props for file upload field */
interface FileUploadFieldWrapperProps extends FieldComponentProps {
  supportedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  initialFiles?: (File | ExistingDocument)[];
  label?: React.ReactNode;
  required?: boolean;
}

/* ErrorMessage: Displays validation error with icon */
/* Uses useFormField hook to access field errors from React Hook Form */
const ErrorMessage = () => {
  const { error } = useFormField();

  if (!error) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-red text-xs font-medium">
      <WarningCircle size={16} />
      <span>{error.message}</span>
    </div>
  );
};

/* ========== Field Component Helpers ========== */
/* Each component handles rendering for a specific field type */
/* All receive field object from React Hook Form for state management */

/* TextareaField: Multi-line text input */
const TextareaField = ({
  field,
  placeholder,
  onBlur,
  ...props
}: FieldComponentProps) => {
  return (
    <Textarea
      placeholder={placeholder}
      {...field}
      value={field.value ?? ""}
      {...props}
      onBlur={(e) => {
        field.onBlur();
        onBlur?.(e);
      }}
    />
  );
};

/* SelectField: Single-select dropdown with search and validation
 * Features:
 *  - Search input to filter options
 *  - Loading state with spinner
 *  - Blur validation trigger on close
 *  - Aria attributes for accessibility
 */
const SelectField = ({
  field,
  placeholder,
  options,
  isLoading,
  className,
  cutomfunctionality,
  addButton,
  addButtonText,
  addButtonTrigger,
  hasSearch = true,
  ...props
}: SelectFieldProps) => {
  const { error } = useFormField();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      field.onBlur();
      setSearch("");
    }
    cutomfunctionality?.(open);
  };

  const handleSelectOption = (value: string) => {
    field.onChange(value);
    setIsOpen(false);
    setSearch("");
  };

  const selectedLabel = options?.find(
    (opt) => opt.value === field.value
  )?.label;

  return (
    <div className="relative font-medium">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger className="shadow-none" asChild>
          <Button
            disabled={isLoading || props.disabled}
            aria-invalid={!!error}
            className={cn(
              "m-0 transition-all disabled:!opacity-100 disabled:!pointer-events-auto duration-300 ease-in-out border-foreground/10 text-foreground bg-transparent h-11 w-full hover:bg-transparent rounded-lg border border-grey-200 p-4 aria-[invalid=true]:border-red aria-[invalid=true]:focus-visible:ring-red justify-between disabled:bg-grey-50 disabled:!cursor-not-allowed",
              className
            )}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <span className={selectedLabel ? "text-brand-primary" : "text-gray-400"}>
              {selectedLabel || placeholder}
            </span>
            <ChevronDown className="ml-2 text-grey-200" />
          </Button>
        </PopoverTrigger>

        {!isLoading && (
          <PopoverContent className="w-64 bg-white p-0 flex flex-col">
            <Command
              value={search}
              onValueChange={setSearch}
              className="flex flex-col flex-1"
            >
              {options?.length > 0 && hasSearch && (
                <CommandInput
                  placeholder="Search..."
                  className="text-brand-primary font-medium text-md"
                />
              )}
              <CommandList
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="text-brand-primary font-medium text-md w-full command-list-scrollbar flex-1"
              >
                {options?.length === 0 && (
                  <CommandEmpty>No results found</CommandEmpty>
                )}
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelectOption(option.value)}
                    className="cursor-pointer text-sm text-brand-primary font-normal"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
              {addButton && (
                <>
                  <div className="border-t border-grey-200" />
                  <CommandItem
                    onSelect={() => addButtonTrigger?.()}
                    className="cursor-pointer capitalize text-brand-secondary text-sm font-normal sticky bottom-0 bg-white pb-0"
                  >
                    + {addButtonText}
                  </CommandItem>
                </>
              )}
            </Command>
          </PopoverContent>
        )}
      </Popover>
      {isLoading && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
          <Spinner size="sm" color={"primary"} />
        </div>
      )}
    </div>
  );
};

/* GroupedSelectField: Select with grouped/categorized options
 * Organizes options into sections with visual separators
 */
const GroupedSelectField = ({
  field,
  placeholder,
  options,
  isLoading,
  className,
  ...props
}: GroupedSelectFieldProps) => {
  const { error } = useFormField();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      field.onBlur();
      setSearch("");
    }
  };

  const handleSelectOption = (value: string) => {
    field.onChange(value);
    setIsOpen(false);
    setSearch("");
  };

  const getSelectedLabel = () => {
    for (const group of options) {
      const found = group.options.find((opt) => opt.value === field.value);
      if (found) return found.label;
    }
    return null;
  };

  const selectedLabel = getSelectedLabel();

  return (
    <div className="relative font-medium">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            disabled={isLoading || props.disabled}
            aria-invalid={!!error}
            className={cn(
              "m-1 transition-all duration-300 ease-in-out border-foreground/10 text-foreground bg-transparent h-11 w-full hover:bg-transparent rounded-lg border border-grey-200 p-4 aria-[invalid=true]:border-red aria-[invalid=true]:focus-visible:ring-red justify-between",
              className
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={selectedLabel ? "text-foreground" : "text-gray-400"}
            >
              {selectedLabel || placeholder}
            </span>
            <ChevronDown className="ml-2 text-grey-200" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 bg-white p-0">
          <Command value={search} onValueChange={setSearch}>
            <CommandInput
              placeholder="Search..."
              className="text-brand-primary font-medium text-md"
            />
            <CommandList className="text-brand-primary font-medium text-md">
              {options?.length === 0 && (
                <CommandEmpty>No results found</CommandEmpty>
              )}
              {options?.map((group) => (
                <div key={group.section}>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {group.section}
                  </div>
                  {group.options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelectOption(option.value)}
                      className="cursor-pointer text-sm text-brand-primary font-normal"
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </div>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isLoading && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
          <Spinner size="sm" color={"primary"} />
        </div>
      )}
    </div>
  );
};

/* MultiSelectField: Multi-select dropdown using Command palette pattern
 * Supports select-all, search, and custom add button
 */
const MultiSelectField = ({ field, ...rest }: MultiSelectFieldWrapperProps) => {
  const { error } = useFormField();
  return (
    <MultiSelect
      defaultValue={field.value || []}
      aria-invalid={!!error}
      onBlur={field.onBlur}
      {...rest}
    />
  );
};

/* CheckboxField: Single checkbox with optional label */
const CheckboxField = ({
  field,
  name,
  label,
  required,
  ...props
}: CheckboxFieldProps) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={name}
      checked={field.value}
      onCheckedChange={field.onChange}
      className="border-brand-secondary text-brand-secondary"
      {...props}
    />
    {label && (
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        onClick={() => field.onChange(!field.value)}
      >
        {label}
        {required && <span className="text-red ml-1">*</span>}
      </label>
    )}
  </div>
);

/* SwitchField: Toggle switch for boolean values */
const SwitchField = ({ field, ...props }: FieldComponentProps) => (
  <Switch checked={field.value} onCheckedChange={field.onChange} {...props} />
);

/* RadioField: Radio button group for single selection */
const RadioField = ({ field, options, ...props }: RadioFieldProps) => (
  <RadioGroup onValueChange={field.onChange} value={field.value} {...props}>
    {options.map((option) => (
      <div key={option.value} className="flex items-center space-x-2">
        <RadioGroupItem value={option.value} id={option.value} />
        <label htmlFor={option.value}>{option.label}</label>
      </div>
    ))}
  </RadioGroup>
);

/* SliderField: Range slider for numeric input */
const SliderField = ({ field, ...props }: FieldComponentProps) => (
  <Slider
    value={[field.value]}
    onValueChange={(val) => field.onChange(val[0])}
    {...props}
  />
);

/* FileField: File upload input using FileUpload component */
const FileField = ({ field, ...props }: FieldComponentProps) => {
  const { error } = useFormField();
  return (
    <FileUpload
      supportedFormats={props.supportedFormats}
      maxSizeMB={props.maxSizeMB}
      value={field.value}
      error={error}
      onFileChange={(file) => {
        field.onChange(file);
      }}
      onBlur={() => {
        field.onBlur();
        props.onBlur?.();
      }}
    />
  );
};

/* DateField: Date picker using custom DatePicker component */
const DateField = ({
  field,
  control,
  name,
  placeholder,
  onBlur,
  ...props
}: DateFieldProps & { field?: ControllerRenderProps<FieldValues, string> }) => (
  <DatePicker
    control={control}
    name={name}
    placeholder={placeholder}
    onBlur={() => {
      field?.onBlur?.();
      onBlur?.();
    }}
    {...props}
  />
);

/* FileUploadFieldWrapper: File upload with drag-drop and validation
 * Integrates FileUploadField with React Hook Form
 * Handles multiple files, format validation, and size limits
 */
const FileUploadFieldWrapper = ({
  field,
  label,
  required,
  supportedFormats,
  maxFileSize,
  maxFiles,
  initialFiles,
  ...props
}: FileUploadFieldWrapperProps) => {
  const { error } = useFormField();
  return (
    <FileUploadField
      label={label}
      required={required}
      supportedFormats={supportedFormats}
      maxFileSize={maxFileSize}
      maxFiles={maxFiles}
      initialFiles={initialFiles || field.value || []}
      onFilesChange={(files) => field.onChange(files)}
      error={error?.message}
      showError={false}
      {...props}
    />
  );
};

/* PasswordField: Text input with show/hide toggle button */
const PasswordField = ({
  field,
  placeholder,
  onBlur,
  ...props
}: FieldComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...field}
        value={field.value ?? ""}
        {...props}
        onBlur={(e) => {
          field.onBlur();
          onBlur?.(e);
        }}
        className="pr-10 [&::-ms-reveal]:hidden"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {!showPassword ? (
          <EyeSlash className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

/* TelField: Phone number input with +91 prefix (India-specific) */
const TelField = ({
  field,
  placeholder,
  onBlur,
  ...props
}: FieldComponentProps) => {
  const { error } = useFormField();
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute inset-y-0 left-0 flex items-center text-blue-700 font-medium px-3 pointer-events-none text-primary-foreground pr-1 border-r",
          error ? "border-red" : "border-gray-300"
        )}
      >
        +91
      </div>
      <Input
        type="tel"
        placeholder={placeholder}
        {...field}
        value={field.value ?? ""}
        {...props}
        inputMode="numeric"
        className="pl-12"
        onKeyPress={handleKeyPress}
        onBlur={(e) => {
          field.onBlur();
          onBlur?.(e);
        }}
      />
    </div>
  );
};

/* DefaultField: Generic text input for text, email, number, etc. */
const DefaultField = ({
  field,
  type,
  placeholder,
  onFieldChange,
  isLoading,
  onBlur,
  ...props
}: DefaultFieldProps) => {
  return (
    <div className="relative">
      <Input
        type={type}
        placeholder={placeholder}
        {...field}
        value={field.value ?? ""}
        {...props}
        onBlur={(e) => {
          field.onBlur();
          onBlur?.(e);
        }}
        onChange={(e) => {
          field.onChange(e);
          onFieldChange?.();
        }}
      />
      {isLoading && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
          <Spinner size="sm" color={"primary"} />
        </div>
      )}
    </div>
  );
};

/* FormFieldWrapper: Main universal form field component
 * Renders different field types based on 'type' prop
 * Integrates with React Hook Form for form state management
 * Handles validation errors, labels, descriptions, and loading states
 */
export function FormFieldWrapper({
  control,
  name,
  label,
  description,
  placeholder,
  required = false,
  type = "text",
  options = [],
  className,
  isLoading = false,
  tooltipContent,
  tooltipPosition,
  cutomfunctionality,
  ActionLink,
  onBlur,
  onFieldChange,
  allowFutureDates,
  allowPastDates,
  startYear,
  endYear,
  caption,
  supportedFormats,
  maxFileSize,
  maxFiles,
  initialFiles,
  ...props
}: FormFieldWrapperProps) {
  /* renderFieldByType: Determines which field component to render
   * Routes to specific field component based on type prop
   * Passes common props to all field components
   * Specific props (options, isLoading) passed only when needed
   */
  const renderFieldByType = (
    field: ControllerRenderProps<FieldValues, string>,
    className: string
  ) => {
    const baseFieldProps = {
      field,
      placeholder,
      name,
      label,
      required,
      className,
      onBlur,
      cutomfunctionality,
      ...props,
    };

    const fieldPropsWithOnChange = {
      ...baseFieldProps,
      onFieldChange,
    };

    switch (type) {
      case "textarea":
        return <TextareaField {...baseFieldProps} />;
      case "select":
        return (
          <SelectField
            {...baseFieldProps}
            isLoading={isLoading}
            options={options as Option[]}
          />
        );
      case "groupSelect":
        return (
          <GroupedSelectField
            {...baseFieldProps}
            isLoading={isLoading}
            options={options as GroupedOption[]}
          />
        );
      case "multiSelect": {
        return (
          <MultiSelectField
            {...baseFieldProps}
            isLoading={isLoading}
            onValueChange={field.onChange}
            cutomfunctionality={cutomfunctionality}
            options={options as MultiSelectOption[]}
          />
        );
      }

      case "checkbox":
        return <CheckboxField {...baseFieldProps} />;
      case "switch":
        return <SwitchField {...baseFieldProps} />;
      case "radio":
        return <RadioField {...baseFieldProps} options={options as Option[]} />;
      case "slider":
        return <SliderField {...baseFieldProps} />;
      case "file":
        return <FileField {...baseFieldProps} />;
      case "fileUpload":
        return (
          <FileUploadFieldWrapper
            {...baseFieldProps}
            supportedFormats={supportedFormats}
            maxFileSize={maxFileSize}
            maxFiles={maxFiles}
            initialFiles={initialFiles}
          />
        );
      case "date":
        return (
          <DateField
            {...baseFieldProps}
            control={control}
            field={field}
            allowFutureDates={allowFutureDates}
            allowPastDates={allowPastDates}
            startYear={startYear}
            endYear={endYear}
            caption={caption}
          />
        );
      case "password":
        return <PasswordField {...baseFieldProps} />;
      case "tel":
        return <TelField {...baseFieldProps} />;
      default:
        return (
          <DefaultField
            {...fieldPropsWithOnChange}
            type={type}
            isLoading={isLoading}
          />
        );
    }
  };

  /* Main render: React Hook Form integration
   * FormField connects to form control via name
   * field object passed to renderFieldByType for state management
   */
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "space-y-1 mt-6",
            type === "tel" && "space-y-0",
            className
          )}
        >
          {/* Render label with required indicator and tooltip if provided
           * Skip label for checkbox and fileUpload fields (handled internally)
           */}
          {label && type !== "checkbox" && type !== "fileUpload" && (
            <FormLabel className="mb-2 text-blue-950 flex items-center">
              {label}
              {required && <span className="text-red ml-1">*</span>}
              {tooltipContent && (
                <div className="ml-2">
                  <InfoTooltip
                    content={tooltipContent}
                    position={tooltipPosition}
                  />
                </div>
              )}
            </FormLabel>
          )}

          {/* Render selected field component with form control wrapper */}
          <FormControl>{renderFieldByType(field, className || "")}</FormControl>

          {/* Optional description text below field */}
          {description && <FormDescription>{description}</FormDescription>}

          {/* Reserved space for error message display
           * Auto height to accommodate error messages
           */}
          <div className="h-auto">
            {ActionLink ? (
              <div className="flex items-start gap-2">
                <ErrorMessage />
                <div className="flex items-start ml-auto">{ActionLink}</div>
              </div>
            ) : (
              <ErrorMessage />
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
