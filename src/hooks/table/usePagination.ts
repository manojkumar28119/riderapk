import { useState } from "react";

export const usePagination = (initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const onPageChange = (page: number) => setCurrentPage(page);

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    onPageChange,
    onPageSizeChange,
  };
};
