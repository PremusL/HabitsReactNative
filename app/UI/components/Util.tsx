const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return "Date is not defined";
  }
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
const getTodaysDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const calculateDaysDifference = (
  startDate: string | undefined,
  endDate: string
): number => {
  if (!startDate || !endDate) {
    throw new Error("Missing date");
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }
  const differenceInTime = Math.abs(end.getTime() - start.getTime()); // Difference in milliseconds
  const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
  return Math.round(differenceInDays); // Round to the nearest whole number
};
const calculateTimeDifference = (
  startDateTime: string,
  endDateTime: string
): string => {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    // throw new Error("Invalid date format");
    return "empty";
  }

  const differenceInMilliseconds = Math.abs(end.getTime() - start.getTime());

  const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);

  return (
    days +
    " days, " +
    hours +
    " hours, " +
    minutes +
    " minutes, " +
    seconds +
    " seconds"
  );
};

const generateMarkedDates = (
  startDate: string,
  endDate: string,
  markerColor: string
) => {
  const currentDate = new Date(startDate);
  const finalDate = new Date(endDate);

  const markedDates: any = {};

  while (currentDate <= finalDate) {
    const dateStr = currentDate.toISOString().split("T")[0];

    if (dateStr === startDate) {
      markedDates[dateStr] = {
        startingDay: true,
        color: markerColor,
        textColor: getTextColorBasedOnBackground(markerColor),
      };
    } else if (dateStr === finalDate.toISOString().split("T")[0]) {
      markedDates[dateStr] = {
        endingDay: true,
        color: markerColor,
        textColor: getTextColorBasedOnBackground(markerColor),
      };
    } else {
      markedDates[dateStr] = {
        color: markerColor,
        textColor: getTextColorBasedOnBackground(markerColor),
      };
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return markedDates;
};

const timeToString = (time: Date): string => {
  return (
    (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) +
    ":" +
    (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) +
    ":00"
  );
};

function stringToTime(timeString: string | undefined): Date {
  if (!timeString) {
    throw new Error("Time is not defined");
  }
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
}

/**
 * Converts a hex color to its RGB components.
 * @param hex - The hex color string.
 * @returns An array containing the RGB components.
 */
function hexToRgb(hex: string): [number, number, number] {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

/**
 * Calculates the luminance of an RGB color.
 * @param r - The red component.
 * @param g - The green component.
 * @param b - The blue component.
 * @returns The luminance value.
 */
function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Selects black or white text color based on the given background color.
 * @param backgroundColor - The background color in hex format.
 * @returns "black" or "white" based on the luminance of the background color.
 */
function getTextColorBasedOnBackground(backgroundColor: string): string {
  const [r, g, b] = hexToRgb(backgroundColor);
  const bgLuminance = luminance(r, g, b);
  return bgLuminance > 0.5 ? "black" : "white";
}

export {
  formatDate,
  getTodaysDate,
  generateMarkedDates,
  calculateDaysDifference,
  calculateTimeDifference,
  timeToString,
  stringToTime,
  getTextColorBasedOnBackground,
};
