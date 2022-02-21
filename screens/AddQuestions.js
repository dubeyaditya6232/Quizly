import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react'
import uuid from 'react-native-uuid';
import Title from '../components/Title';
import AddOption from '../components/AddOption';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const AddQuestions = ({ navigation }) => {

  const [ques, setQues] = useState({
    questionId: uuid.v4(),
    question: '',
    options: [{
      optionId: uuid.v4(),
      option: ''
    }],
    answer: '',
  });
  const [questions, setQuestions] = useState([{
    questionId: uuid.v4(),
    question: '',
    options: [{
      optionId: uuid.v4(),
      option: ''
    }],
    answer: '',
  }]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [error, setError] = useState([{
    question: null,
    options: [],
    saveMsg: ''
  }]);
  const [firebaseError, setFirebaseError] = useState(null);
  
  const validation = () => {
    let customError = [...error];
    if (questions[questionIndex].question === '') {
      customError[questionIndex].question = 'Required';
    }
    if(questions[questionIndex].answer === ''){
      customError[questionIndex].answer = 'Required';
    }
    const checkOptions = questions[questionIndex].options.some(opt => opt.option === '');
    if (checkOptions) {
      for (let i = 0; i < questions[questionIndex].options.length; i++) {
        if (questions[questionIndex].options[i] === '') {
          customError[questionIndex].options[i] = 'Required'
        }
      }
    }
    setError(customError);

    return !checkOptions;
  }

  const submitValidation = () => {
    let check = questions.some((question) => {
      return question.question === '' || question.answer==='' || question.options.some(opt => opt.option === '');
    })
    if (check) {
      let customError = [...error];
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].question === '') {
          customError[i].question = 'Question is required'
        }
        if(questions[i].answer === ''){
          customError[i].answer = 'Required'
        }
        if (questions[i].options.some(opt => opt.option === '')) {
          for (let j = 0; j < questions[i].options.length; j++) {
            if (questions[i].options[j].option === '') {
              customError[i].options[j] = 'Option is required'
            }
          }
        }
      }
      for (let i = 0; i < error.length; i++) {
        if (error[i].saveMsg === '') {
          check = true;
          alert(`options of question ${i + 1} not saved`)
          break;
        }
      }
      setError(customError);
    }
    return !check;
  };


  const handleQuestionChange = (text, questionId) => {
    setQuestions(questions.map(question => {
      if (question.questionId === questionId) {
        question.question = text;
      }
      return question;
    }));
    if (text.length === 0) {
      let customError = [...error];
      customError[questionIndex].question = "Question is required";
    }
    else {
      let customError = [...error];
      customError[questionIndex].question = null;
    }
  };

  const handleAnswerChange = (text, questionId) => {
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

  const addQuestion = () => {
    if (validation()) {
      if (error[questionIndex].saveMsg !== '') {
        setQuestions(questions.concat(ques));
        setQuestionIndex(questionIndex + 1);
        setQues({
          questionId: uuid.v4(),
          question: '',
          options: [{
            optionId: uuid.v4(),
            option: ''
          }],
          answer: '',
        });
        setError(error.concat({ question: null, options: [], saveMsg: '',answer:'' }));
      }
      else {
        alert("save options to continue");
      }
    }
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  }

  const previousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  }

  const handleSubmit = async () => {
    if (submitValidation()) {
      const jsonValue = await AsyncStorage.getItem('testId');
      const testId = JSON.parse(jsonValue);
      const docRef = doc(db, 'Test', testId);
      await updateDoc(docRef, { questions })
        .then(() => {
          navigation.navigate('CoordinatorDashboard')
        }, (error) => {
          console.log(error)
          setFirebaseError(error.message);
        })
        .catch((err) => {
          console.log(err)
          setFirebaseError(err.message);
        });
    }
    else {
      alert('fill all the required fields');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Title />
        <View style={styles.pageTitle} >
          <Text style={styles.pageTitleText}>AddQuestions</Text>
        </View>
        {!firebaseError ? null : <Text style={styles.errorText}>{firebaseError}</Text>}
        <View>
          {
            questions.map((question, index) => {
              if (index === questionIndex) {
                return (
                  <View key={question.questionId}>
                    <Text style={styles.inputLabel} >Question {index + 1}</Text>
                    <TouchableOpacity>
                      <TextInput
                        style={styles.input}
                        value={question.question}
                        onChangeText={(text) => handleQuestionChange(text, question.questionId)}
                        placeholder="Enter Question"
                      />
                    </TouchableOpacity>
                    {!error[index].question ? null : <Text style={styles.errorText}>{error[index].question}</Text>}
                    <AddOption
                      questions={questions}
                      setQuestions={setQuestions}
                      questionIndex={questionIndex}
                      error={error}
                      setError={setError}
                    />
                    <Text style={styles.inputLabel} >Answer</Text>
                    <View style={styles.formInput}>
                      <Picker
                        selectedValue={question.answer}
                        style={styles.formInputText}
                        onValueChange={(itemValue, itemIndex) => handleAnswerChange(itemValue, question.questionId)}
                      >
                      <Picker.Item  label='Select Options' value='' key='Select'/>
                        {question.options.map((option, index) => {
                          return (
                            <Picker.Item label={option.option} value={option.option} key={option.optionId} />
                          )
                        })}
                      </Picker>
                      {!error[index].answer ? null : <Text style={styles.errorText}>{error[index].answer}</Text>}
                    </View>
                    <View style={styles.navButton}>
                      <TouchableOpacity
                        disabled={questionIndex === 0 ? true : false}
                        style={styles.addButton}
                        onPress={previousQuestion}
                      >
                        <Text style={styles.addButtonText}>Previous</Text>
                      </TouchableOpacity>
                      {questionIndex === questions.length - 1 ? (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={addQuestion}
                        >
                          <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                      ) : null}
                      <TouchableOpacity
                        disabled={questionIndex === questions.length - 1 ? true : false}
                        style={styles.addButton}
                        onPress={nextQuestion}
                      >
                        <Text style={styles.addButtonText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }
              else {
                return (
                  null
                )
              }
            })
          }
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default AddQuestions

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 12,
  },
  pageTitle: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageTitleText: {
    fontSize: 20,
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
  addButton: {
    marginTop: 16,
    padding: 8,
    alignItems: 'center',
    width: '30%',
  },
  addButtonText: {
    fontSize: 16,
    backgroundColor: 'grey',
    padding: 12,
    borderRadius: 16,
  },
  navButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  formInputText: {
    backgroundColor: '#4a8cff',
    color: 'black',
    padding: 8,
  },
  errorText: {
    color: 'red',
  }
})