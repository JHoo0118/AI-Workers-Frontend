/**
 * Converts a Date object or a date string to a formatted string
 * in the format of "YYYY년 MM월 DD일 HH시 mm분 ss초".
 * This function is intended for use in a Next.js environment.
 *
 * @param {Date | string} dateInput - The date to format. Can be a JavaScript Date object or an ISO date string.
 * @returns {string} The date formatted as "YYYY년 MM월 DD일 HH시 mm분 ss초".
 */
export function formatDateTime(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date input");
    return "";
  }

  const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });

  const formattedParts = dateFormatter.formatToParts(date);
  let formattedDate = "";

  formattedParts.forEach((part) => {
    switch (part.type) {
      case "year":
        formattedDate += `${part.value}년 `;
        break;
      case "month":
        formattedDate += `${parseInt(part.value)}월 `;
        break;
      case "day":
        formattedDate += `${parseInt(part.value)}일 `;
        break;
      case "hour":
        formattedDate += `${part.value}시 `;
        break;
      case "minute":
        formattedDate += `${part.value}분 `;
        break;
      case "second":
        formattedDate += `${part.value}초`;
        break;
    }
  });

  return formattedDate;
}

interface DateTimeFormatPart {
  type: "year" | "month" | "day" | "hour" | "minute" | "second";
  value: string;
}

interface PartsMap {
  year?: string;
  month?: string;
  day?: string;
  hour?: string;
  minute?: string;
  second?: string;
}

/**
 * Converts a Date object or a date string to a formatted string
 * in the format of "YYYY/MM/DD HH:mm:ss".
 * This function is suitable for a Next.js application.
 *
 * @param {Date | string} dateInput - The date to format. Can be a JavaScript Date object or an ISO date string.
 * @returns {string} The date formatted as "YYYY/MM/DD HH:mm:ss".
 */
export function formatDateTimeToYMDHMS(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Validate the date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date input");
    return "";
  }

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });

  const parts = dateFormatter.formatToParts(date) as DateTimeFormatPart[];

  const partsMap: PartsMap = {};

  parts.forEach(({ type, value }) => {
    if (type in partsMap) {
      partsMap[type] = value;
    }
  });

  const formattedDate = `${partsMap.year}/${partsMap.month}/${partsMap.day} ${partsMap.hour}:${partsMap.minute}:${partsMap.second}`;

  return formattedDate || "";
}
