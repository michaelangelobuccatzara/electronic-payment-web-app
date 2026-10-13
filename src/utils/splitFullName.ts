export interface NameParts {
  firstName: string;
  middleName: string;
  lastName: string;
}

/**
 * "Maria Teresa Mendoza" -> Maria / Teresa / Mendoza.
 * Leading words ending in "." are honorifics and stay with the first name,
 * so "Dr. Roberto Gonzales" -> "Dr. Roberto" / "" / Gonzales and re-joins unchanged.
 */
export function splitFullName(fullName: string): NameParts {
  const words = fullName.split(/\s+/).filter((word) => word !== "");

  let honorificCount = 0;
  while (honorificCount < words.length - 1 && words[honorificCount].endsWith(".")) {
    honorificCount += 1;
  }

  const honorifics = words.slice(0, honorificCount);
  const rest = words.slice(honorificCount);

  if (rest.length <= 1) {
    return { firstName: [...honorifics, ...rest].join(" "), middleName: "", lastName: "" };
  }

  return {
    firstName: [...honorifics, rest[0]].join(" "),
    middleName: rest.slice(1, -1).join(" "),
    lastName: rest[rest.length - 1],
  };
}