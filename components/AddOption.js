import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import uuid from 'react-native-uuid';
import { Icon } from 'react-native-elements';

const AddOption = ({ navigation, questions, setQuestions, questionIndex }) => {

    const [option, setOption] = useState({
        optionId: uuid.v4(),
        option: ``
    });

    const [optionArray, setOptionArray] = useState(questions[questionIndex].options);
    const [error, setError] = useState({ error: "fill all the fields" });
    const [saveMsg, setSaveMsg] = useState('');

    const addOption = () => {
        setQuestions(questions.map(question => {
            if (question.questionId === questions[questionIndex].questionId) {
                question.options.push(option);
            }
            return question;
        }));
        setOptionArray(optionArray.concat(option));
        setOption({
            optionId: uuid.v4(),
            option: ``
        });
        setError({ ...error, error: "fill all the fields" });
        setSaveMsg('');
    };

    const handleTextChange = (text, optionId) => {
        setSaveMsg('');
        setOptionArray(optionArray.map(opt => {
            if (opt.optionId === optionId) {
                opt.option = text;
            }
            return opt;
        }));
        if (text === '') {
            setError({
                ...error,
                [optionId]: 'Option is required'
            });
        }
        else {
            let updatedError = { ...error };
            delete updatedError[optionId];
            setError({ ...updatedError, error: "" });
        }
    };

    const handleSave = () => {
        console.log(error);
        if (error.error === "") {
            setQuestions(questions.map(question => {
                if (question.questionId === questions[questionIndex].questionId) {
                    question.options = optionArray;
                }
                return question;
            }));
            setSaveMsg('Options successfully saved');
        }
        else {
            alert(error.error);
        }
    };
    const removeOption = (questionId, optionId) => {
        setQuestions(questions.map((question, index) => {
            if (question.questionId === questionId) {
                question.options = question.options.filter((option) => option.optionId !== optionId);
            }
            return question;
        }))
        setOptionArray(optionArray.filter((option) => option.optionId !== optionId));
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
                                onPress={() => removeOption(questions[questionIndex].questionId, opt.optionId)}
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
                            onChangeText={(text) => handleTextChange(text, opt.optionId)}
                        />
                        {error[opt.optionId] ? <Text style={styles.errorText}>{error[opt.optionId]}</Text> : null}
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
            {saveMsg ? <Text style={styles.saveMsg}>{saveMsg}</Text> : null}
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
    }
})