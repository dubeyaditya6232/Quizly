import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView,BackHandler} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Title from '../components/Title'
import React, { useState,useEffect } from 'react'
import { useUserAuth } from '../useContext';

import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import DateTimePicker from '@react-native-community/datetimepicker';
import { TimePicker } from 'react-native-simple-time-picker';


const CreateTest = ({ navigation }) => {

    const { user } = useUserAuth();

    const [testName, setTestName] = useState('')
    const [testTime, setTestTime] = useState(new Date());
    const [testDuration, setTestDuration] = useState({
        hours: 2,
        minutes: 30,
        seconds: 0
    });
    const [date, setDate] = useState(new Date());
    const [showDateSelector, setShowDateSelector] = useState(false);
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    const [error, setError] = useState({
        testName: '',
        submitBtn: true
    });

    const handleSave = async () => {
        
        const collectionRef = collection(db, 'Test');
        const data = {
            coordinatorId: user.uid,
            testName: testName,
            testDate: date,
            testTime: testTime,
            testDuration: testDuration,
            testCode: `${testName}${Date.now()}`,
            testStatus: 'Pending'
        }
        await addDoc(collectionRef, data)
            .then(async (res) => {
                await AsyncStorage.setItem('testId', JSON.stringify(res.id))
                navigation.navigate('AddQuestions')
            }, err => console.log(err))
            .catch(err => console.log(err))
    };

    const onChange = (text, name) => {
        setTestName(text);
        if (text === '') {
            setError({ ...error, [name]: 'Test name is required' })
        }
        else if(text.length < 3) {
            setError({ ...error, [name]: 'Test name must be atleast 3 characters' }) 
        }
        else {
            setError({ ...error, [name]: '', submitBtn: false })
        }
    }

    useEffect(() => {
        const onBackPress = () => {
            navigation.navigate('CoordinatorDashboard')
            return true;
        }

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Title />
                <View style={styles.pageTitle} >
                    <Text style={styles.pageTitleText}>Create Test</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Test Name</Text>
                    <TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Test Name"
                            onChangeText={(text) => onChange(text, 'testName')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.error}>{error.testName}</Text>
                    <Text style={styles.inputLabel}>Test Date</Text>
                    <TouchableOpacity
                        onPress={() => setShowDateSelector(true)}
                    >
                        {showDateSelector && <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            is24Hour={true}
                            onChange={(event, selectedDate) => {
                                setDate(selectedDate || date);
                                setShowDateSelector(false)
                            }}
                        />}
                        <TextInput
                            style={styles.input}
                            placeholder="Select Test Date"
                            editable={false}
                            placeholderTextColor="white"
                            value={JSON.stringify(date.getDate()) + "/" + JSON.stringify(date.getMonth() + 1) + "/" + JSON.stringify(date.getFullYear())}
                        />
                    </TouchableOpacity>
                    <Text style={styles.inputLabel}>Test Time </Text>
                    {showTimeSelector && <DateTimePicker
                        testID="timePicker"
                        value={testTime}
                        mode="time"
                        display="default"
                        is24Hour={false}
                        onChange={(event, selectedtime) => {
                            setTestTime(selectedtime || testTime);
                            setShowTimeSelector(false)
                        }}
                    />}
                    <TouchableOpacity
                        onPress={() => setShowTimeSelector(true)}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Test Time"
                            editable={false}
                            value={JSON.stringify(testTime.getHours()) + ":" + JSON.stringify(testTime.getMinutes())}
                        />
                    </TouchableOpacity>
                    <Text style={styles.inputLabel}>Test Duration (hrs:mins)</Text>
                    <View style={styles.TimePicker}>
                        <TimePicker
                            selectedHours={testDuration.hours}
                            selectedMinutes={testDuration.minutes}
                            onChange={({ hours, minutes, seconds }) => {
                                setTestDuration({ hours, minutes, seconds });
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSave}
                        disabled={error.submitBtn}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <Text style={styles.notice}>fill all the details to continue</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default CreateTest

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        height: '100%',
    },
    pageTitle: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 8
    },
    form: {
        padding: 16,
    },
    input: {
        borderRadius: 16,
        backgroundColor: '#184E77',
        padding: 8,
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 16,
        paddingVertical: 8,
    },
    button: {
        marginTop: 16,
        backgroundColor: 'green',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    buttonText: {
        fontSize: 18,
    },
    TimePicker: {
        backgroundColor: '#184E77',
        borderRadius: 16,
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
    notice: {
        fontSize: 12,
        fontStyle: 'italic',
    }
})