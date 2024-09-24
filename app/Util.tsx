const formatDate = (dateString: string) => {
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
const calculateDaysDifference = (startDate: string | undefined, endDate: string): number => {
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


const generateMarkedDates = (startDate: string, endDate: string) => {
  const currentDate = new Date(startDate);
  const finalDate = new Date(endDate);
  
  const markedDates: any = {};

  while (currentDate <= finalDate) {
    const dateStr = currentDate.toISOString().split("T")[0];

    if (dateStr === startDate) {
      markedDates[dateStr] = {
        startingDay: true,
        color: "#70d7c7",
        textColor: "white",
      };
    } else if (dateStr === finalDate.toISOString().split("T")[0]) {
      markedDates[dateStr] = {
        endingDay: true,
        color: "#70d7c7",
        textColor: "white",
      };
    } else {
      markedDates[dateStr] = { color: "#70d7c7", textColor: "white" };
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return markedDates;
};

export {
  formatDate,
  getTodaysDate,
  generateMarkedDates,
  calculateDaysDifference,
};
