import { ScrollView, StyleSheet, Text, View, BackHandler } from 'react-native'
import React, { useEffect } from 'react'

import { testStyles, containerStyles } from '../styles/styles';

const TestDetails = ({ navigation, route }) => {

  const { test } = route.params;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  const testDate = test.testDate.toDate();
  const testTime = test.testTime.toDate();
  const { hours, minutes } = test.testDuration;
  const testHrs = testTime.getHours();
  const testMin = testTime.getMinutes();

  useEffect(() => {

    const onBackPress = () => {
      navigation.navigate('CoordinatorDashboard');
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView>
      <View style={containerStyles.container}>
        <Text style={testStyles.title} >{test.testName}</Text>
        <Text style={styles.HeadText}>Test Code: {test.testCode}</Text>
        <Text style={styles.HeadText} >Test Date : {days[testDate.getDay()]},{testDate.getDate()}/{months[testDate.getMonth()]}/{testDate.getFullYear()}</Text>
        <Text style={styles.HeadText} >Test Time : {testHrs}:{testMin < 10 ? '0' + testMin : testMin}</Text>
        <Text style={styles.HeadText} >Test Duration : {hours === 0 ? '' : hours + 'hrs:'}{minutes === 0 ? '' : minutes + 'min'}</Text>
        {
          test.questions?.map((item, index) => {
            return (
              <View key={item.questionId}>
                <Text style={styles.QuestionText}>Question {index + 1} : {item.question}</Text>
                <Text style={styles.text}>Correct Answer : {item.answer}</Text>
                {item.options.map((option, index) => {
                  return (
                    <Text style={styles.OptionText} key={option.optionId}>option {index + 1} : {option.option}</Text>
                  )
                })}
              </View>
            )
          })
        }
      </View>
    </ScrollView>
  )
}

export default TestDetails

const styles = StyleSheet.create({
  HeadText: {
    fontSize: 16,
    padding: 6
  },
  QuestionText: {
    fontSize: 16,
    padding: 6,
    marginTop: 12,
  },
  text: {
    fontSize: 16,
    padding: 8,
    marginHorizontal: 8
  },
  OptionText: {
    fontSize: 16,
    padding: 4,
    marginHorizontal: 16
  }
})