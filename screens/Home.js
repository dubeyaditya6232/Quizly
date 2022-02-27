import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Alert, ScrollView, Image } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import Title from '../components/Title';

import { containerStyles, bannerStyles } from '../styles/styles';

const Home = ({ navigation }) => {

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        ' Exit From App ',
        ' Do you want to exit the app ?',
        [
          {
            text: 'Yes', onPress: () => {
              BackHandler.exitApp();
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
  }, []);

  return (
    <ScrollView>
      <View style={containerStyles.container}>
        <Title />
        <View style={bannerStyles.bannerContainer}>
          <Image source={require('../assets/quiz.png')}
            style={bannerStyles.banner}
            resizeMode="contain"
          />
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("AdminLogin")}
            disabled={true}
          >
            <Text style={styles.buttonText}>Admin Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 20,
    padding: 16,
    backgroundColor: '#4a8cff',
    borderRadius: 12,
    marginBottom: 16,
  },
});

