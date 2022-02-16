import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react'
import uuid from 'react-native-uuid';
import Title from '../components/Title';
import AddOption from '../components/AddOption';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const AddQuestions = ({ navigation }) => {

  const [questions, setQuestions] = useState([{
    questionId: uuid.v4(),
    question: '',
    options: [{
      optionId: uuid.v4(),
      option: ''
    }],
    answer: '',
  }]);
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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [error, setError] = useState({ error: 'fill all the fields' });


  const handleTextChange = (text, questionId) => {
    setQuestions(questions.map(question => {
      if (question.questionId === questionId) {
        question.question = text;
      }
      return question;
    }));
    if (text === '') {
      setError({
        ...error,
        question: 'Question is required'
      });
    }
    else {
      let updatedError = { ...error };
      delete updatedError.question;
      setError({ ...updatedError, error: '' });
    }
  };

  const handleAnswerChange = (text, questionId) => {
    setQuestions(questions.map(question => {
      if (question.questionId === questionId) {
        question.answer = text;
      }
      return question;
    }));
    if (text === '') {
      setError({
        ...error,
        answer: 'Answer is required'
      })
    }
    else {
      let updatedError = { ...error };
      delete updatedError.answer;
      setError({ ...updatedError, error: '' });
    }
  };

  const addQuestion = (index) => {
    console.log(error);
    if (error.error === '') {
      if (questionIndex === questions.length - 1) {
        setQuestions(questions.concat(ques));
      }
      setQuestionIndex(questionIndex + 1);
      setError({ ...error, error: 'Please fill all the fields' });
    }
    else {
      alert('Please fill all the fields');
    }
  };

  const previousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
    setError({ ...error, error: '' });
  }

  const handleSubmit = async () => {
    const jsonValue = await AsyncStorage.getItem('testId');
    const testId = JSON.parse(jsonValue);
    const docRef = doc(db, 'Test', testId);
    await updateDoc(docRef, { questions })
      .then(() => {
        navigation.navigate('CoordinatorDashboard')
      }, (error) => { console.log(error) })
      .catch((err) => { console.log(err) });
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Title />
        <View style={styles.pageTitle} >
          <Text style={styles.pageTitleText}>AddQuestions</Text>
        </View>
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
                        onChangeText={(text) => handleTextChange(text, question.questionId)}
                        placeholder="Enter Question"
                      />
                    </TouchableOpacity>
                    {error.question ? <Text style={styles.error}>{error.question}</Text> : null}
                    <AddOption
                      questions={questions}
                      setQuestions={setQuestions}
                      questionIndex={questionIndex}
                    />

                    <Text style={styles.inputLabel} >Answer</Text>
                    <TouchableOpacity>
                      <TextInput
                        style={styles.input}
                        value={question.answer}
                        placeholder="Enter correct Answer"
                        onChangeText={(text) => handleAnswerChange(text, question.questionId)}
                      />
                    </TouchableOpacity>
                    {error.answer ? <Text style={styles.error}>{error.answer}</Text> : null}
                    <View style={styles.navButton}>
                      <TouchableOpacity
                        disabled={questionIndex === 0 ? true : false}
                        style={styles.addButton}
                        onPress={previousQuestion}
                      >
                        <Text style={styles.addButtonText}>Previous Question</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={addQuestion}
                      >
                        <Text style={styles.addButtonText}>Add Question</Text>
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
    padding: 12,
    alignItems: 'center',
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
    backgroundColor: '#184E77',
    padding: 8,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    paddingVertical: 8,
  },
  error: {
    color: 'red',
  }
})