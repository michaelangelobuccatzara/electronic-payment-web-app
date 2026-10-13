import type { Student } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { Icon } from "../ui/Icon";

interface InfoItemProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoItem({ label, value, valueClassName = "text-on-surface" }: InfoItemProps) {
  return (
    <div className="flex flex-col">
      <span className="font-label-sm text-label-sm text-outline">{label}</span>
      <span className={`font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}

interface StudentOverviewProps {
  student: Student;
}

export function StudentOverview({ student }: StudentOverviewProps) {
  const { details } = student;
  // Derived during render instead of stored, so it can't drift from the line items.
  const totalNetAssessed = details?.assessment.reduce((sum, line) => sum + line.amount, 0) ?? 0;

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
            Current Outstanding Balance
          </span>
          <span className="font-headline-lg text-headline-lg font-bold text-secondary font-data-tabular mt-0.5">
            {formatCurrency(student.balance)}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Billing cycle: 2nd Semester, AY 2024–2025
          </span>
        </div>
        {/* No behavior in the source. */}
        <button
          type="button"
          className="px-space-md py-space-sm bg-primary text-on-primary font-title-sm text-body-sm font-semibold rounded-lg hover:bg-primary-container transition-colors"
        >
          Payment History
        </button>
      </div>

      <section className="flex flex-col gap-space-sm">
        <h3 className="font-title-sm text-title-sm font-semibold text-on-surface">
          Biographical &amp; Contact Info
        </h3>
        <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-lg font-body-sm text-body-sm">
          <InfoItem label="Institutional Email" value={student.email} />
          <InfoItem
            label="Primary Mobile"
            value={student.phone || "—"}
            valueClassName="text-on-surface font-data-tabular"
          />
          {details && (
            <>
              <InfoItem label="Emergency Contact" value={details.emergencyContact} />
              <InfoItem
                label="Scholarship Status"
                value={details.scholarship}
                valueClassName="text-secondary"
              />
            </>
          )}
        </div>
      </section>

      {details && (
        <>
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-title-sm text-title-sm font-semibold text-on-surface">
                Assessment Breakdown
              </h3>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                {details.enrolledUnits} Enrolled Units
              </span>
            </div>
            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs font-body-sm text-body-sm">
              {details.assessment.map((line) =>
                line.amount < 0 ? (
                  <div key={line.label} className="flex justify-between text-secondary font-medium">
                    <span>{line.label}</span>
                    <span className="font-data-tabular font-semibold">
                      {formatCurrency(line.amount)}
                    </span>
                  </div>
                ) : (
                  <div key={line.label} className="flex justify-between text-on-surface-variant">
                    <span>{line.label}</span>
                    <span className="font-data-tabular font-medium text-on-surface">
                      {formatCurrency(line.amount)}
                    </span>
                  </div>
                ),
              )}
              <div className="pt-space-xs flex justify-between font-title-sm text-title-sm font-bold text-on-surface">
                <span>Total Net Assessed</span>
                <span className="font-data-tabular">{formatCurrency(totalNetAssessed)}</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <h3 className="font-title-sm text-title-sm font-semibold text-on-surface">
              Recent Transaction Log
            </h3>
            <ul className="flex flex-col gap-space-xs">
              {details.transactions.map((transaction) => (
                <li
                  key={transaction.reference}
                  className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-space-sm">
                    <Icon name="check_circle" className="text-secondary text-headline-md" />
                    <div className="flex flex-col">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        {transaction.description}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        Ref #{transaction.reference} • {transaction.date}
                      </span>
                    </div>
                  </div>
                  <span className="font-data-tabular text-data-tabular font-bold text-secondary">
                    {formatCurrency(transaction.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}