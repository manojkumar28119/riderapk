// EX:2025-12-01T00:00:00.000Z convert to  25-09-2025
export const formatDateIST = (date: Date | undefined): string => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const parseISODate = (str: string | undefined): Date | undefined => {
  if (!str) return undefined;
  
  if (str === "00-00-0000" || str === "0000-00-00") return undefined;
  
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const formatISODateToIST = (isoDateString: string | undefined): string => {
  const date = parseISODate(isoDateString);
  return formatDateIST(date) || "00-00-0000";
};

export function formatDateTime(input: string | Date): string {
  const date = new Date(input);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const formatTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const time = formatTime(date);

  if (isSameDay(date, today)) {
    return `Today | ${time}`;
  }

  if (isSameDay(date, yesterday)) {
    return `Yesterday | ${time}`;
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year} | ${time}`;
}


