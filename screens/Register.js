import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import Title from '../components/Title';
import { useState } from 'react';
//firebase
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';

import { useUserAuth } from '../useContext';
import Loading from '../components/Loading';

const StudentRegister = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollno, setRollno] = useState('');
    const [branch, setBranch] = useState('');
    const [college, setCollege] = useState('');
    const [role, setRole] = useState('Student');
    const [clickedBtn, setClickedBtn] = useState(false);
    const [firebaseError, setFirebaseError] = useState('');
    const [error, setError] = useState({
        Name: '',
        NameLen: '',
        Email: '',
        Password: '',
        PasswordLen: '',
        Rollno: '',
        Branch: '',
        College: '',
        submitBtn: '',
    });

    const { signup } = useUserAuth();

    const validation = () => {
        if(!name || !email || !password || !rollno || !branch || !college) {
            setError({
                ...error,
                submitBtn: 'Please fill in all the fields'
            })
        }
        else {
            setError({
                ...error,
                submitBtn: ''
            })
        }
    };

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
                await signup(email, password)
                    .then(async (res) => {
                        setClickedBtn(true);
                        const userId = res.user.uid;
                        const docRef = doc(db, 'Users', userId);
                        await setDoc(docRef, data)
                            .then(() => {
                                alert("Registration Successful");
                                role === 'Student' ? navigation.navigate('Dashboard') : navigation.navigate('CoordinatorDashboard');
                            }, (err) => {
                                setFirebaseError(err.message);
                                console.log(err)
                            }
                            )
                            .catch(err => console.log(err));
                    }, err => {
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
            setPassword(value);
            if (value.length < 6) {
                setError({ ...error, PasswordLen: 'Password must be atleast 6 characters long' })
            }
            else {
                setError({ ...error, PasswordLen: '' })
            }
        }
        else if (name === 'Email') {
            setEmail(value);
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
        }
    }

    return (
        !clickedBtn ? (<ScrollView>
            <View style={styles.container}>
                <Title />
                <View style={styles.pageTitle}>
                    <Text style={styles.pageTitleText}>Register</Text>
                </View>
                <View style={styles.error}>
                    <Text style={styles.errorText}>{firebaseError}</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.formText}>Name</Text>
                    <TouchableOpacity
                        style={styles.formInput}
                    >
                        <TextInput
                            style={styles.formInputText}
                            placeholder="Enter Name"
                            value={name}
                            onChangeText={(value) => onChange(value, 'Name')}
                        />
                    </TouchableOpacity>
                    {!error.Name ? null : <Text style={styles.errorText}>{error.Name}</Text>}
                    <Text style={styles.formText}>Email</Text>
                    <TouchableOpacity
                        style={styles.formInput}
                    >
                        <TextInput
                            style={styles.formInputText}
                            placeholder="Enter Email"
                            value={email}
                            onChangeText={(value) => onChange(value, 'Email')}
                        />
                    </TouchableOpacity>
                    {!error.Email ? null : <Text style={styles.errorText}>{error.Email}</Text>}
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
                    {!error.Password ? null : <Text style={styles.errorText}>{error.Password}</Text>}
                    <Text style={styles.formText}>Role</Text>
                    <View
                        style={styles.formInput}>
                        <Picker
                            selectedValue={role}
                            style={styles.formInputText}
                            onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
                        >
                            <Picker.Item label="Student" value="Student" />
                            <Picker.Item label="Coordinator" value="Coordinator" />
                        </Picker>
                    </View>
                    <Text style={styles.formText}>Institute Roll no.</Text>
                    <TouchableOpacity
                        style={styles.formInput}
                    >
                        <TextInput
                            style={styles.formInputText}
                            placeholder="BTECH/XXXXX/XX"
                            value={rollno}
                            onChangeText={(value) => onChange(value, 'Rollno')}
                        />
                    </TouchableOpacity>
                    {!error.Rollno ? null : <Text style={styles.errorText}>{error.Rollno}</Text>}
                    <Text style={styles.formText}>Branch</Text>
                    <TouchableOpacity
                        style={styles.formInput}
                    >
                        <TextInput
                            style={styles.formInputText}
                            placeholder="Enter Branch"
                            value={branch}
                            onChangeText={(value) => onChange(value, 'Branch')}
                        />
                    </TouchableOpacity>
                    {!error.Branch ? null : <Text style={styles.errorText}>{error.Branch}</Text>}
                    <Text style={styles.formText}>College</Text>
                    <TouchableOpacity
                        style={styles.formInput}
                    >
                        <TextInput
                            style={styles.formInputText}
                            placeholder="Enter College"
                            value={college}
                            onChangeText={(value) => onChange(value, 'College')}
                        />
                    </TouchableOpacity>
                    {!error.College ? null : <Text style={styles.errorText}>{error.College}</Text>}
                </View>
                <View style={styles.form} >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
                {!error.submitBtn ? null : <Text style={styles.errorText}>{error.submitBtn}</Text>}
                <View style={styles.bottom}>
                    <Text>Already a Member?
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.bottomText}>{' '}SignIn</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </View>
        </ScrollView>
        ) : (
            <Loading loadingMsg={"getting things ready!"} />
        )
    );
};

export default StudentRegister;

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
        marginBottom: 12,
    },
    formInputText: {
        borderRadius: 16,
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
        marginBottom: 1,
        marginTop: 5,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '600',
    },
    bottom: {
        marginTop: 5,
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

