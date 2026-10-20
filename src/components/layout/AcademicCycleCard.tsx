import { semesterService } from "../gradingPeriod/semesterService";
import { useApiQuery } from "../../hooks/useApiQuery";
import { formatAcademicYear } from "../../utils/gradingPeriod";
import { StatusBadge } from "../ui/StatusBadge";

export function AcademicCycleCard() {
  // Module-level method with no `this`, so its identity is stable across renders.
  const { data: semester, error, isLoading, reload } = useApiQuery(semesterService.getCurrent);

  return (
    <div className="bg-surface-container-lowest p-space-md rounded-lg border border-outline-variant flex flex-col gap-space-xs">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
          Academic Cycle
        </span>
        {semester && <StatusBadge tone="success" label="Active" />}
      </div>

      {semester ? (
        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
          {formatAcademicYear(semester.schoolYearFrom, semester.schoolYearTo)} • {semester.name}{" "}
          Semester
        </span>
      ) : error !== null ? (
        <div role="alert" className="flex items-center justify-between gap-space-sm">
          <span className="font-body-sm text-body-sm text-error">Couldn't load</span>
          <button
            type="button"
            onClick={reload}
            className="font-label-sm text-label-sm font-semibold text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      ) : (
        isLoading && (
          <span role="status" className="font-body-sm text-body-sm text-on-surface-variant">
            Loading…
          </span>
        )
      )}
    </div>
  );
}