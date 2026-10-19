/** Saves a Blob through the browser's download flow. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Revoke after the browser has started the download, so the object URL doesn't leak.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}