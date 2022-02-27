import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import React from 'react';
import Title from '../components/Title';
import { useState } from 'react';



const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        alert('under construction');
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Title />
                <View style={styles.pageTitle}>
                    <Text style={styles.pageTitleText}>Admin Login</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.formText}>Email</Text>
                    <TouchableOpacity
                        style={styles.formInput}
                    >
                        <TextInput
                            style={styles.formInputText}
                            placeholder="Enter email"
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.formText}>password</Text>
                    <TouchableOpacity
                        style={styles.formInput}
                    >
                        <TextInput
                            style={styles.formInputText}
                            placeholder="Enter Password"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(value) => setPassword(value)}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 16,
        height: '100%',
    },
    pageTitle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageTitleText: {
        fontSize: 24,
        fontWeight: '600',
    },
    form: {
        padding: 16,
    },
    formText: {
        fontSize: 18,
        padding: 4
    },
    formInput: {
        marginBottom: 12,
    },
    formInputText: {
        borderRadius: 12,
        backgroundColor: '#184E77',
        color: 'black',
        padding: 8,
    },
    button: {
        width: '100%',
        backgroundColor: 'green',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '600',
    },
});

