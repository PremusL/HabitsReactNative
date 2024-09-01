const formatDate = (dateString) => {
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
const calculateDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const differenceInTime = end - start; // Difference in milliseconds
  const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
  return Math.round(differenceInDays); // Round to the nearest whole number
};
const generateMarkedDates = (startDate, endDate) => {
  let currentDate = new Date(startDate);
  endDate = new Date(endDate);

  const markedDates = {};

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];

    if (dateStr === startDate) {
      markedDates[dateStr] = {
        startingDay: true,
        color: "#70d7c7",
        textColor: "white",
      };
    } else if (dateStr === endDate.toISOString().split("T")[0]) {
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
  console.log("markedDates: ", typeof markedDates);
  return markedDates;
};

export {
  formatDate,
  getTodaysDate,
  generateMarkedDates,
  calculateDaysDifference,
};
