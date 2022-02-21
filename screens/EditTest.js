import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
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
    const [questions, setQuestions] = useState(test.questions ? test.questions : []);
    const [option, setOption] = useState({
        optionId: uuid.v4(),
        option: ``
    });
    const [showDateSelector, setShowDateSelector] = useState(false);
    const [showTimeSelector, setShowTimeSelector] = useState(false);


    //validation state variables
    const [firebaseError, setFireBaseError] = useState('');
    const [testNameError, setTestNameError] = useState('');

    let fetchedError = []
    for (let i = 0; i < questions.length; i++) {
        let options = [];
        for (let j = 0; j < questions[i].options.length; j++) {
            options.push(null);
        }
        fetchedError.push({
            question: null,
            options: options,
            answer: ''
        });
    };

    const [error, setError] = useState([...fetchedError])

    const validateAddOption = (index) => {
        let check = questions[index].options.some(opt => opt.option === '')

        if (check) {
            let customError = [...error]
            for (let i = 0; i < questions[index].options.length; i++) {
                if (questions[index].options[i].option === '') {
                    customError[index].options[i] = 'Required';
                }
            }
            setError(customError);
        }

        return !check;
    }

    const validateAddQuestion = () => {
        let check = questions.some(ques => ques.question === '' || ques.answer==='' || ques.options.some(opt => opt.option === ''));

        if (check) {
            let customError = [...error];
            for (let i = 0; i < questions.length; i++) {
                if (questions[i].question === '') {
                    customError[i].question = 'Required'
                }
                if(questions[i].answer === ''){
                    customError[i].answer = 'Required'
                }
                for (let j = 0; j < questions[i].options.length; j++) {
                    if (questions[i].options[j].option === '') {
                        customError[i].options[j] = 'Required'
                    }
                }
            }
            setError(customError);
        }

        return !check
    };

    const validateEditTest = () => {
        if (validateAddQuestion() && testNameError === '')
            return true;
        else
            return false;
    };

    const handleEdit = async () => {
        if (validateEditTest()) {
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
                    setFireBaseError(err.message);
                    console.log(err)
                })
                .catch(err => {
                    setFireBaseError(err.message);
                    console.log(err)
                })
        }
    }

    const addQuestion = () => {
        if (validateAddQuestion()) {
            setQuestions(questions.concat(ques));
            setError(error.concat({
                question: null,
                options: [],
                answer: ''
            }))
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
    }

    const addOption = (id, index) => {
        if (validateAddOption(index)) {
            setQuestions(questions.map((question, index) => {
                if (question.questionId === id) {
                    question.options.push(option);
                }
                return question;
            }))
            let customError = [...error];
            customError[index].options.push(null);
            setError(customError);
            setOption({
                optionId: uuid.v4(),
                option: ''
            })
        }
    };

    const deleteQuestion = (questionId, index) => {
        setQuestions(questions.filter((question) => question.questionId !== questionId));
        let customError = [...error];
        customError.splice(index, 1)
        setError(customError);
    }
    const removeOption = (questionId, optionId, questionIndex, optionIndex) => {
        setQuestions(questions.map((question, index) => {
            if (question.questionId === questionId) {
                question.options = question.options.filter((option) => option.optionId !== optionId);
            }
            return question;
        }));
        let customError = [...error];
        customError[questionIndex].options.splice(optionIndex, 1);
        setError(customError);
    };

    const handleAnswerChange = (text, questionId,questionIndex) => {
        setQuestions(questions.map(question => {
            if (question.questionId === questionId) {
                question.answer = text;
            }
            return question;
        }));
        let customError = [...error];
        if(text===''){
           customError[questionIndex].answer = 'Required';
        }
        else{
            customError[questionIndex].answer = '';
        }
        setError(customError);
    };

    const handleQuestionChange = (text, questionId, index) => {
        setQuestions(questions.map(question => {
            if (question.questionId === questionId) {
                question.question = text;
            }
            return question;
        }));
        let customError = [...error];
        if (text.length === 0) {
            customError[index].question = "Required";
        }
        else {
            customError[index].question = null;
        }
    };

    const handleOptionChange = (text, questionId, optionId, questionIndex, optionIndex) => {
        setQuestions(questions.map((que, idx) => {
            if (que.questionId === questionId) {
                que.options = que.options.map((opt, idx) => {
                    if (opt.optionId === optionId) {
                        opt.option = text
                    }
                    return opt
                })
            }
            return que
        }));
        let customError = [...error];
        if (text === '') {
            customError[questionIndex].options[optionIndex] = 'Required'
        }
        else {
            customError[questionIndex].options[optionIndex] = '';
        }
        setError(customError)
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
                    {!firebaseError ? null : <Text style={styles.errorText}>{firebaseError}</Text>}
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
                                if (text === '') {
                                    setTestNameError('Required')
                                }
                                else if (text.length < 3) {
                                    setTestNameError('length should be atleast 3 digit');
                                }
                                else {
                                    setTestNameError('')
                                }
                            }}
                        />
                    </TouchableOpacity>
                    {!testNameError ? null : <Text style={styles.errorText}>{testNameError}</Text>}
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
                            value={moment(date).format('DD-MM-YYYY')}
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
                            value={moment(testTime).format('hh:mm A')}
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
                                        onPress={() => deleteQuestion(ques.questionId, index)}
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
                                        onChangeText={(text) => { handleQuestionChange(text, ques.questionId, index) }}
                                    />
                                </TouchableOpacity>
                                {!error[index].question ? null : <Text style={styles.errorText}>{error[index].question}</Text>}
                                {
                                    ques.options.map((option, idx) => {
                                        return (
                                            <View key={option.optionId} style={styles.text} >
                                                <View style={styles.iconBox}>
                                                    <Text>Option {idx + 1}</Text>
                                                    <TouchableOpacity
                                                        style={styles.Icon}
                                                        onPress={() => removeOption(ques.questionId, option.optionId, index, idx)}
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
                                                            handleOptionChange(text, ques.questionId, option.optionId, index, idx)
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                                {!error[index].options[idx] ? null : <Text style={styles.errorText}>{error[index].options[idx]}</Text>}
                                            </View>
                                        );
                                    })
                                }
                                <View style={styles.buttonContainer} >
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => addOption(ques.questionId, index)}
                                    >
                                        <Text style={styles.buttonText}>Add option</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.text}>Answer</Text>
                                <Picker
                                    selectedValue={ques.answer}
                                    style={styles.formInputText}
                                    onValueChange={(itemValue, itemIndex) => {
                                        handleAnswerChange(itemValue, ques.questionId, index)
                                    }}
                                >
                                    <Picker.Item  label='Select Options' value='' key='Select'/>
                                    {ques.options.map((option, index) => {
                                        return (
                                            <Picker.Item label={option.option} value={option.option} key={option.optionId} />
                                        )
                                    })}
                                </Picker>
                                {!error[index].answer ? null : <Text style={styles.errorText}>{error[index].answer}</Text>}
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
        backgroundColor: '#4a8cff',
        padding: 8,
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 16,
        paddingVertical: 8,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        flexDirection: 'column',
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
        backgroundColor: 'gray',
        padding: 12,
        borderRadius: 16,
    },
    TimePicker: {
        backgroundColor: '#4a8cff',
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
    errorText: {
        color: "red",
        padding: 4,
    },
    errorContainer: {
        alignItems: 'center',
        padding: 8,
    },
    formInputText: {
        backgroundColor: '#4a8cff',
        color: 'yellow',
        padding: 8,
    },
    itemStyle: {
        backgroundColor: '#4a8cff'
    }
})