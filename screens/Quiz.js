import { StyleSheet, Text, TouchableOpacity, View, BackHandler, Alert, ScrollView, AppState } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';

//firebase
import { db } from '../firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useUserAuth } from '../useContext';
import Loading from '../components/Loading';

const Quiz = ({ navigation, route }) => {

  const { user } = useUserAuth();
  const { test } = route.params;
  const appState = useRef(AppState.currentState);

  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]); // stores question set by user
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState([]); //varable to store the answer entered by the user
  const [time, setTime] = useState(0); //variable to act as counter
  const [testDuration, setTestDuration] = useState({}); //variable to store the test duratipn set
  const [timeLeft, setTimeLeft] = useState({ //stores the test duration left
    hours: 2,
    minutes: 0,
    seconds: 0
  });

  const checkStudentParticipation = async () => {
    const docRef = doc(db, 'Users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData(data);
      const testTaken = (data.tests) ? data.tests : []
      const check = testTaken.find(x => x.testId === test.id)
      if (check) {
        alert("You have already attempted the test");
        navigation.navigate('Result', { score: check.score });
      }
      else {
        fetchTestDetails();
      }
    }
    else {
      alert("You have not registered for the test");
      navigation.navigate('Dashboard');
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  const handleSubmit = async () => {
    //calculate score
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answer[i].ans === questions[i].answer) {
        score++;
      }
    }
    const docref = doc(db, "Users", user.uid);

    await updateDoc(docref, {
      tests: arrayUnion({
        testId: test.id,
        answers: answer,
        score: score,
        timeLeft: timeLeft
      })
    })
      .then(async () => {
        const testDocRef = doc(db, "Test", test.id);
        await updateDoc(testDocRef, {
          participants: arrayUnion({
            participantId: user.uid,
            participantName: userData.name,
            answers: answer,
            score: score
          })
        })
        navigation.navigate('Result', { score: score });
      }, (err) => console.log(err.message))
      .catch(err => console.log(err.message));
  };

  const onOptionPress = (ans, id) => {
    setAnswer(answer.map((item) => {
      if (item.id === id) {
        item.ans = ans;
      }
      return item;
    }))
  }
  const calculateTimer = (timer) => {
    let difference = (testDuration.hours * 3600 + testDuration.minutes * 60 + testDuration.seconds) - timer;
    let hours = Math.floor(difference / 3600);
    let minutes = Math.floor((difference - hours * 3600) / 60);
    let seconds = Math.floor(difference - hours * 3600 - minutes * 60);
    setTimeLeft({ hours, minutes, seconds });
    return timer;
  }

  const handleTestSchedule = (data) => {
    const testDate = data.testDate.toDate();
    const testTime = data.testTime.toDate();
    const testDurationinMS = (data.testDuration.hours * 3600 + data.testDuration.minutes * 60 + data.testDuration.seconds) * 1000;
    let testStartTime = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), testTime.getHours(), testTime.getMinutes(), testTime.getSeconds());
    const testEndTime = testStartTime.getTime() + testDurationinMS;

    if (Date.now() < testStartTime.getTime()) {
      alert("Test has not started yet");
      navigation.navigate('Dashboard');
    }
    else if (Date.now() >= testStartTime.getTime() && Date.now() < testEndTime) {
      const timeAfterStart = Date.now() - testStartTime.getTime();
      setTime(timeAfterStart / 1000);
      setLoading(false);
    }
    else {
      alert("Test has expired");
      navigation.navigate('Dashboard');
    }
  };

  const fetchTestDetails = async () => {
    const docRef = doc(db, 'Test', test.id);
    await getDoc(docRef)
      .then(docSnap => {
        const data = docSnap.data();
        setQuestions(data.questions);
        setAnswer(data.questions.map((item) => {
          return { id: item.questionId, ans: null }
        }))
        setTestDuration(data.testDuration);
        handleTestSchedule(data);
      }, (err) => console.log(err.message))
      .catch(err => console.log(err.message));
  }

  useEffect(() => {
    checkStudentParticipation();

    const onBackPress = () => {
      Alert.alert(
        ' End Test ',
        ' Do you want to end the Test ?',
        [
          {
            text: 'Yes', onPress: () => {
              handleSubmit();
            }
          },
          {
            text: 'No', onPress: () => console.log('NO Pressed')
          }
        ],
        { cancelable: false },
      );
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      AppState.removeEventListener('change', handleAppStateChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {

      console.log("App has come to the foreground!");
    }
    appState.current = nextAppState;
    if (appState.current === 'background') {
      if (questions.length > 0) {
        handleSubmit();
      }
      console.log("App has come to the background!");
    }
    console.log("appState", appState.current);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimer(time + 1));
    }, 1000);

    if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      clearInterval(interval);
      handleSubmit();
    }

    return () => {
      clearInterval(interval);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);


  return (
    <ScrollView>
      <View style={styles.container}>
        {(loading === false) ? questions.length > 0 ?
          (
            <View style={styles.parent}>
              <View style={styles.timer}>
                <Text style={styles.timerText}>time left : {timeLeft?.hours}hrs:{timeLeft?.minutes}mins:{timeLeft?.seconds}sec</Text>
              </View>
              <View style={styles.top}>
                <Text style={styles.question}>Q.{currentQuestion + 1} {questions[currentQuestion].question} </Text>
              </View>
              <View style={styles.options}>
                {questions[currentQuestion].options.map((option, index) => {
                  return (
                    <TouchableOpacity
                      key={option.optionId}
                      onPress={async () => await onOptionPress(option.option, questions[currentQuestion].questionId)}
                      style={answer[currentQuestion].ans === option.option ? styles.optionSelected : styles.optionButton}
                    >
                      <Text style={styles.option}>{option.option}</Text>
                    </TouchableOpacity>
                  );
                })
                }
              </View>
              <View style={styles.bottom}>
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={styles.button}>
                  <Text style={styles.buttonText} >Previous </Text>
                </TouchableOpacity>
                {(currentQuestion === questions.length - 1) ? (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.button}>
                    <Text style={styles.buttonText} >Submit </Text>
                  </TouchableOpacity>
                ) : (<View></View>)}
                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.button}>
                  <Text style={styles.buttonText} >Next </Text>
                </TouchableOpacity>
              </View>
            </View>)
          : (<Loading loadingMsg={"Loading Questions"} />)
          : (
            <View>
              <Text>Loading...</Text>
            </View>
          )}
      </View>
    </ScrollView>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    height: '100%',
  },
  top: {
    marginVertical: 16,
    padding: 12,
  },
  options: {
    marginVertical: 16,
    flex: 1
  },
  bottom: {
    marginBottom: 12,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#4a8cff',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  question: {
    fontSize: 24,
  },
  option: {
    fontSize: 18,
    fontWeight: '500',
  },
  optionButton: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#34A0A4',
    borderRadius: 12,
  },
  optionSelected: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#FFCA28',
    borderRadius: 12,
  },
  parent: {
    height: '100%',
  },
  timer: {
    padding: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  timerText: {
    backgroundColor: '#34A0A4',
    padding: 8,
    borderRadius: 12,
  }
});
