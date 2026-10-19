import { useCallback, useState } from "react";
import { PaymentStatCard } from "../components/payment/PaymentStatCard";
import { PaymentsTable } from "../components/payment/PaymentsTable";
import { PaymentsToolbar } from "../components/payment/PaymentsToolbar";
import { paymentService } from "../components/payment/paymentService";
import { ReceiptModal } from "../components/payment/ReceiptModal";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { useApiQuery } from "../hooks/useApiQuery";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { PaymentRecord } from "../types/types";

export function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const searchTerm = useDebouncedValue(searchQuery.trim(), 300);

  // A new search starts from page 1 (adjusted during render, so no extra request fires).
  const [pageSearchTerm, setPageSearchTerm] = useState(searchTerm);
  if (pageSearchTerm !== searchTerm) {
    setPageSearchTerm(searchTerm);
    setCurrentPage(1);
  }

  const fetchPayments = useCallback(
    (signal: AbortSignal) =>
      paymentService.getPagination(currentPage, searchTerm, signal),
    [currentPage, searchTerm],
  );
  const { data, error, isLoading, reload } = useApiQuery(fetchPayments);

  const rangeStart =
    data && data.totalCount > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const rangeEnd = data
    ? Math.min(data.page * data.pageSize, data.totalCount)
    : 0;

  // The id stays set after closing so the modal keeps its content while it fades out.
  const [receiptPaymentId, setReceiptPaymentId] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const handleViewReceipt = (payment: PaymentRecord) => {
    setReceiptPaymentId(payment.id);
    setIsReceiptOpen(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm uppercase tracking-wider mb-1">
            <span>Bursary &amp; Accounting</span>
            <span aria-hidden="true">/</span>
            <span className="text-primary font-semibold">Ledger Ingestion</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
            Payments
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Track, verify, and reconcile school tuition and assessment payment
            transactions.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          {/* No behavior yet: there is no export endpoint. */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded-lg shadow-xs hover:bg-surface-container-low transition-colors"
          >
            <Icon name="file_download" className="text-body-lg text-outline" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
        <PaymentStatCard
          label="Total Transactions"
          value={data ? data.totalCount.toLocaleString("en-US") : "—"}
          icon="receipt_long"
          variant="neutral"
        />
      </div>

      <PaymentsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {error !== null && (
        <div className="mb-space-md">
          <ErrorAlert message={error} onRetry={reload} />
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-lg shadow-xs overflow-hidden flex flex-col">
        <div
          aria-busy={isLoading}
          className={`overflow-x-auto transition-opacity ${
            isLoading && data !== undefined ? "opacity-60" : ""
          }`}
        >
          {data === undefined ? (
            isLoading && (
              <p
                role="status"
                className="p-space-lg font-body-md text-body-md text-on-surface-variant"
              >
                Loading payments…
              </p>
            )
          ) : (
            <PaymentsTable
              payments={data.items}
              emptyMessage={
                searchTerm === ""
                  ? "No payments yet."
                  : "No payments match your search."
              }
              onViewReceipt={handleViewReceipt}
            />
          )}
        </div>
        {data !== undefined && (
          <Pagination
            variant="compact"
            currentPage={data.page}
            totalPages={data.totalPages}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalItems={data.totalCount}
            itemLabel="transactions"
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ReceiptModal
        isOpen={isReceiptOpen}
        paymentId={receiptPaymentId}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
