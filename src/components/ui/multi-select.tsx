import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckIcon, ChevronDown } from "@data/constants/icons.constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CommandGroup,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import React, { useEffect, useState } from "react";

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface MultiSelectProps
  extends VariantProps<typeof multiSelectVariants> {
  options: MultiSelectOption[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  maxCount?: number;
  hideSelectAll?: boolean;
  className?: string;
  isLoading?: boolean;
  addButton?: boolean;
  addButtonText?: string;
  addButtonTrigger?: () => void;
  cutomfunctionality?: () => void;
  "aria-invalid"?: boolean;
  onBlur?: () => void;
}

const multiSelectVariants = cva("m-1 transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default:
        "border-foreground/10 text-foreground bg-transparent h-11 w-full hover:bg-transparent rounded-lg border border-grey-200 p-4 aria-[invalid=true]:border-red aria-[invalid=true]:focus-visible:ring-red",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    },
  },
  defaultVariants: { variant: "default" },
});

/** MultiSelect Component: Reusable multi-select dropdown with search, select-all, and custom button support */
export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      cutomfunctionality,
      defaultValue = [],
      placeholder = "Select options",
      disabled = false,
      searchable = true,
      maxCount = 2,
      hideSelectAll = false,
      variant,
      className,
      isLoading = false,
      addButton = false,
      addButtonText = "",
      addButtonTrigger,
      "aria-invalid": ariaInvalid,
      onBlur,
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    // const [search, setSearch] = useState("");

    useEffect(() => {
      setSelectedValues(defaultValue);
    }, [defaultValue]);

    const toggleOption = (value: string) => {
      if (disabled) return;
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newValues);
      onValueChange(newValues);
    };

    const toggleAll = () => {
      const allValues = options.filter((o) => !o.disabled).map((o) => o.value);
      const newValues =
        selectedValues.length === allValues.length ? [] : allValues;

      setSelectedValues(newValues);
      onValueChange(newValues);
    };

    // const filteredOptions = search
    //   ? options.filter(
    //       (o) =>
    //         o.label.toLowerCase().includes(search.toLowerCase()) ||
    //         o.value.toLowerCase().includes(search.toLowerCase())
    //     )
    //   : options;

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        onBlur?.();
      }
    };

    return (
      <div className="relative font-medium">
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              disabled={disabled || isLoading}
              onClick={() => {
                setIsOpen(!isOpen);
                cutomfunctionality?.();
              }}
              aria-invalid={ariaInvalid}
              className={cn(multiSelectVariants({ variant, className }))}
            >
              <div className="flex flex-wrap flex-1 gap-1 items-center overflow-hidden">
                {selectedValues.slice(0, maxCount).map((value, index) => {
                  const opt = options.find((o) => o.value === value);
                  if (!opt) return null;
                  return (
                    <Badge
                      key={value + index}
                      className="flex items-center gap-2 px-1 py-0.5 cursor-default text-brand-primary !border !border-blue-200 rounded-sm text-sx"
                    >
                      {opt.icon && <opt.icon className="h-4 w-4" />}
                      {opt.label}
                      <span
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOption(value);
                        }}
                      >
                        <X className="text-blue-950" />
                      </span>
                    </Badge>
                  );
                })}
                {selectedValues.length > maxCount && (
                  <Badge className="text-brand-primary text-xs border-none underline bg-transparent shadow-none">
                    +{selectedValues.length - maxCount}
                  </Badge>
                )}
                {selectedValues.length === 0 && (
                  <span className="text-gray-400 truncate">{placeholder}</span>
                )}
              </div>
              <ChevronDown className="ml-2 text-grey-200" />
            </Button>
          </PopoverTrigger>

          {!isLoading && (
            <PopoverContent className="w-[300px] h-[300px] bg-white p-0 flex flex-col">
              <Command className="flex flex-col flex-1">
                {searchable && (
                  <CommandInput
                    placeholder="Search..."
                  />
                )}
                <CommandList className="flex-1">
                  {!hideSelectAll  && (
                    <CommandGroup>
                      <CommandItem
                        onSelect={toggleAll}
                        className="cursor-pointer text-sm text-brand-primary"
                      >
                        <div className="mr-2 flex h-4 w-4 items-center justify-center border rounded">
                          {selectedValues.length === options.length && (
                            <CheckIcon className="h-4 w-4" />
                          )}
                        </div>
                        Select All
                      </CommandItem>
                    </CommandGroup>
                  )}
                  {options.length === 0 && (
                    <CommandEmpty>No results found</CommandEmpty>
                  )}
                  <CommandGroup>
                    {options.map((opt, index) => (
                      <CommandItem
                        key={opt.value + index}
                        onSelect={() => toggleOption(opt.value)}
                        disabled={opt.disabled}
                        className=" cursor-pointer text-sm text-brand-primary font-normal"
                      >
                        <div className="mr-2 flex h-4 w-4 items-center justify-center border rounded">
                          {selectedValues.includes(opt.value) && (
                            <CheckIcon className="h-4 w-4" />
                          )}
                        </div>
                        {opt.icon && <opt.icon className="h-4 w-4 mr-1" />}
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                {addButton && (
                  <>
                    <div className="border-t border-grey-200" />
                    <CommandItem
                      onSelect={() => addButtonTrigger?.()}
                      className="cursor-pointer capitalize text-brand-secondary text-sm font-normal sticky bottom-0 bg-white"
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
  }
);

MultiSelect.displayName = "MultiSelect";
