import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import React from 'react';
import Title from '../components/Title';
import Loading from '../components/Loading.js';
import { useState } from 'react';
import { useUserAuth } from '../useContext';

import { db } from '../firebase'
import { doc, getDoc } from "firebase/firestore";

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clickedBtn, setClickedBtn] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState({
        Email: '',
        Password: '',
        Error: ''
    });
    const [touched, setTouched] = useState({
        Email: false,
        Password: false
    });
    const { login } = useUserAuth();

    const validation = () => {
        if (!touched.Email || !touched.Password) {
            setFormError({ ...formError, Error: 'Please fill in all the fields' })
        }
        else {
            if (formError.Email === '' || formError.Password === '') {
                setFormError({ ...formError, 'Error': '' })
                return true;
            }
        }
        return false;
    }

    const handleSubmit = async () => {
        if (validation()) {
            try {
                await login(email, password)
                    .then(async (res) => {
                        setClickedBtn(true);
                        setEmail('');
                        setPassword('');
                        const docRef = doc(db, "Users", res.user.uid);
                        await getDoc(docRef)
                            .then(doc => {
                                const data = doc.data();
                                if (data.role === 'Student') {
                                    navigation.navigate('Dashboard');
                                }
                                else {
                                    navigation.navigate('CoordinatorDashboard');
                                }
                            }, err => {
                                setError(err.message);
                                console.log(err)
                            })
                            .catch(err => { console.log(err) })
                    }, err => {
                        setError(err.message);
                        console.log(err)
                    })
                    .catch(err => console.log(err));
            }
            catch (err) {
                console.log(err);
            }
            setClickedBtn(false);
        }

    };

    const onChange = (text, name) => {

        if (name === 'Email') {
            setEmail(text);
            if (text === '') {
                setFormError({ ...formError, Email: 'Email is required' })
            }
            else {
                setFormError({ ...formError, Email: '', Error: '' })
                setError('');
            }
        }
        else {
            setPassword(text);
            if (text === '') {
                setFormError({ ...formError, [name]: 'Password is required' })
            }
            else {
                setFormError({ ...formError, "Password": '', Error: '' })
                setError('');
            }
        }
        setTouched({ ...touched, [name]: true })
    };

    return (
        !clickedBtn ? (
            <ScrollView>
                <View style={styles.container}>
                    <Title />
                    <View style={styles.pageTitle}>
                        <Text style={styles.pageTitleText}>Login</Text>
                    </View>
                    <View style={styles.error}>
                        <Text style={styles.errorText}>{error}</Text>
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
                                onChangeText={(value) => onChange(value, 'Email')}
                            />
                        </TouchableOpacity>
                        {formError.Email !== '' ? (
                            <Text style={styles.errorText}>{formError.Email}</Text>
                        ) : (null)}
                        <Text style={styles.formText}>password</Text>
                        <TouchableOpacity
                            style={styles.formInput}
                        >
                            <TextInput
                                style={styles.formInputText}
                                placeholder="Enter Password"
                                value={password}
                                secureTextEntry={true}
                                onChangeText={(value) => onChange(value, 'Password')}
                            />
                        </TouchableOpacity>
                        {formError.Password !== '' ? (
                            <Text style={styles.errorText}>{formError.Password}</Text>
                        ) : (null)}
                    </View>
                    <View style={styles.form} >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        {formError.Error !== '' ? (
                            <Text style={styles.errorText}>{formError.Error}</Text>
                        ) : (null)}
                        <View style={styles.bottom}>
                            <Text>Not a Member?
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Register')}
                                >
                                    <Text style={styles.bottomText}>{' '}Sign Up</Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        ) : (
            <Loading loadingMsg="signing in..." />
        )
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
        paddingHorizontal: 16,
    },
    formText: {
        fontSize: 18,
        padding: 4
    },
    formInput: {
        marginBottom: 10,
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
        padding: 8,
        borderRadius: 16,
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 1,
        marginTop: 5,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '600',
    },
    bottom: {
        alignItems: 'center',
    },
    bottomText: {
        fontSize: 16,
        paddingHorizontal: 8,
        color: '#184E77',
    },
    error: {
        alignItems: 'center',
        padding: 6,
    },
    errorText: {
        color: "red",
    }
});

