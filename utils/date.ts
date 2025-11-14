export const isoToDateInput = (isoString?: string | null): string => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const dateStringToDate = (val?: string | null): Date | null => {
  if (!val) return null;
  const [year, month, day] = val.split("-").map(Number);
  return new Date(year, month - 1, day);
};