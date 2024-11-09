import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { profileStyles } from "../../style/styles";
import { ProfileScreenProps } from "../../types/screen.d";

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement your login logic here
    if (username === "user" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  return (
    <View style={profileStyles.mainPage}>
      {isLoggedIn ? (
        <View style={profileStyles.loggedInContainer}>
          <Text style={profileStyles.welcomeText}>Welcome, {username}!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View style={profileStyles.loginContainer}>
          <TextInput
            style={profileStyles.input}
            placeholder="Username"
            placeholderTextColor="#dddddd"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={profileStyles.input}
            placeholder="Password"
            placeholderTextColor="#dddddd"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => handleLogin()}
            style={{
              marginTop: 20,
              marginBottom: 40,
              backgroundColor: "#1a1a1a",
              borderRadius: 5,
              alignItems: "center",
              width: 150,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                margin: 8,
                color: "#ffffff",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;
