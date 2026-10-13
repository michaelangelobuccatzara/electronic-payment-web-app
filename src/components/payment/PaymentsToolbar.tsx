import { useId } from "react";
import {
  isPaymentMethodFilter,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  type PaymentMethodFilter,
} from "../../data/paymentOptions";
import { Icon } from "../ui/Icon";

interface PaymentsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  methodFilter: PaymentMethodFilter;
  onMethodFilterChange: (value: PaymentMethodFilter) => void;
}

export function PaymentsToolbar({
  searchQuery,
  onSearchChange,
  methodFilter,
  onMethodFilterChange,
}: PaymentsToolbarProps) {
  const methodId = useId();

  return (
    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-xs mb-space-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
      <div className="flex-1 relative">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none"
        />
        <input
          type="text"
          aria-label="Search payments"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by reference number, student name, or ID..."
          className="w-full pl-10 pr-4 py-2 bg-background text-on-surface placeholder:text-outline text-body-md font-body-md rounded-lg focus:outline-hidden focus:bg-surface-container-lowest transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-space-sm">
        <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg">
          <label
            htmlFor={methodId}
            className="font-label-sm text-label-sm text-outline uppercase font-semibold"
          >
            Method:
          </label>
          <select
            id={methodId}
            value={methodFilter}
            onChange={(event) => {
              const value = event.target.value;
              if (isPaymentMethodFilter(value)) onMethodFilterChange(value);
            }}
            className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Methods</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {PAYMENT_METHOD_LABELS[method]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}