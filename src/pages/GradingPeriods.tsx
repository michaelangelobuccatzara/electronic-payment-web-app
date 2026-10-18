import { useState } from "react";
import { AddGradingPeriodModal } from "../components/gradingPeriod/AddGradingPeriodModal";
import { CurrentPeriodBanner } from "../components/gradingPeriod/CurrentPeriodBanner";
import { PeriodTable } from "../components/gradingPeriod/PeriodTable";
import { PeriodToolbar } from "../components/gradingPeriod/PeriodToolbar";
import { PRIMARY_BUTTON_CLASS } from "../components/gradingPeriod/periodStyles";
import { semesterService } from "../components/gradingPeriod/semesterService";
import { TermsStatCard } from "../components/gradingPeriod/TermsStatCard";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { Icon } from "../components/ui/Icon";
import { useApiQuery } from "../hooks/useApiQuery";
import type { GradingPeriodRecord } from "../types/types";
import { formatAcademicYear } from "../utils/gradingPeriod";

export function GradingPeriods() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // `getCurrent` is a stable reference, so it can be passed directly.
  const { data: semester, error, isLoading, reload } = useApiQuery(semesterService.getCurrent);

  // Derived during render: no extra state or effects.
  const periods = semester
    ? [...semester.gradingPeriods].sort((a, b) => a.sequence - b.sequence)
    : [];
  const academicYear = semester
    ? formatAcademicYear(semester.schoolYearFrom, semester.schoolYearTo)
    : "";
  const query = searchQuery.trim().toLowerCase();
  const visiblePeriods =
    query === ""
      ? periods
      : periods.filter(
          (period) =>
            period.name.toLowerCase().includes(query) || period.chargeDueDate.includes(query),
        );

  const closeAddModal = () => setIsAddOpen(false);
  // Placeholders until the POST and PUT endpoints are wired.
  const handleSavePeriod = () => closeAddModal();
  const handleEdit = (_period: GradingPeriodRecord) => {
    // TODO: open the edit modal for this period.
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-xs mb-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Academic Schedule Governance
            </span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-outline" />
            <span className="font-label-sm text-label-sm text-outline">Institutional Configuration</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Grading Periods
          </h1>
        </div>
        <div className="flex items-center gap-space-sm self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            aria-haspopup="dialog"
            className={`inline-flex items-center gap-space-xs ${PRIMARY_BUTTON_CLASS}`}
          >
            <Icon name="add_circle" className="text-body-md" />
            <span>Add Grading Period</span>
          </button>
        </div>
      </div>

      {error !== null && <ErrorAlert message={error} onRetry={reload} />}

      {semester === undefined ? (
        isLoading && (
          <p role="status" className="font-body-md text-body-md text-on-surface-variant">
            Loading current semester…
          </p>
        )
      ) : (
        <>
          <CurrentPeriodBanner semester={semester} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
            <TermsStatCard label="Configured Terms" value={periods.length} badge={academicYear} />
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-xs flex flex-col overflow-hidden">
            <PeriodToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div
              aria-busy={isLoading}
              className={`overflow-x-auto w-full transition-opacity ${isLoading ? "opacity-60" : ""}`}
            >
              <PeriodTable
                periods={visiblePeriods}
                academicYear={academicYear}
                emptyMessage={
                  periods.length === 0
                    ? "No grading periods configured yet."
                    : "No grading periods match your search."
                }
                onEdit={handleEdit}
              />
            </div>
            <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm text-body-sm font-body-sm text-on-surface-variant">
              <div className="flex items-center gap-space-xs">
                <Icon name="info" className="text-body-md text-outline" />
                <p>
                  Showing {visiblePeriods.length} of {periods.length} registered grading windows
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <AddGradingPeriodModal
        isOpen={isAddOpen}
        defaultAcademicYear={academicYear}
        onClose={closeAddModal}
        onSave={handleSavePeriod}
      />
    </div>
  );
}