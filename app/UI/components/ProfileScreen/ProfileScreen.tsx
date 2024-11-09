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
import { useLoginContext } from "../Contexts/LoginContext";
import { login, register } from "../Login/LoginUtil";

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { isLoggedIn, setLogin } = useLoginContext();
  const [registration, setRegistration] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    setLogin(false);
    setUsername("");
    setPassword("");
  };
  const handleRegister = async () => {
    const result = await register(username, password);
    if (result) {
      setLogin(true);
    } else {
      console.log("Login failed");
    }
  };

  const handleLogin = async () => {
    const result = await login(username, password);
    if (result) {
      console.log(result);
      setLogin(true);
    } else {
      console.log("Login failed");
    }
  };

  return (
    <View style={profileStyles.mainPage}>
      {isLoggedIn ? (
        <View style={profileStyles.loggedInContainer}>
          <Text style={profileStyles.welcomeText}>Welcome, {username}!</Text>
          <TouchableOpacity
            onPress={handleLogout}
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
            <Text style={{ fontSize: 18, margin: 8, color: "white" }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {registration ? (
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
              <TextInput
                style={profileStyles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#dddddd"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <TouchableOpacity
                onPress={handleRegister}
                style={{
                  marginTop: 10,
                  marginBottom: 4,
                  backgroundColor: "#1a1a1a",
                  borderRadius: 5,
                  alignItems: "center",
                  width: 150,
                  alignSelf: "center",
                }}
              >
                <Text style={{ fontSize: 18, margin: 8, color: "white" }}>
                  Register
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRegistration(false)}>
                <Text style={profileStyles.switchText}>Back to Login</Text>
              </TouchableOpacity>
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
                onPress={handleLogin}
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
                <Text style={{ fontSize: 18, margin: 8, color: "white" }}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRegistration(true)}>
                <Text style={profileStyles.switchText}>Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};
