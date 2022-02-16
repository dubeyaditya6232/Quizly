import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Alert, ScrollView } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import Title from '../components/Title';
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
      <View style={styles.container}>
        <Title />
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
  container: {
    paddingTop: 40,
    height: '100%',
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 20,
    padding: 16,
    backgroundColor: '#184E77',
    borderRadius: 12,
    marginBottom: 16,
  },
  /*   banner: {
      height: 300,
      width: 300,
    },
    bannerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    }, */
});

