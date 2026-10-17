export interface FullNameProps {
  firstName: string;
  middleName: string | null;
  lastName: string;
}

export function formatFullName({
  firstName,
  middleName,
  lastName,
}: FullNameProps) {
  return middleName
    ? `${firstName} ${middleName[0].toUpperCase()}. ${lastName}`
    : `${firstName} ${lastName}`;
}
