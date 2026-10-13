import { useState } from "react";
import type { PromissoryStatusFilter } from "../data/promissoryOptions";
import type { PromissoryNote, PromissoryNotesSummary } from "../types/types";
import { Pagination } from "../components/ui/Pagination";
import { PromissoryTable } from "../components/promissory/PromissoryTable";
import { PromissoryToolbar } from "../components/promissory/PromissoryToolbar";
import { ReviewDrawer } from "../components/promissory/ReviewDrawer";
import { Icon } from "../components/ui/Icon";

const PAGE_SIZE = 6;

interface PromissoryNotesProps {
  /** Seed data. The page edits its own copy in memory until a data source exists. */
  initialNotes: readonly PromissoryNote[];
  summary: PromissoryNotesSummary;
}

export function PromissoryNotes({
  initialNotes,
  summary,
}: PromissoryNotesProps) {
  const [notes, setNotes] = useState<readonly PromissoryNote[]>(initialNotes);
  const [statusFilter, setStatusFilter] =
    useState<PromissoryStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Derived during render: no extra state or effects.
  const query = searchQuery.trim().toLowerCase();
  const visibleNotes = notes.filter((note) => {
    const matchesStatus =
      statusFilter === "all" || note.status === statusFilter;
    const matchesSearch =
      query === "" ||
      note.requestId.toLowerCase().includes(query) ||
      note.studentName.toLowerCase().includes(query) ||
      note.studentNumber.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });
  const activeNote = notes.find((note) => note.requestId === activeId) ?? null;

  const totalPages = Math.ceil(summary.totalRequests / PAGE_SIZE);
  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, summary.totalRequests);

  const closeDrawer = () => setActiveId(null);

  const updateActive = (changes: Partial<PromissoryNote>) => {
    setNotes((previous) =>
      previous.map((note) =>
        note.requestId === activeId ? { ...note, ...changes } : note,
      ),
    );
    closeDrawer();
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs text-secondary mb-1">
            <Icon
              name="assignment_turned_in"
              className="text-body-md [font-variation-settings:'FILL'_1]"
            />
            <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">
              Institutional Bursar • Student Credit Desk
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Promissory Notes
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Review and process student promissory note requests and examination
            permit endorsements.
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
                Action Required
              </span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface font-data-tabular">
                {summary.pendingCount} Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      <PromissoryToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <PromissoryTable
            notes={visibleNotes}
            onOpen={(note) => setActiveId(note.requestId)}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          totalItems={summary.totalRequests}
          itemLabel="requests"
          onPageChange={setCurrentPage}
        />
      </div>

      {/* `key` remounts the drawer per note, so its notes field starts empty each time. */}
      <ReviewDrawer
        key={activeNote?.requestId ?? "closed"}
        note={activeNote}
        onClose={closeDrawer}
        onApprove={() => updateActive({ status: "approved" })}
        onReject={(reason) =>
          updateActive({
            status: "rejected",
            rejectionReason: reason || undefined,
          })
        }
      />
    </div>
  );
}
