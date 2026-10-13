import { useState } from "react";
import type { PaymentMethodFilter } from "../data/paymentOptions";
import type { PaymentsSummary, PaymentTransaction } from "../types/types";
import { formatCurrency } from "../utils/formatCurrency";
import { PaymentStatCard } from "../components/payment/PaymentStatCard";
import { PaymentsTable } from "../components/payment/PaymentsTable";
import { PaymentsToolbar } from "../components/payment/PaymentsToolbar";
import { ReceiptModal } from "../components/payment/ReceiptModal";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";

const PAGE_SIZE = 6;

interface PaymentsProps {
  transactions: readonly PaymentTransaction[];
  summary: PaymentsSummary;
}

export function Payments({ transactions, summary }: PaymentsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<PaymentMethodFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  // The reference stays set after closing so the modal keeps its content while it fades out.
  const [receiptReference, setReceiptReference] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Derived during render: no extra state or effects.
  const query = searchQuery.trim().toLowerCase();
  const visibleTransactions = transactions.filter((transaction) => {
    const matchesMethod = methodFilter === "all" || transaction.method === methodFilter;
    const matchesSearch =
      query === "" ||
      transaction.referenceNo.toLowerCase().includes(query) ||
      transaction.studentName.toLowerCase().includes(query) ||
      transaction.studentNumber.toLowerCase().includes(query);
    return matchesMethod && matchesSearch;
  });
  const receiptTransaction =
    transactions.find((transaction) => transaction.referenceNo === receiptReference) ?? null;

  const totalPages = Math.ceil(summary.totalTransactions / PAGE_SIZE);
  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, summary.totalTransactions);

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
            Track, verify, and reconcile school tuition and assessment payment transactions.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          {/* No behavior in the source (it only showed an alert). */}
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
          label="Total Collected"
          value={formatCurrency(summary.totalCollected)}
          icon="account_balance_wallet"
          variant="primary"
        />
        <PaymentStatCard
          label="Total Transactions"
          value={summary.totalTransactions.toLocaleString("en-US")}
          icon="receipt_long"
          variant="neutral"
        />
      </div>

      <PaymentsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        methodFilter={methodFilter}
        onMethodFilterChange={setMethodFilter}
      />

      <div className="bg-surface-container-lowest rounded-lg shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <PaymentsTable
            transactions={visibleTransactions}
            onViewReceipt={(transaction) => {
              setReceiptReference(transaction.referenceNo);
              setIsReceiptOpen(true);
            }}
          />
        </div>
        <Pagination
          variant="compact"
          currentPage={currentPage}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          totalItems={summary.totalTransactions}
          itemLabel="transactions"
          onPageChange={setCurrentPage}
        />
      </div>

      <ReceiptModal
        isOpen={isReceiptOpen}
        transaction={receiptTransaction}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}