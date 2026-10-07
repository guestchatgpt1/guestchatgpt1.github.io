/** Accept only Google Sheets document URLs and return their CSV export URL. */
export const getGoogleSheetCsvUrl = (value: string): string | null => {
  try {
    const sheetUrl = new URL(value.trim());
    const match = sheetUrl.pathname.match(/^\/spreadsheets\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/);
    if (sheetUrl.protocol !== "https:" || sheetUrl.hostname !== "docs.google.com" || !match) return null;

    const fragmentGid = sheetUrl.hash.match(/(?:^#|&)gid=(\d+)/)?.[1];
    const gid = sheetUrl.searchParams.get("gid") ?? fragmentGid ?? "0";
    if (!/^\d+$/.test(gid)) return null;

    const csvUrl = new URL(`https://docs.google.com/spreadsheets/d/${match[1]}/export`);
    csvUrl.searchParams.set("format", "csv");
    csvUrl.searchParams.set("gid", gid);
    return csvUrl.toString();
  } catch {
    return null;
  }
};