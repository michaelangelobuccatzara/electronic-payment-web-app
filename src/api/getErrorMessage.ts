import axios from "axios";

/** ASP.NET validation responses: { errors: { Field: ["message", ...] } } */
function extractValidationErrors(data: object): string | null {
  if (!("errors" in data) || typeof data.errors !== "object" || data.errors === null) return null;

  const messages = Object.values(data.errors).flatMap((value: unknown) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [],
  );
  return messages.length > 0 ? messages.join(" ") : null;
}

function extractMessage(data: unknown): string | null {
  if (typeof data === "string" && data.trim() !== "") return data;
  if (typeof data !== "object" || data === null) return null;

  const validation = extractValidationErrors(data);
  if (validation !== null) return validation;

  if ("detail" in data && typeof data.detail === "string") return data.detail;
  if ("message" in data && typeof data.message === "string") return data.message;
  if ("title" in data && typeof data.title === "string") return data.title;
  return null;
}

function describeStatus(status: number): string {
  if (status === 400) return "The server rejected the submitted values. Please check them and try again.";
  if (status === 404) return "The requested item could not be found. Refresh the page and try again.";
  return `Request failed (${status}).`;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return extractMessage(error.response.data) ?? describeStatus(error.response.status);
    }
    return "Cannot reach the server. Check your connection and try again.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}