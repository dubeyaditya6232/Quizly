import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import uuid from 'react-native-uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimePicker } from 'react-native-simple-time-picker';
import { Icon } from 'react-native-elements';

const EditTest = ({ navigation, route }) => {
    const { test } = route.params;
    // eslint-disable-next-line no-unused-vars
    const [ques, setQues] = useState({
        questionId: uuid.v4(),
        question: '',
        options: [{
            optionId: uuid.v4(),
            option: ''
        }],
        answer: '',
    });
    const [testName, setTestName] = useState(test.testName ? test.testName : '');
    const [testTime, setTestTime] = useState(test.testTime ? test.testTime.toDate() : new Date());
    const [date, setDate] = useState(test.testDate ? test.testDate.toDate() : new Date());
    const [testDuration, setTestDuration] = useState(test.testDuration ? test.testDuration : { hours: 0, minutes: 0, seconds: 0 });
    const [questions, setQuestions] = useState(test.questions ? test.questions : [ques]);
    const [option, setOption] = useState({
        optionId: uuid.v4(),
        option: ``
    });
    const [showDateSelector, setShowDateSelector] = useState(false);
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    const [error, setError] = useState({});
    const [firebaseError, setFirebaseError] = useState('');

    const handleEdit = async () => {
        if (Object.keys(error).length > 0) {
            const docRef = doc(db, 'Test', test.id);
            const data = {
                testName: testName,
                testDate: date,
                testTime: testTime,
                testDuration: testDuration,
                questions: questions
            }
            await updateDoc(docRef, data)
                .then(() => {
                    navigation.navigate('CoordinatorDashboard')
                }, err => {
                    console.log(err)
                    setFirebaseError(err.message)
                })
                .catch(err => {
                    console.log(err)
                    setFirebaseError(err.message)
                })
        }
        else{
            alert('Please fill all the fields');
        }
    }

    const addQuestion = () => {
        if (Object.keys(error).length === 0) {
            setQuestions(questions.concat(ques));
            setQues({
                questionId: uuid.v4(),
                question: '',
                options: [{
                    optionId: uuid.v4(),
                    option: ''
                }],
                answer: '',
            });
        }
        else {
            alert('Please fill all the above fields');
        }
    };

    const addOption = (id) => {
        setQuestions(questions.map((question, index) => {
            if (question.questionId === id) {
                question.options.push(option);
            }
            return question;
        }))
        setOption({
            optionId: uuid.v4(),
            option: ``
        })
    };

    const deleteQuestion = (questionId) => {
        setQuestions(questions.filter((question) => question.questionId !== questionId));
    }
    const removeOption = (questionId, optionId) => {
        setQuestions(questions.map((question, index) => {
            if (question.questionId === questionId) {
                question.options = question.options.filter((option) => option.optionId !== optionId);
            }
            return question;
        }))
    };

    useEffect(() => {

        const onBackPress = () => {
            navigation.navigate('CoordinatorDashboard');
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
                <View style={styles.heading}>
                    <Text style={styles.headingText}>Edit Test Details</Text>
                </View>
                <View style={styles.errorContainer}>
                    {!firebaseError ? null : <Text style={styles.error}>{firebaseError}</Text>}
                </View>
                <View>
                    <Text>Test Name</Text>
                    <TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Test Name"
                            value={testName}
                            onChangeText={(text) => {
                                setTestName(text)
                                if (text.length > 0) {
                                    let updatedError = { ...error }
                                    delete updatedError.testName
                                    setError(updatedError)
                                }
                                else
                                    setError({ ...error, testName: false })
                            }}
                        />
                    </TouchableOpacity>
                    {error.testName === false ? <Text style={styles.error}>Test Name is required</Text> : null}
                    <Text>Test Date</Text>
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
                    <Text>Test Time</Text>
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
                    <Text>Test Duration</Text>
                    <View style={styles.TimePicker}>
                        <TimePicker
                            selectedHours={testDuration.hours}
                            selectedMinutes={testDuration.minutes}
                            onChange={({ hours, minutes, seconds }) => {
                                setTestDuration({ hours, minutes, seconds });
                            }}
                        />
                    </View>
                    {questions.map((ques, index) => {
                        return (
                            <View key={ques.questionId}>
                                <View style={styles.iconBox}>
                                    <Text style={styles.questionText}>Question {index + 1}</Text>
                                    <TouchableOpacity
                                        style={styles.Icon}
                                        onPress={() => deleteQuestion(ques.questionId)}
                                    >
                                        <Icon
                                            name="delete"
                                            type="material-community"
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Question"
                                        value={questions[index].question}
                                        onChangeText={(text) => {
                                            setQuestions(questions.map((que, idx) => {
                                                if (que.questionId === ques.questionId) {
                                                    que.question = text
                                                }
                                                return que
                                            }))
                                            if (text.length > 0) {
                                                let updatedError = { ...error }
                                                delete updatedError[`question${index}`]
                                                setError(updatedError)
                                            }
                                            else
                                                setError({ ...error, [`question${index}`]: false })
                                        }}
                                    />
                                </TouchableOpacity>
                                {error[`question${index}`] === false ? <Text style={styles.error}>Question is required</Text> : null}
                                {
                                    ques.options.map((option, idx) => {
                                        return (
                                            <View key={option.optionId} style={styles.text} >
                                                <View style={styles.iconBox}>
                                                    <Text>Option {idx + 1}</Text>
                                                    <TouchableOpacity
                                                        style={styles.Icon}
                                                        onPress={() => removeOption(ques.questionId, option.optionId)}
                                                    >
                                                        <Icon
                                                            name="delete"
                                                            type="material-community"
                                                            size={20}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                                <TouchableOpacity>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder={`Enter Option ${idx + 1}`}
                                                        value={questions[index].options[idx].option}
                                                        onChangeText={(text) => {
                                                            setQuestions(questions.map((que, idx) => {
                                                                if (que.questionId === ques.questionId) {
                                                                    que.options = que.options.map((opt, idx) => {
                                                                        if (opt.optionId === option.optionId) {
                                                                            opt.option = text
                                                                        }
                                                                        return opt
                                                                    })
                                                                }
                                                                return que
                                                            }))
                                                            if (text.length > 0) {
                                                                let updatedError = { ...error }
                                                                delete updatedError[`option${index + 1}${idx + 1}`]
                                                                setError(updatedError)
                                                            }
                                                            else
                                                                setError({ ...error, [`option${index + 1}${idx + 1}`]: false })
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                                {error[`option${index + 1}${idx + 1}`] === false ? <Text style={styles.error}>required</Text> : null}
                                            </View>
                                        );
                                    })
                                }
                                <View style={styles.buttonContainer} >
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => addOption(ques.questionId)}
                                    >
                                        <Text style={styles.buttonText}>Add option</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.text}>Answer</Text>
                                <TouchableOpacity
                                    style={styles.text}
                                >
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Answer"
                                        value={questions[index].answer}
                                        onChangeText={(text) => {
                                            setQuestions(questions.map((que, idx) => {
                                                if (que.questionId === ques.questionId) {
                                                    que.answer = text
                                                }
                                                return que
                                            }))
                                            if (text.length > 0) {
                                                let updatedError = { ...error }
                                                delete updatedError[`answer${index + 1}`]
                                                setError(updatedError)
                                            }
                                            else
                                                setError({ ...error, [`answer${index + 1}`]: false })
                                        }}
                                    />
                                </TouchableOpacity>
                                {error[`answer${index + 1}`] === false ? <Text style={styles.error}>Answer is required</Text> : null}
                            </View>
                        );
                    })}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={addQuestion}>
                        <Text style={styles.addButtonText}>Add Question</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleEdit}
                    >
                        <Text style={styles.buttonText} >Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default EditTest

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 8,
        height: '100%',
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
    buttonContainer: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
    headingText: {
        fontSize: 18,
    },
    heading: {
        padding: 8,
        alignItems: 'center',
    },
    text: {
        paddingHorizontal: 24,
    },
    addButton: {
        marginTop: 16,
        padding: 12,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 16,
        backgroundColor: 'grey',
        padding: 12,
        borderRadius: 16,
    },
    TimePicker: {
        backgroundColor: '#184E77',
        borderRadius: 16,
    },
    iconBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },
    questionText: {
        padding: 4,
    },
    Icon: {
        padding: 4,
    },
    error: {
        color: "red",
        paddingHorizontal: 24,
    },
    errorContainer: {
        alignItems: 'center',
        padding: 8,
    },
})