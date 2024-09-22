import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  navigationBar: {
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
    backgroundColor: "#cccccc",
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
    padding: 10,
    margin: 10,
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
    backgroundColor: "#cccccc",
    paddingTop: 20,
    flex: 1,
  },
  input: {
    height: 40,
    width: 230,
    margin: 12,
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
    width: 40,
    height: 40,
  },
});
export default styles;
