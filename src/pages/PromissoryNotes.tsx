import { useCallback, useState } from "react";
import { PromissoryTable } from "../components/promissory/PromissoryTable";
import { PromissoryToolbar } from "../components/promissory/PromissoryToolbar";
import { promissoryService } from "../components/promissory/promissoryService";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { Pagination } from "../components/ui/Pagination";
import { useApiQuery } from "../hooks/useApiQuery";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { ReviewDrawer } from "../components/promissory/ReviewDrawer";
import type {
  ApprovePromissory,
  PromissoryRecord,
  RejectPromissory,
} from "../types/types";

export function PromissoryNotes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const searchTerm = useDebouncedValue(searchQuery.trim(), 300);

  // A new search starts from page 1 (adjusted during render, so no extra request fires).
  const [pageSearchTerm, setPageSearchTerm] = useState(searchTerm);
  if (pageSearchTerm !== searchTerm) {
    setPageSearchTerm(searchTerm);
    setCurrentPage(1);
  }

  const fetchNotes = useCallback(
    (signal: AbortSignal) =>
      promissoryService.getPagination(currentPage, searchTerm, signal),
    [currentPage, searchTerm],
  );
  const { data, error, isLoading, reload } = useApiQuery(fetchNotes);

  const rangeStart =
    data && data.totalCount > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const rangeEnd = data
    ? Math.min(data.page * data.pageSize, data.totalCount)
    : 0;

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleOpen = (note: PromissoryRecord) => setActiveId(note.id);
  const closeDrawer = () => setActiveId(null);

  // Errors propagate to the drawer, which displays them. Close and refresh only on success.
  const handleApprove = async (id: string, request: ApprovePromissory) => {
    await promissoryService.approve(id, request);
    closeDrawer();
    reload();
  };

  const handleReject = async (id: string, request: RejectPromissory) => {
    await promissoryService.reject(id, request);
    closeDrawer();
    reload();
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-xs">
        <div className="flex flex-col">
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Promissory Notes
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Review and process student promissory note requests.
          </p>
        </div>

        <div className="flex items-center gap-space-md self-start md:self-auto bg-surface-container-low p-space-sm rounded-lg">
          <div className="flex items-center gap-space-sm px-space-md py-space-xs bg-surface-container-lowest rounded-xs shadow-xs">
            <div
              aria-hidden="true"
              className="w-2 h-8 rounded-full bg-tertiary-container"
            />
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase text-outline">
                Total Requests
              </span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface font-data-tabular">
                {data?.totalCount ?? "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <PromissoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {error !== null && <ErrorAlert message={error} onRetry={reload} />}

      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div
          aria-busy={isLoading}
          className={`overflow-x-auto w-full transition-opacity ${
            isLoading && data !== undefined ? "opacity-60" : ""
          }`}
        >
          {data === undefined ? (
            isLoading && (
              <p
                role="status"
                className="p-space-lg font-body-md text-body-md text-on-surface-variant"
              >
                Loading promissory notes…
              </p>
            )
          ) : (
            <PromissoryTable
              notes={data.items}
              emptyMessage={
                searchTerm === ""
                  ? "No promissory notes yet."
                  : "No promissory notes match your search."
              }
              onOpen={handleOpen}
            />
          )}
        </div>
        <ReviewDrawer
          promissoryId={activeId}
          onClose={closeDrawer}
          onApprove={handleApprove}
          onReject={handleReject}
        />{" "}
        {data !== undefined && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalItems={data.totalCount}
            itemLabel="requests"
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
