import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CaretUpDown,
  CaretUp,
  CaretDown,
  CaretLeft,
  CaretRight,
  DotsThreeOutlineVertical,
} from "@data/constants/icons.constants";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { InfoTooltip } from "@/components/ui/tooltip";

export type RowAction<T = any> = {
  label: string | ((row: T) => string);
  icon?: React.ReactNode | ((row: T) => React.ReactNode);
  onClick?: (row: T) => void;
  disabled?: boolean | ((row: T) => boolean);
  tooltipDescription?: string | ((row: T) => string);
  path?: (row: T) => string | string;
  permission?: string;
  visible?: boolean | ((row: T) => boolean);
  className?: string;
};

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  resizable?: boolean;
  render?: (row: any) => React.ReactNode;
  renderHeader?: (options: {
    allChecked: boolean;
    someChecked: boolean;
    onToggle: (checked: boolean) => void;
  }) => React.ReactNode;
  actions?: RowAction[];
  toolTipLabel?: (row: any) => string | undefined;
  tooltip?: boolean;
}

export interface TableConfig {
  data?: any[];
  columns?: TableColumn[];
  loading?: boolean;
  path?: string;
  pagination?: {
    pageSize: number;
    current: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    totalDataCount?: number;
  };
  dataNotFoundText?: string;
  className?: string;
  isCheckbox?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  isNavigate?: boolean;
  onNavigate?: (row: any) => void;
  activeTab?: string;
  resizableColumns?: boolean;
}

const generatePageNumbers = (current: number, total: number) => {
  if (total <= 7) return [...Array(total)].map((_, i) => i + 1);
  const range = (s: number, e: number) =>
    Array.from({ length: e - s + 1 }, (_, i) => s + i);
  if (current <= 4) return [...range(1, 5), "...", total];
  if (current >= total - 3) return [1, "...", ...range(total - 4, total)];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const SortIcon = ({
  state,
  active,
  className,
}: {
  state: "asc" | "desc" | "none";
  active: boolean;
  className?: string;
}) => {
  const Icon =
    !active || state === "none"
      ? CaretUpDown
      : state === "asc"
        ? CaretUp
        : CaretDown;

  return (
    <Icon
      className={cn("h-4 w-4 text-muted-foreground", className)}
      aria-hidden="true"
    />
  );
};

SortIcon.displayName = "SortIcon";

// Empty state
const EmptyState = ({
  dataNotFoundText,
}: {
  dataNotFoundText?: string;
  navigate: ReturnType<typeof useNavigate>;
}) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <p className="text-muted-foreground">
      {dataNotFoundText || "No data available"}
    </p>
  </div>
);
EmptyState.displayName = "EmptyState";

interface TableCellContentProps {
  content: React.ReactNode;
  contentStr: string;
  columnWidth: number;
}

const TableCellContent: React.FC<TableCellContentProps> = ({
  content,
  contentStr,
  columnWidth,
}) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  React.useEffect(() => {
    if (cellRef.current && contentStr) {
      const isOverflow =
        cellRef.current.scrollWidth > cellRef.current.offsetWidth;
      setIsOverflowing(isOverflow);
    }
  }, [contentStr, columnWidth]);

  const cell = (
    <TableCell
      style={{
        width: columnWidth,
        maxWidth: columnWidth,
      }}
      className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis"
    >
      <div ref={cellRef} className="overflow-hidden text-ellipsis">
        {content}
      </div>
    </TableCell>
  );

  if (isOverflowing && contentStr) {
    return <InfoTooltip content={contentStr} position="top" trigger={cell} />;
  }

  return cell;
};

TableCellContent.displayName = "TableCellContent";

const MIN_COLUMN_WIDTH = 150;
const MAX_COLUMN_WIDTH = 500;

export const SortableTable: React.FC<{ config: TableConfig }> = ({
  config,
}) => {
  const {
    data = [],
    columns = [],
    loading = false,
    pagination,
    path,
    dataNotFoundText,
    className,
    isCheckbox = false,
    selectedRows,
    onSelectionChange,
    isNavigate = false,
    onNavigate,
    resizableColumns = true,
  } = config;

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({ key: "", direction: "asc" });
  const [internalSelected, setInternalSelected] = useState<
    Set<string | number>
  >(new Set());
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const isResizingRef = useRef(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const selected = selectedRows ?? internalSelected;

  /** Selection management */
  const setSelected = (
    updater:
      | Set<string | number>
      | ((prev: Set<string | number>) => Set<string | number>),
  ) => {
    if (onSelectionChange) {
      const newValue =
        typeof updater === "function" ? updater(selected) : updater;
      onSelectionChange(newValue);
    } else {
      setInternalSelected(updater);
    }
  };

  /** Sorting date regex DD MMM YYYY */
  const isDateLike = (value: string) =>
    /\d{1,2}\s[A-Za-z]{3}\s\d{4}/.test(value);

  const isNumeric = (value: string | number): boolean => {
    const num = Number(value);
    return !isNaN(num) && value !== "";
  };

  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (isDateLike(aValue) && isDateLike(bValue)) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (isNumeric(aValue) && isNumeric(bValue)) {
        const numA = Number(aValue);
        const numB = Number(bValue);
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });
  }, [data, sortConfig]);

  /** Sorting handler */
  const handleSort = (key: string) => {
    if (isResizingRef.current) return;
    setSortConfig((curr) =>
      curr?.key !== key
        ? { key, direction: "asc" }
        : curr.direction === "asc"
          ? { key, direction: "desc" }
          : { key: "", direction: "asc" },
    );
  };

  /** Column resizing handlers */
  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    setResizingColumn(columnKey);
    setResizeStartX(e.clientX);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizingRef.current || !resizingColumn) return;

    const delta = e.clientX - resizeStartX;
    const currentWidth = columnWidths[resizingColumn] || 200;
    const newWidth = Math.max(
      MIN_COLUMN_WIDTH,
      Math.min(MAX_COLUMN_WIDTH, currentWidth + delta),
    );

    setColumnWidths((prev) => ({
      ...prev,
      [resizingColumn]: newWidth,
    }));
    setResizeStartX(e.clientX);
  };

  const handleResizeEnd = () => {
    setResizingColumn(null);
    setTimeout(() => {
      isResizingRef.current = false;
    }, 0);
  };

  React.useEffect(() => {
    if (!isResizingRef.current) return;

    const handleMove = (e: MouseEvent) => handleResizeMove(e);
    const handleEnd = () => handleResizeEnd();

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
    };
  }, [resizingColumn, columnWidths, resizeStartX]);

  /** Selection toggles */
  const toggleRow = () => {};

  const toggleSelectAll = (checked: boolean | string) => {
    if (!isCheckbox) return;
    setSelected(checked ? new Set(sortedData.map((r) => r.id)) : new Set());
  };

  const allSelected = isCheckbox && sortedData.every((r) => selected.has(r.id));
  const someSelected =
    isCheckbox && sortedData.some((r) => selected.has(r.id)) && !allSelected;

  /** Pagination text */
  const paginationText = (() => {
    if (!pagination) return "";
    const { current, pageSize, totalDataCount = 0 } = pagination;
    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, totalDataCount);
    return `Showing ${start}-${end} of ${totalDataCount}`;
  })();

  const totalPages = pagination
    ? Math.ceil((pagination.totalDataCount || 0) / pagination.pageSize)
    : 1;

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div
      ref={tableRef}
      className={cn("w-full h-full flex flex-col", className)}
    >
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              {isCheckbox && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((col, index) => (
                <TableHead
                  key={col.key + index}
                  onClick={() =>
                    col.sortable &&
                    !col.actions &&
                    !col.renderHeader &&
                    handleSort(col.key)
                  }
                  style={{
                    width:
                      index === columns.length - 1
                        ? "100px"
                        : columnWidths[col.key] || col.width || 200,
                    maxWidth:
                      index === columns.length - 1
                        ? "100px"
                        : columnWidths[col.key] || col.width || 200,
                  }}
                  className={cn(
                    "p-0 relative overflow-hidden",
                    col.sortable &&
                      !col.actions &&
                      !col.renderHeader &&
                      "cursor-pointer select-none hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between",
                      col.renderHeader ? "justify-start p-3" : "",
                    )}
                  >
                    <div className="flex items-center flex-1">
                      {col.renderHeader ? (
                        col.renderHeader({
                          allChecked: false,
                          someChecked: false,
                          onToggle: () => {
                            // Parent handles logic via renderHeader function
                          },
                        })
                      ) : (
                        <div className="flex items-center text-nowrap group font-[450]">
                          <span>{col.label}</span>
                          {col.sortable && !col.actions && (
                            <SortIcon
                              state={
                                sortConfig?.key === col.key
                                  ? sortConfig.direction
                                  : "none"
                              }
                              active={sortConfig?.key === col.key}
                              className="ml-1"
                            />
                          )}
                        </div>
                      )}
                    </div>
                    {resizableColumns &&
                      col.resizable !== false &&
                      index !== columns.length - 1 && (
                        <div
                          onMouseDown={(e) => handleResizeStart(e, col.key)}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "w-2 h-6 cursor-e-resize  select-none transition-colors flex items-center justify-center group",
                          )}
                          title="Drag to resize column"
                        >
                          <div className="w-px h-4 bg-gray-400 group-hover:bg-brand-primary" />
                        </div>
                      )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row, idx) => (
                <TableRow
                  key={row.id + idx || idx}
                  onClick={() =>
                    isNavigate
                      ? (onNavigate?.(row) ??
                        (path && navigate(`${path}/${row.id}`)))
                      : null
                  }
                  className={cn(
                    isNavigate &&
                      (onNavigate || path) &&
                      "cursor-pointer hover:bg-accent/40 h-[60px]",
                  )}
                >
                  {isCheckbox && (
                    <TableCell className="w-10">
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={() => toggleRow()}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}

                  {columns.map((col, index) => {
                    if (col.actions?.length) {
                      return (
                        <TableCell
                          key={`${row.id + index}-actions`}
                          style={{
                            width:
                              index === columns.length - 1
                                ? "100px"
                                : columnWidths[col.key] || col.width || 200,
                            maxWidth:
                              index === columns.length - 1
                                ? "100px"
                                : columnWidths[col.key] || col.width || 200,
                          }}
                          className="whitespace-nowrap"
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DotsThreeOutlineVertical className="h-4 w-4 text-brand-primary" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {col.actions.map((action, idx) => {
                                const label =
                                  typeof action.label === "function"
                                    ? action.label(row)
                                    : action.label;
                                const icon =
                                  typeof action.icon === "function"
                                    ? action.icon(row)
                                    : action.icon;
                                const tooltipDescription =
                                  typeof action.tooltipDescription ===
                                  "function"
                                    ? action.tooltipDescription(row)
                                    : action.tooltipDescription;

                                if (
                                  action.visible === true ||
                                  (typeof action.visible === "function" &&
                                    !action.visible(row))
                                ) {
                                  return null;
                                }

                                const disabled =
                                  (typeof action?.disabled === "function"
                                    ? action.disabled(row)
                                    : action?.disabled) || false;

                                const menuItem = (
                                  <DropdownMenuItem
                                    className={cn(
                                      action?.className,
                                      disabled &&
                                        tooltipDescription &&
                                        "opacity-50",
                                    )}
                                    key={`${label}-${idx}`}
                                    disabled={disabled && !tooltipDescription}
                                    onClick={(e) => {
                                      if (disabled) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                      }
                                      e.stopPropagation();
                                      if (action.path)
                                        navigate(
                                          typeof action.path === "function"
                                            ? action.path(row)
                                            : action.path,
                                        );
                                      action.onClick?.(row);
                                    }}
                                  >
                                    {icon && (
                                      <span className="mr-2">{icon}</span>
                                    )}
                                    {label}
                                  </DropdownMenuItem>
                                );

                                if (tooltipDescription) {
                                  return (
                                    <InfoTooltip
                                      key={`${row.id}-${label}`}
                                      content={tooltipDescription}
                                      position="left"
                                      trigger={menuItem}
                                    />
                                  );
                                }

                                return menuItem;
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      );
                    }

                    const content = col.render ? col.render(row) : row[col.key];
                    const contentStr =
                      typeof content === "string" || typeof content === "number"
                        ? String(content)
                        : "";
                    const columnWidth =
                      index === columns.length - 1
                        ? 100
                        : columnWidths[col.key] ||
                          (typeof col.width === "string"
                            ? parseInt(col.width, 10)
                            : col.width) ||
                          200;

                    return (
                      <TableCellContent
                        key={col.key}
                        content={content}
                        contentStr={contentStr}
                        columnWidth={columnWidth}
                      />
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (isCheckbox ? 1 : 0)}
                  className="h-32 text-center text-gray-400 font-semibold"
                >
                  <EmptyState
                    dataNotFoundText={dataNotFoundText}
                    navigate={navigate}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 0 && (
        <div className="flex-shrink-0 bg-background  flex items-center justify-between px-2 pt-4">
          {/* Left: pagination text */}
          <span className="text-sm text-gray-500">{paginationText}</span>

          {/* Center: page buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={pagination.current === 1}
              onClick={() => pagination.onPageChange(pagination.current - 1)}
              className="h-7 w-7"
            >
              <CaretLeft className="h-3.5 w-3.5" />
            </Button>

            {generatePageNumbers(pagination.current, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={`page-${p}`}
                  variant={p === pagination.current ? "default" : "outline"}
                  size="icon"
                  onClick={() => pagination.onPageChange(p as number)}
                  className={cn(
                    "h-7 w-7",
                    p === pagination.current &&
                      "!bg-blue-200 !text-blue-950 hover:bg-blue-500",
                  )}
                >
                  {p}
                </Button>
              ),
            )}

            <Button
              variant="ghost"
              size="icon"
              disabled={pagination.current >= totalPages}
              onClick={() => pagination.onPageChange(pagination.current + 1)}
              className="h-7 w-7"
            >
              <CaretRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Right: rows per page */}
          <div className="flex items-center gap-2 whitespace-nowrap pr-2">
            <span className="text-sm text-gray-500">Items per page</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(v) => pagination.onPageSizeChange(Number(v))}
            >
              <SelectTrigger className="w-[72px] h-7">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["5", "10", "25", "50"].map((v, index) => (
                  <SelectItem key={`${v + index}`} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortableTable;
