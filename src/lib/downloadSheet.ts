export type DownloadResult = "ok" | "unauthorized" | "error";

// Fetches the PDF and saves it. A JSON error is never saved as a file.
export async function downloadSheet(): Promise<DownloadResult> {
  try {
    const res = await fetch("/api/download", { cache: "no-store" });

    if (res.status === 401) return "unauthorized";
    if (!res.ok) return "error";

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "DoDaily-Exercise-Sheet.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return "ok";
  } catch {
    return "error";
  }
}