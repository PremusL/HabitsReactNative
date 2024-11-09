import { StyleSheet } from "react-native";

export const historyStyles = StyleSheet.create({
  mainPage: {
    flex: 1,
    backgroundColor: "#777777", // Dark background color
    padding: 16,
  },
});

export const profileStyles = StyleSheet.create({
  mainPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#777777", // Dark background color
    padding: 16,
  },
  loginContainer: {
    width: "80%",
    maxWidth: 400,
    aspectRatio: 1, // Make it a square
    padding: 16,
    backgroundColor: "#555555", // Darker background for the container
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  loggedInContainer: {
    width: "80%",
    maxWidth: 400,
    aspectRatio: 1, // Make it a square
    padding: 16,
    backgroundColor: "#666666", // Darker background for the container
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333", // Darker border color
    borderRadius: 8,
    color: "#FFF", // White text color
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 16,
    color: "#FFF", // White text color
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    alignItems: "center",
    width: 150,
    alignSelf: "center",
  },
});

const baseMargin = {
  marginBottom: 15,
};
const baseSubMargin = {
  marginBottom: 10,
};
export const habitScreenStyles = StyleSheet.create({
  subtitle: {
    ...baseMargin,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  subsectionText: {
    ...baseMargin,
    fontSize: 19,
    fontWeight: "600",
    textAlign: "center",
  },
  editSubtitleText: {
    ...baseSubMargin,
    fontSize: 16,
    textAlign: "center",
    textWeight: "bold",
  },
  set_button: {
    width: 100,
    height: 90,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    color: "#fff",
  },
});

export const habitCreationScreenStyles = StyleSheet.create({
  subsectionText: {
    ...baseMargin,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  descriptionInput: {
    ...baseMargin,
    fontSize: 14,
    height: 100,
    borderBottomColor: "black",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  titleInput: {
    ...baseMargin,
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  titleText: {
    ...baseMargin,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
  },
  modal: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#777777",
  },
  basicText: {
    ...baseMargin,
    fontSize: 17,
  },
  smallColorView: {
    ...baseMargin,
    width: 20,
    height: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  intensitySlider: {
    ...baseMargin,
  },
  intensityCheckBox: {
    ...baseMargin,
    backgroundColor: "#cccccc",
  },
  chooseBtn: {
    ...baseMargin,

    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    alignItems: "center",
  },
  switch: {
    ...baseMargin,
    marginLeft: "30%",
    marginRight: 20,
  },
});

const baseButtonStyle = {
  alignItems: "center",
  justifyContent: "center",
  width: 50,
  height: 50,
  borderRadius: 25,
  position: "absolute",
  bottom: 30,
  right: 30,
  zIndex: 1,
};

export const buttonStyles = StyleSheet.create({
  addButton: {
    ...baseButtonStyle,
  },
  removeButton: {
    ...baseButtonStyle,
    left: 30,
    backgroundColor: "darkred",
  },
  frequencyButton: {
    ...baseButtonStyle,
    backgroundColor: "darkblue",
  },
});

export const styles = StyleSheet.create({
  navigationBar: {
    ...baseMargin,
    backgroundColor: "darkblue",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 5.84,
  },
  mainPage: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#777777",
  },
  addButton: {
    backgroundColor: "darkblue",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  removeButton: {
    backgroundColor: "darkred",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  habitCard: {
    ...baseMargin,
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedHabitCard: {
    padding: 20, // Increase padding to extend the card size
    backgroundColor: "#f0f0f0", // Optional: change background color for selected card
  },
  habit_view: {
    // alignContent: 'center',
    alignItems: "center",
    // justifyContent: 'center', // center vertically
    backgroundColor: "#888888",
    paddingTop: 20,
    flex: 1,
  },
  input: {
    ...baseMargin,
    height: 40,
    width: 230,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    // padding: 10,
  },

  container: {
    flex: 1,
    backgroundColor: "#ff00",
    alignItems: "center",
    justifyContent: "center",
    height: 400,
  },
  grid_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start",
    // backgroundColor: '#f00',
    height: 500,
    marginTop: 50,
  },
  set_button: {
    width: 100,
    height: 90,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    color: "#fff",
  },

  grid_item: {
    width: "50%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'orange',
    // margin: 2,
  },
  grid_text: {
    fontSize: 24,
    marginTop: 10,
  },
  box: {
    ...baseMargin,
    width: 40,
    height: 40,
  },
});
