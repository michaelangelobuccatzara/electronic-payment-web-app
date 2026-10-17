import type { StaffMember } from "../../types/types";
import { formatFullName } from "../../utils/formatFullName";
import { Icon } from "../ui/Icon";

const CELL = "py-3 px-4";
const HEADER_CELL = `${CELL} font-semibold`;

interface RowActionProps {
  icon: string;
  label: string;
  target: string;
  hoverClassName: string;
  onClick?: () => void;
}

function RowAction({
  icon,
  label,
  target,
  hoverClassName,
  onClick,
}: RowActionProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={`${label}: ${target}`}
      onClick={onClick}
      className={`p-1 rounded-xs text-outline transition-colors ${hoverClassName}`}
    >
      <Icon name={icon} className="text-body-lg" />
    </button>
  );
}

interface StaffTableProps {
  staff: readonly StaffMember[];
  onRevoke: (member: StaffMember) => void;
  onEdit: (member: StaffMember) => void;
}

export function StaffTable({ staff, onRevoke, onEdit }: StaffTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <caption className="sr-only">Staff members</caption>
      <thead>
        <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
          <th scope="col" className={HEADER_CELL}>
            Staff ID
          </th>
          <th scope="col" className={HEADER_CELL}>
            Full Name
          </th>
          <th scope="col" className={HEADER_CELL}>
            Email
          </th>
          <th scope="col" className={`${HEADER_CELL} text-right`}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y-0 text-on-surface font-body-md text-body-md">
        {staff.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className={`${CELL} text-center text-on-surface-variant`}
            >
              No staff members match your search.
            </td>
          </tr>
        ) : (
          staff.map((member) => {
            return (
              <tr
                key={member.id}
                className="hover:bg-surface-container-low transition-colors"
              >
                <td
                  className={`${CELL} font-data-tabular text-data-tabular font-semibold text-primary`}
                >
                  {member.schoolId}
                </td>
                <td className={CELL}>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-md text-body-md font-semibold text-on-surface leading-tight">
                      {formatFullName({
                        firstName: member.firstName,
                        middleName: member.lastName,
                        lastName: member.lastName,
                      })}
                    </span>
                  </div>
                </td>
                <td
                  className={`${CELL} text-on-surface-variant font-data-tabular text-data-tabular`}
                >
                  {member.username}
                </td>
                {/* <td className={CELL}>
                  <StatusBadge tone={badge.tone} label={badge.label} size="md" />
                </td> */}
                <td className={`${CELL} text-right`}>
                  <div className="inline-flex items-center gap-1">
                    <RowAction
                      icon="edit"
                      label="Edit Credentials"
                      target={formatFullName({
                        firstName: member.firstName,
                        middleName: member.lastName,
                        lastName: member.lastName,
                      })}
                      hoverClassName="hover:text-on-surface hover:bg-surface-container"
                      onClick={() => onEdit(member)}
                    />
                    <RowAction
                      icon="delete"
                      label="Revoke Access"
                      target={formatFullName({
                        firstName: member.firstName,
                        middleName: member.lastName,
                        lastName: member.lastName,
                      })}
                      hoverClassName="hover:text-error hover:bg-error-container"
                      onClick={() => onRevoke(member)}
                    />
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
