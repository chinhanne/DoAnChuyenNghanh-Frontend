// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={`page-button ${currentPage === i ? 'active' : ''}`}
        onClick={() => onPageChange(i)}
        style={{
          border:'none',
          width:40,
          height:40
        }}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="pagination d-flex justify-content-center mt-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          border:'none'
        }}
      ><i class="fa-solid fa-arrow-left"></i>
      </button>
      {pages}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          border:'none'
        }}
      >
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
