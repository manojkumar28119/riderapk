import { useState, useMemo, useCallback } from "react";

// ============================================================================
// TYPES
// ============================================================================

export type FilterFieldType = "text" | "number" | "select" | "date" | "groupSelect";

export interface FilterField {
  name: string;
  label?: string; // Optional - defaults to capitalized name
  type?: FilterFieldType; // Optional - defaults to "text"
  placeholder?: string; // Optional - auto-generated from label
  options?: { label: string; value: string }[]; // For select type
  defaultValue?: any;
  isLoading?: boolean; // For date picker and other async fields
}

export interface FilterState {
  [key: string]: unknown;
}

// ============================================================================
// HOOK
// ============================================================================

export const useTableFilters = (filterFields: FilterField[]) => {
  // Initialize filter state from field definitions
  const initialState = useMemo(() => {
    const state: FilterState = {};
    filterFields.forEach((field) => {
      // const fieldType = field.type || "text";
      state[field.name] = ""
    });

    return state;
  }, [filterFields]);

  const [filters, setFilters] = useState<FilterState>(initialState);

  // Update a single filter value
  const onFilterChange = useCallback((name: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(initialState);
  }, [initialState]);

  // Get count of active filters
  const activeFilterCount = useMemo(() => {
    return filterFields.filter((field) => {
      const value = filters[field.name];
      return value && value !== "" && value !== "all";
    }).length;
  }, [filters, filterFields]);

  return {
    filters,
    onFilterChange,
    clearFilters,
    activeFilterCount,
  };
};