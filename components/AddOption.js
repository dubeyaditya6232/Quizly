import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import uuid from 'react-native-uuid';
import { Icon } from 'react-native-elements';
import { addOptionInQuestion, validateAddOption } from '../utils/questionPage';

const AddOption = ({ navigation, questions, setQuestions, questionIndex, error, setError}) => {

    const [option, setOption] = useState({
        optionId: uuid.v4(),
        option: ``
    });

    const [optionArray, setOptionArray] = useState(questions[questionIndex].options);
    
    const addOption = () => {
        if (validateAddOption(questions, questionIndex, error, setError)) {
            addOptionInQuestion(questions, setQuestions, questions[questionIndex].questionId, option);
            setOptionArray(optionArray.concat(option));
            setOption({
                optionId: uuid.v4(),
                option: ``
            });
            let customError = [...error];
            customError[questionIndex].options.push(null);
            customError[questionIndex].saveMsg=''
            setError(customError);
        }
    };

    const handleTextChange = (text, optionId, index) => {
        setOptionArray(optionArray.map(opt => {
            if (opt.optionId === optionId) {
                opt.option = text;
            }
            return opt;
        }));
        let customError = [...error];
        if (text.length === 0) {
            customError[questionIndex].options[index] = 'Option is required';
        }
        else {
            customError[questionIndex].options[index] = null;
        }
        customError[questionIndex].saveMsg='';
        setError(customError);
    };

    const validation = () => {
        let check = optionArray.some(opt => opt.option === '');
        if (check) {
            let updatedError = [...error];
            for (let i = 0; i < optionArray.length; i++) {
                if (optionArray[i].option === '') {
                    updatedError[questionIndex].options[i] = 'Option is required'
                }
            }
            setError(updatedError);
        }
        return !check;
    }

    const handleSave = () => {
        if (validation()) {
            setQuestions(questions.map(question => {
                if (question.questionId === questions[questionIndex].questionId) {
                    question.options = optionArray;
                }
                return question;
            }));
            let updatedError=[...error];
            updatedError[questionIndex].saveMsg='Saved Successfully'
            setError(updatedError)
        }
    };
    const removeOption = (questionId, optionId, index) => {
        setQuestions(questions.map((question, idx) => {
            if (question.questionId === questionId) {
                question.options = question.options.filter((option) => option.optionId !== optionId);
            }
            return question;
        }))
        setOptionArray(optionArray.filter((option) => option.optionId !== optionId));
        let customError = [...error];
        customError[questionIndex].options.splice(index, 1);
        setError(customError)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.inputLabel}>Add Option</Text>
            {questions[questionIndex].options.map((opt, index) => {
                return (
                    <View key={opt.optionId}>
                        <View style={styles.iconBox}>
                            <Text style={styles.inputLabel} >option {index + 1}</Text>
                            <TouchableOpacity
                                style={styles.Icon}
                                onPress={() => removeOption(questions[questionIndex].questionId, opt.optionId, index)}
                            >
                                <Icon
                                    name="delete"
                                    type="material-community"
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Option"
                            value={optionArray[index].option}
                            onChangeText={(text) => handleTextChange(text, opt.optionId, index)}
                        />
                        {(!error[questionIndex].options[index]) ? null : <Text style={styles.errorText}>{error[questionIndex].options[index]}</Text>}
                    </View>
                );
            })}
            <View style={styles.buttonContainer} >
                <TouchableOpacity
                    style={styles.button}
                    onPress={addOption}
                >
                    <Text style={styles.buttonText}>add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
            {!error[questionIndex].saveMsg ? null : <Text style={styles.saveMsg}>{error[questionIndex].saveMsg}</Text>}
        </View>
    )
}

export default AddOption

const styles = StyleSheet.create({
    container: {
        paddingStart: 8,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: '48%',
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
    iconBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    Icon: {
        padding: 8,
    },
    errorText: {
        color: 'red',
    },
    saveMsg: {
        textAlign: 'center',
        padding: 4,
        color: 'green',
    }
})