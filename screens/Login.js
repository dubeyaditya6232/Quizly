import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React from 'react';
import Title from '../components/Title';
import Loading from '../components/Loading.js';
import { useState } from 'react';
import { useUserAuth } from '../useContext';

import { db } from '../firebase'
import { doc, getDoc } from "firebase/firestore";

import { styles, containerStyles, titleStyles, formStyles, errorStyles } from '../styles/styles';

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
            return false;
        }
        else {
            if (email === '' && password === '') {
                setFormError({ ...formError, Email: "required", Password: "required" })
                return false
            }
            else if (email === '') {
                setFormError({ ...formError, Email: "required" })
                return false
            }
            else if (password === '') {
                setFormError({ ...formError, Password: "required" })
                return false
            }

            return true;
        }
    }

    const handleSubmit = async () => {
        if (validation()) {
            try {
                setClickedBtn(true);
                await login(email, password)
                    .then(async (res) => {
                        setEmail('');
                        setPassword('');
                        if (res.user.emailVerified) {
                            const docRef = doc(db, "Users", res.user.uid);
                            await getDoc(docRef)
                                .then(doc => {
                                    const data = doc.data();
                                    if (data.role === 'Student') {
                                        setClickedBtn(false);
                                        navigation.navigate('Dashboard');
                                    }
                                    else {
                                        setClickedBtn(false);
                                        navigation.navigate('CoordinatorDashboard');
                                    }
                                }, err => {
                                    setError(err.message);
                                    console.log(err)
                                })
                                .catch(err => { console.log(err) })
                        }
                        else {
                            alert('Please verify your email');
                            setClickedBtn(false);
                        }
                    }, err => {
                        setClickedBtn(false);
                        setError(err.message);
                        console.log(err)
                    })
                    .catch(err => console.log(err));
            }
            catch (err) {
                console.log(err);
            }
        }

    };

    const onChange = (text, name) => {

        if (name === 'Email') {
            setEmail(text.trim());
            if (text === '') {
                setFormError({ ...formError, Email: 'Email is required' })
            }
            else {
                setFormError({ ...formError, Email: '', Error: '' })
            }
        }
        else {
            setPassword(text.trim());
            if (text === '') {
                setFormError({ ...formError, [name]: 'Password is required' })
            }
            else {
                setFormError({ ...formError, "Password": '', Error: '' })
            }
        }
    };
    const onFocus = (name) => {
        setTouched({ ...touched, [name]: true })
        setError('')
    }

    return (
        !clickedBtn ? (
            <ScrollView>
                <View style={containerStyles.container}>
                    <Title />
                    <View style={titleStyles.pageTitle}>
                        <Text style={titleStyles.pageTitleText}>Login</Text>
                    </View>
                    <View style={errorStyles.error}>
                        <Text style={errorStyles.errorText}>{error}</Text>
                    </View>
                    <View style={formStyles.form}>
                        <Text style={formStyles.formText}>Email</Text>
                        <TouchableOpacity
                            style={formStyles.formInput}
                        >
                            <TextInput
                                style={formStyles.formInputText}
                                placeholder="Enter email"
                                value={email}
                                onChangeText={(value) => onChange(value, 'Email')}
                                onFocus={() => { onFocus('Email') }}
                            />
                        </TouchableOpacity>
                        {formError.Email !== '' ? (
                            <Text style={errorStyles.errorText}>{formError.Email}</Text>
                        ) : (null)}
                        <Text style={formStyles.formText}>password</Text>
                        <TouchableOpacity
                            style={formStyles.formInput}
                        >
                            <TextInput
                                style={formStyles.formInputText}
                                placeholder="Enter Password"
                                value={password}
                                secureTextEntry={true}
                                onChangeText={(value) => onChange(value, 'Password')}
                                onFocus={() => { onFocus('Password') }}
                            />
                        </TouchableOpacity>
                        {formError.Password !== '' ? (
                            <Text style={errorStyles.errorText}>{formError.Password}</Text>
                        ) : (null)}
                    </View>
                    <View style={formStyles.form} >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        {formError.Error !== '' ? (
                            <Text style={errorStyles.errorText}>{formError.Error}</Text>
                        ) : (null)}
                        <View style={styles.bottom}>
                            <Text>Not a Member?
                                <TouchableOpacity
                                    onPress={() => {
                                        setFormError({ ...formError, Email: '', Password: '', Error: '' })
                                        setTouched({ ...touched, Email: false, Password: false })
                                        setEmail('');
                                        setPassword('');
                                        setError('');
                                        setClickedBtn(false);
                                        navigation.navigate('Register')
                                    }}
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
