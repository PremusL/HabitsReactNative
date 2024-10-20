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
    throw new Error("Invalid date format");
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
        textColor: "white",
      };
    } else if (dateStr === finalDate.toISOString().split("T")[0]) {
      markedDates[dateStr] = {
        endingDay: true,
        color: markerColor,
        textColor: "white",
      };
    } else {
      markedDates[dateStr] = { color: markerColor, textColor: "white" };
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

export {
  formatDate,
  getTodaysDate,
  generateMarkedDates,
  calculateDaysDifference,
  calculateTimeDifference,
  timeToString,
  stringToTime,
};
