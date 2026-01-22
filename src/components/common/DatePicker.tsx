import { useState, useEffect } from "react";
import { useController, Control } from "react-hook-form";
import { useFormField } from "@/components/ui/form";
import { CalendarBlank } from "@data/constants/icons.constants";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateIST, parseISODate } from "@/lib/utils/dateFormatter";

/** Props for the DatePicker component */
interface DatePickerProps {
  control: Control<Record<string, unknown>>;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  allowFutureDates?: boolean;
  allowPastDates?: boolean;
  startYear?: number;
  endYear?: number;
  caption?: "label" | "dropdown" | "dropdown-years" | "dropdown-months";
  onBlur?: () => void;
}

/**
 * Converts Date or ISO string to Date object
 * @param value - The value to parse (Date, ISO string, or undefined)
 * @returns Date object or undefined if value is invalid
 */
function getInitialDate(value: Date | string | undefined): Date | undefined {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string") {
    return parseISODate(value);
  }
  return undefined;
}

/**
 * Converts Date to ISO format string (YYYY-MM-DD)
 * @param date - The date to format
 * @returns ISO formatted date string
 */
function dateToISOString(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  control,
  name,
  placeholder = "",
  disabled = false,
  allowFutureDates = false,
  allowPastDates = true,
  startYear = 1900,
  endYear,
  caption = "dropdown",
  onBlur,
}: DatePickerProps) {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const { error } = useFormField();

  const [open, setOpen] = useState(false);

  const today = new Date();
  const computedEndYear = endYear ?? today.getFullYear() + 30; // Default to current year plus 30 years
  const startMonth = new Date(startYear, 0);
  const endMonth = new Date(computedEndYear, 11);

  const getDisplayValue = (val: string) => {
    if (val === "0000-00-00") return "00-00-0000";
    if (val === "00-00-0000") return "00-00-0000";
    return val;
  };

  const isInvalidDate = typeof value === "string" && (value === "00-00-0000" || value === "0000-00-00");

  const parsedDate = getInitialDate(
    value instanceof Date || typeof value === "string" ? value : undefined
  );

  const [date, setDate] = useState<Date | undefined>(parsedDate);

  useEffect(() => {
    const newDate = getInitialDate(
      value instanceof Date || typeof value === "string" ? value : undefined
    );
    if (newDate?.getTime() !== date?.getTime()) {
      setDate(newDate);
    }
   // including date here will cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const displayedValue = isInvalidDate ? getDisplayValue(value) : (parsedDate || date ? formatDateIST(parsedDate || date) : "");

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    onChange(dateToISOString(selected));
    setDate(selected);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      onBlur?.();
    }
  };

  return (
    <div className="relative">
      <Popover
        open={open && !disabled}
        onOpenChange={disabled ? undefined : handleOpenChange}
      >
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={displayedValue}
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              className="cursor-pointer pr-10"
              aria-invalid={!!error}
              onClick={() => !disabled && setOpen(true)}
            />
            <CalendarBlank
              size={16}
              weight="regular"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary pointer-events-none"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 bg-white"
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date ?? today}
            onSelect={handleDateSelect}
            captionLayout={caption}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={(date) => {
              const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Today at midnight
              const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Selected date at midnight
              if (!allowPastDates && dateAtMidnight < todayAtMidnight) return true; // Disable past dates
              if (!allowFutureDates && dateAtMidnight > todayAtMidnight) return true; // Disable future dates
              return false;
            }}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}