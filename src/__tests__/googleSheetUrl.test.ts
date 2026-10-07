import { describe, expect, it } from "vitest";
import { getGoogleSheetCsvUrl } from "@/lib/googleSheetUrl";

describe("Google Sheets source URL", () => {
  it("converts a shared spreadsheet link into the selected tab's CSV export", () => {
    expect(getGoogleSheetCsvUrl("https://docs.google.com/spreadsheets/d/abc_123/edit?gid=42#gid=42"))
      .toBe("https://docs.google.com/spreadsheets/d/abc_123/export?format=csv&gid=42");
  });

  it("rejects non-Sheets URLs and malformed tab identifiers", () => {
    expect(getGoogleSheetCsvUrl("https://example.com/spreadsheets/d/abc/edit")).toBeNull();
    expect(getGoogleSheetCsvUrl("https://docs.google.com/document/d/abc/edit")).toBeNull();
    expect(getGoogleSheetCsvUrl("https://docs.google.com/spreadsheets/d/abc/edit?gid=oops")).toBeNull();
  });
});