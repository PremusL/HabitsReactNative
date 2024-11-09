import React from "react";
import { View, Text } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { RightCornerMenuProps } from "../types/screen.d";

const RightCornerMenu: React.FC<RightCornerMenuProps> = ({
  navigation,
  route,
}) => {
  console.log("routeRightCornerMenu: ", JSON.stringify(route?.params.habit_id));

  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#1a1a1a",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Menu>
        <MenuTrigger>
          <Text style={{ color: "white", fontSize: 30 }}>☰</Text>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption
            style={{ backgroundColor: "#a1a1a1" }}
            onSelect={() => navigation.navigate("HistoryScreen", route?.params)}
          >
            <Text style={{ padding: 10, fontSize: 16 }}>Habit history</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default RightCornerMenu;
