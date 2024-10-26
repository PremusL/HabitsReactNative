import React, { useEffect, useCallback, useContext } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { HomeScreenProps, SecondScreenProps } from "../types/screen.d";
import { styles } from "../style/styles";
import { HabitType } from "../types/habit.d";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";

import { useSqLiteContext } from "./Contexts/SqLiteContext";

// const db = open({
//   name: "queries.sqlite",
//   encryptionKey: "password",
// });

// db.execute("DROP TABLE IF EXISTS User");
// db.execute(
//   "CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)"
// );
// const result = db.execute("INSERT INTO User (name, age) VALUES ('John', 1)");

// const queryrResult = db.execute("SELECT * FROM User");

// console.log("Query result: " + queryrResult);
// console.warn("Query result: " + queryrResult);

const SecondScreen: React.FC<SecondScreenProps> = ({ navigation }) => {
  const { data, fetchData } = useSqLiteContext();

  const fetchAndPrintData = async () => {
    await fetchData();
    console.log(data);
  };

  // const markedDates = generateMarkedDates(currentDate, getTodaysDate());
  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX > 50) {
      navigation.navigate("Home"); // Replace "NewScreen" with your target screen name
    }
    if (nativeEvent.translationX < -50) {
      navigation.navigate("Profile"); // Replace "NewScreen" with your target screen name
    }
  };
  useFocusEffect(useCallback(() => {}, []));
  useEffect(() => {
    const testSql = async () => {
      const db = await SQLite.openDatabaseAsync("localhabits.db");

      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
        INSERT INTO test (value, intValue) VALUES ('test1', 123);
        INSERT INTO test (value, intValue) VALUES ('test2', 456);
        INSERT INTO test (value, intValue) VALUES ('test3', 789);
        `);

      const allRows: any = await db.getAllAsync("SELECT * FROM test");
      for (const row of allRows) {
        console.log(row.id, row.value, row.intValue);
      }
    };
    testSql();
  }, []);
  return (
    <View style={styles.mainPage}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles2.scrollView}>
          <Button title="Fetch Data" onPress={fetchAndPrintData}></Button>
          <Text style={styles2.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SecondScreen;

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
