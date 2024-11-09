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
          <Button title="Logout" onPress={handleLogout} />
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
              <Button title="Register" onPress={handleRegister} />
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
              <Button title="Login" onPress={() => handleLogin()} />
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
