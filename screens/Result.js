import { StyleSheet, Text, View, Image, TouchableOpacity, BackHandler, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../useContext';
import Loading from '../components/Loading';

import { containerStyles, titleStyles,bannerStyles } from '../styles/styles';

const Result = ({ navigation, route }) => {

  // eslint-disable-next-line no-unused-vars
  const { user } = useUserAuth();
  const [Score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const { score } = route.params;

  const fetchScore = () => {
    setScore(score);
    setLoading(false);

  }

  useEffect(() => {
    fetchScore();
    const onBackPress = () => {
      Alert.alert(
        ' Go Home ',
        ' Do you want go back ?',
        [
          {
            text: 'Yes', onPress: () => {
              navigation.navigate('Dashboard');
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

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView>
      <View style={containerStyles.container}>
        <View style={titleStyles.pageTitle}>
          <Text style={titleStyles.pageTitleText}>Result</Text>
        </View>
        <View style={bannerStyles.bannerContainer}>
          <Image source={require('../assets/quiz.png')}
            style={bannerStyles.banner}
            resizeMode="contain"
          />
        </View>
        {loading ? (
          <Loading loadingMsg={"Calculating"} />
        ) : (
          <View style={styles.result}>
            <Text style={styles.resultText}>You scored : {Score}</Text>
          </View>
        )}
        <View style={styles.bottom}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.bottomText}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Result;

const styles = StyleSheet.create({
  result: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 28,
    fontWeight: '600',
  },
  bottom: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  bottomText: {
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#4a8cff',
    padding: 12,
    borderRadius: 16,
  }
});
