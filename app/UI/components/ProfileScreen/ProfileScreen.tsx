import React, {useEffect, useState} from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Button,
    TextInput,
} from "react-native";
import {profileStyles} from "../../style/styles";
import {ProfileScreenProps} from "../../types/screen.d";
import {useUserContext} from "../Contexts/UserContext";
import {login, register} from "../Login/LoginUtil";

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
    const {user_id, setUser} = useUserContext();
    const [registration, setRegistration] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const clearAll = () => {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        setSuccessMessage("");
    }

    useEffect(() => {
        clearAll();
    }, []);

    const handleLogout = () => {
        setUser(null);
        setUsername("");
        setPassword("");
    };
    const isPasswordLengthValid = (password: string, minLength: number, maxLength: number): boolean => {
        return password.length >= minLength && password.length <= maxLength;
    };

    const handleRegister = async () => {
        if (!isPasswordLengthValid(password, 2, 60)) {
            setErrorMessage("Password is too short. It must be at least 8 characters long.");
            setSuccessMessage("");
        } else {
            const result = await register(username, password);
            if (result.user_id != null && result.error === 0) {
                console.log("success: " + result);
                setUser(result.userId);
                setRegistration(false);
                clearAll();
                setSuccessMessage("Successfully registered, now you can login");
            } else if (result.user_id === null && result.error === 409) {
                setErrorMessage("Username already exists");
                setSuccessMessage("");
            } else {
                console.log(result);
                setErrorMessage("Registration failed");
                setSuccessMessage("");
                setUser(null);
            }
        }

    };


    const handleLogin = async () => {
        const result = await login(username, password);
        if (result) {
            console.log(result);
            setUser(result.user_id);
        } else {
            console.log("Login failed");
            setUser(null);
        }
    };

    return (
        <View style={profileStyles.mainPage}>
            {user_id ? (
                <View style={profileStyles.loggedInContainer}>
                    <Text style={profileStyles.welcomeText}>Welcome: {username}!</Text>
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
                        <Text style={{fontSize: 18, margin: 8, color: "white"}}>
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {registration ? (
                        <View style={profileStyles.registrationContainer}>
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
                            {errorMessage ? (
                                <Text style={{color: "red", textAlign: "center"}}>
                                    {errorMessage}
                                </Text>
                            ) : null}
                            {successMessage ? (
                                <Text style={{color: "green", textAlign: "center"}}>
                                    {successMessage}
                                </Text>
                            ) : null}
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
                                <Text style={{fontSize: 18, margin: 8, color: "white"}}>
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
                                <Text style={{fontSize: 18, margin: 8, color: "white"}}>
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
