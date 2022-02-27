import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import Title from '../components/Title';
import { useState } from 'react';
//firebase
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';

import { useUserAuth } from '../useContext';
import Loading from '../components/Loading';

import { styles, containerStyles, titleStyles, formStyles, errorStyles } from '../styles/styles';

const StudentRegister = ({ navigation }) => {

    const { logout } = useUserAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollno, setRollno] = useState('');
    const [branch, setBranch] = useState('');
    const [college, setCollege] = useState('');
    const [role, setRole] = useState('Student');
    const [loading, setLoading] = useState(false);
    const [clickedBtn, setClickedBtn] = useState(false);
    const [firebaseError, setFirebaseError] = useState('');
    const errorState = {
        Name: '',
        NameLen: '',
        Email: '',
        Password: '',
        PasswordLen: '',
        Rollno: '',
        Branch: '',
        College: '',
        submitBtn: '',
    }
    const [error, setError] = useState({
        ...errorState
    });

    const { signup } = useUserAuth();

    const validation = () => {
        if (!name || !email || !password || !rollno || !branch || !college) {
            setError({
                ...error,
                submitBtn: 'Please fill in all the fields'
            })
            return false
        }
        else {
            setError({
                ...error,
                submitBtn: ''
            })
            return true
        }
    };

    const resetFormFields = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRollno('');
        setBranch('');
        setCollege('');
    }

    const handleSubmit = async (e) => {
        const data = {
            name,
            email,
            rollno,
            branch,
            college,
            role
        }
        if (validation()) {
            try {
                setLoading(true);
                await signup(email, password)
                    .then(async (res) => {
                        resetFormFields();
                        sendEmailVerification(res.user)
                            .then(async () => {
                                setLoading(false);
                                setClickedBtn(true);
                                const userId = res.user.uid;
                                const docRef = doc(db, 'Users', userId);
                                await setDoc(docRef, data)
                                    .then(async () => {
                                        if (res.user.emailVerified) {
                                            setClickedBtn(false);
                                            role === 'Student' ? navigation.navigate('Dashboard') : navigation.navigate('CoordinatorDashboard');
                                        }
                                        else {
                                            alert('Please verify your email');
                                            await logout()
                                                .then(() => {
                                                    setClickedBtn(false);
                                                    navigation.navigate('Login');
                                                }, (err) => console.log(err))
                                                .catch(err => console.log(err));
                                        }
                                    }, (err) => {
                                        setClickedBtn(false);
                                        setFirebaseError(err.message);
                                        console.log(err)
                                    }
                                    )
                                    .catch(err => console.log(err));
                            })

                    }, err => {
                        setLoading(false);
                        setFirebaseError(err.message);
                        console.log(err)
                    })
                    .catch(err => console.log(err))
            }
            catch (err) {
                console.log(err.message);
            }
        }
    };

    const onChange = (value, name) => {
        if (name === 'Name') {
            setName(value);
            if (value.length < 4) {
                setError({ ...error, NameLen: 'Name must be atleast 4 characters long' })
            }
            else {
                setError({ ...error, NameLen: '' })
            }
        }
        else if (name === 'Password') {
            setPassword(value.trim());
            if (value.length < 6) {
                setError({ ...error, PasswordLen: 'Password must be atleast 6 characters long' })
            }
            else {
                setError({ ...error, PasswordLen: '' })
            }
        }
        else if (name === 'Email') {
            setEmail(value.trim());
        }
        else if (name === 'Rollno') {
            setRollno(value);
        }
        else if (name === 'Branch') {
            setBranch(value);
        }
        else if (name === 'College') {
            setCollege(value);
        }
        if (value === '') {
            setError({ ...error, [name]: `${name} is required` })
        }
        else {
            setError({ ...error, [name]: '', submitBtn: '' })
            setFirebaseError('')
        }
    }

    return (
        loading ? <Loading loadingMsg={'Getting things ready!...'} /> : (
            !clickedBtn ? (<ScrollView>
                <View style={containerStyles.container}>
                    <Title />
                    <View style={titleStyles.pageTitle}>
                        <Text style={titleStyles.pageTitleText}>Register</Text>
                    </View>
                    <View style={errorStyles.error}>
                        <Text style={errorStyles.errorText}>{firebaseError}</Text>
                    </View>
                    <View style={formStyles.form}>
                        <Text style={formStyles.formText}>Name</Text>
                        <TouchableOpacity
                            style={formStyles.formInput}
                        >
                            <TextInput
                                style={formStyles.formInputText}
                                placeholder="Enter Name"
                                value={name}
                                onChangeText={(value) => onChange(value, 'Name')}
                            />
                        </TouchableOpacity>
                        {!error.Name ? null : <Text style={errorStyles.errorText}>{error.Name}</Text>}
                        <Text style={formStyles.formText}>Email</Text>
                        <TouchableOpacity
                            style={formStyles.formInput}
                        >
                            <TextInput
                                style={formStyles.formInputText}
                                placeholder="Enter Email"
                                value={email}
                                onChangeText={(value) => onChange(value, 'Email')}
                            />
                        </TouchableOpacity>
                        {!error.Email ? null : <Text style={errorStyles.errorText}>{error.Email}</Text>}
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
                            />
                        </TouchableOpacity>
                        {!error.Password ? null : <Text style={errorStyles.errorText}>{error.Password}</Text>}
                        <Text style={formStyles.formText}>Role</Text>
                        <View
                            style={formStyles.formInput}>
                            <Picker
                                selectedValue={role}
                                style={styles1.formSelect}
                                onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
                            >
                                <Picker.Item label="Student" value="Student" />
                                <Picker.Item label="Coordinator" value="Coordinator" />
                            </Picker>
                        </View>
                        <Text style={formStyles.formText}>Institute Roll no.</Text>
                        <TouchableOpacity
                            style={formStyles.formInput}
                        >
                            <TextInput
                                style={formStyles.formInputText}
                                placeholder="BTECH/XXXXX/XX"
                                value={rollno}
                                onChangeText={(value) => onChange(value, 'Rollno')}
                            />
                        </TouchableOpacity>
                        {!error.Rollno ? null : <Text style={errorStyles.errorText}>{error.Rollno}</Text>}
                        <Text style={formStyles.formText}>Branch</Text>
                        <TouchableOpacity
                            style={formStyles.formInput}
                        >
                            <TextInput
                                style={formStyles.formInputText}
                                placeholder="Enter Branch"
                                value={branch}
                                onChangeText={(value) => onChange(value, 'Branch')}
                            />
                        </TouchableOpacity>
                        {!error.Branch ? null : <Text style={errorStyles.errorText}>{error.Branch}</Text>}
                        <Text style={formStyles.formText}>College</Text>
                        <TouchableOpacity
                            style={formStyles.formInput}
                        >
                            <TextInput
                                style={formStyles.formInputText}
                                placeholder="Enter College"
                                value={college}
                                onChangeText={(value) => onChange(value, 'College')}
                            />
                        </TouchableOpacity>
                        {!error.College ? null : <Text style={errorStyles.errorText}>{error.College}</Text>}
                    </View>
                    <View style={styles.form} >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    {!error.submitBtn ? null : <Text style={errorStyles.errorText}>{error.submitBtn}</Text>}
                    <View style={styles.bottom}>
                        <Text>Already a Member?
                            <TouchableOpacity
                                onPress={() => {
                                    setError({ ...error, ...errorState })
                                    navigation.navigate('Login')
                                }}
                            >
                                <Text style={styles.bottomText}>{' '}SignIn</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </View>
            </ScrollView>
            ) : (
                <Loading loadingMsg={"Signing in...."} />
            )
        ));
};

export default StudentRegister;

const styles1 = StyleSheet.create({
    formSelect: {
        backgroundColor: '#4a8cff',
        color: '#fff',
    },
});

