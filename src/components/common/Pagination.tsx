import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaretLeft, CaretRight } from "@data/constants/icons.constants";
import { PaginationConstants } from "@data/constants/pagination.constants";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalDataCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const generatePageNumbers = (current: number, total: number) => {
  if (total <= 7) return [...Array(total)].map((_, i) => i + 1);
  const range = (s: number, e: number) =>
    Array.from({ length: e - s + 1 }, (_, i) => s + i);
  if (current <= 4) return [...range(1, 5), "...", total];
  if (current >= total - 3) return [1, "...", ...range(total - 4, total)];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalDataCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PaginationConstants.defaultPageSizeOptions,
}) => {
  const totalPages = Math.ceil(totalDataCount / pageSize);

  const paginationText =
    totalDataCount > 0
      && `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalDataCount)} of ${totalDataCount}`;

  if (totalPages === 0) return null;

  return (
    <div className="flex-shrink-0 bg-background h-[40px] flex items-center justify-between px-4 pt-2">
      <span className="text-sm text-gray-500">{paginationText}</span>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-7 w-7"
        >
          <CaretLeft className="h-3.5 w-3.5" />
        </Button>

        {generatePageNumbers(currentPage, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(p as number)}
              className={cn(
                "h-7 w-7",
                p === currentPage &&
                  "!bg-blue-200 !text-blue-950 hover:bg-blue-500"
              )}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-7 w-7"
        >
          <CaretRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 whitespace-nowrap pr-2">
        <span className="text-sm text-gray-500">Items per page</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="w-[72px] h-7">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((v) => (
              <SelectItem key={v} value={String(v)}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
