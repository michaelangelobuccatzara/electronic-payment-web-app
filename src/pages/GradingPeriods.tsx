import { useState } from "react";
import {
  DEFAULT_ACADEMIC_YEAR_FILTER,
  type AcademicYearFilter,
} from "../data/gradingPeriodOptions";
import type { GradingPeriod, GradingPeriodsSummary } from "../types/types";
import { getPeriodName } from "../utils/gradingPeriod";
import { AddGradingPeriodModal } from "../components/gradingPeriod/AddGradingPeriodModal";
import { CurrentPeriodBanner } from "../components/gradingPeriod/CurrentPeriodBanner";
import { PeriodTable } from "../components/gradingPeriod/PeriodTable";
import { PeriodToolbar } from "../components/gradingPeriod/PeriodToolbar";
import { PRIMARY_BUTTON_CLASS } from "../components/gradingPeriod/periodStyles";
import { TermsStatCard } from "../components/gradingPeriod/TermsStatCard";
import { Icon } from "../components/ui/Icon";

interface GradingPeriodsProps {
  periods: readonly GradingPeriod[];
  summary: GradingPeriodsSummary;
}

export function GradingPeriods({ periods, summary }: GradingPeriodsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<AcademicYearFilter>(DEFAULT_ACADEMIC_YEAR_FILTER);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Derived during render: no extra state or effects.
  const currentPeriod = periods.find((period) => period.status === "current") ?? null;
  const yearScoped =
    yearFilter === "all" ? periods : periods.filter((period) => period.academicYear === yearFilter);
  const query = searchQuery.trim().toLowerCase();
  const visiblePeriods =
    query === ""
      ? yearScoped
      : yearScoped.filter(
          (period) =>
            getPeriodName(period).toLowerCase().includes(query) ||
            period.academicYear.toLowerCase().includes(query),
        );

  const closeAddModal = () => setIsAddOpen(false);
  // Persisting a new period needs a data source, which isn't decided yet.
  const handleSavePeriod = () => closeAddModal();

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

      {currentPeriod && <CurrentPeriodBanner period={currentPeriod} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <TermsStatCard
          label="Configured Terms"
          value={summary.configuredTerms}
          badge={summary.coverageLabel}
        />
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-xs flex flex-col overflow-hidden">
        <PeriodToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          yearFilter={yearFilter}
          onYearFilterChange={setYearFilter}
        />
        <div className="overflow-x-auto w-full">
          <PeriodTable periods={visiblePeriods} />
        </div>
        <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm text-body-sm font-body-sm text-on-surface-variant">
          <div className="flex items-center gap-space-xs">
            <Icon name="info" className="text-body-md text-outline" />
            <p>
              Showing {visiblePeriods.length} of {yearScoped.length} registered grading windows
              {yearFilter !== "all" && ` for ${yearFilter}`}
            </p>
          </div>
        </div>
      </div>

      <AddGradingPeriodModal
        isOpen={isAddOpen}
        defaultAcademicYear={currentPeriod?.academicYear ?? ""}
        onClose={closeAddModal}
        onSave={handleSavePeriod}
      />
    </div>
  );
}