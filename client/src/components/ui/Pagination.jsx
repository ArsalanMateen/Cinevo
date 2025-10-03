import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i);
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.paginationBtn} ${styles.paginationBtnArrow} ${currentPage === 0 ? styles.paginationBtnDisabled : ""}`}
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`${styles.paginationBtn} ${page === currentPage ? styles.paginationBtnActive : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ),
      )}

      <button
        className={`${styles.paginationBtn} ${styles.paginationBtnArrow} ${currentPage >= totalPages - 1 ? styles.paginationBtnDisabled : ""}`}
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage >= totalPages - 1}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
