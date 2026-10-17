import axios from "axios";

function extractMessage(data: unknown): string | null {
  if (typeof data === "string" && data.trim() !== "") return data;
  if (typeof data === "object" && data !== null) {
    if ("detail" in data && typeof data.detail === "string") return data.detail;
    if ("message" in data && typeof data.message === "string") return data.message;
    if ("title" in data && typeof data.title === "string") return data.title;
  }
  return null;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return (
        extractMessage(error.response.data) ??
        `Request failed (${error.response.status}).`
      );
    }
    return "Cannot reach the server. Check your connection and try again.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}