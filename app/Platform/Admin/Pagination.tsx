type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const page = Math.min(Math.max(currentPage, 1), totalPages);
  const firstVisible = Math.max(1, Math.min(page - 2, totalPages - 4));
  const lastVisible = Math.min(totalPages, firstVisible + 4);
  const pages: (number | "start-gap" | "end-gap")[] = [];
  if (firstVisible > 1) pages.push(1);
  if (firstVisible > 2) pages.push("start-gap");
  for (let pageNumber = firstVisible; pageNumber <= lastVisible; pageNumber += 1) {
    if (!pages.includes(pageNumber)) pages.push(pageNumber);
  }
  if (lastVisible < totalPages - 1) pages.push("end-gap");
  if (lastVisible < totalPages) pages.push(totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 px-4 py-4"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((pageNumber) => pageNumber === "start-gap" || pageNumber === "end-gap" ? (
        <span key={pageNumber} className="px-1 text-sm text-gray-400" aria-hidden="true">…</span>
      ) : (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === page ? "page" : undefined}
          className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-semibold ${
            pageNumber === page
              ? "border-rose-700 bg-rose-700 text-white"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
