import { ScrollView, StyleSheet, Text, View, TouchableOpacity, BackHandler,Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import ShowCards from '../components/ShowCards'

import { db } from '../firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';

import { useUserAuth } from '../useContext';

const CoordinatorDashboard = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [testList, setTestList] = useState([])

    const { user, logout } = useUserAuth();

    const fetchTestList = () => {
        const collectionRef = collection(db, "Test");
        const q=query(collectionRef,where('coordinatorId','==',user.uid));
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setTestList([...data])
            setLoading(false)
        })
    };

    useEffect(() => {
        //check Login
        if (user === null) {
            console.log("User not logged in")
            navigation.navigate('Login');
        }
        fetchTestList();

        const onBackPress = () => {
            Alert.alert(
                ' Do you want to go back ?',
                ' You will be logged out!',
                [
                  {
                    text: 'Yes', onPress: () => {
                      navigation.navigate('Home');
                    }
                  },
                  {
                    text: 'No', onPress: () => console.log('NO Pressed')
                  }
                ],
                { cancelable: false },
              ); 
              return true
        }
        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
                .then(() => {
                    navigation.navigate('Login');
                }, (err) => {
                    console.log(err);
                })
                .catch(err => console.log(err.message));

        }
        catch (err) {
            console.log(err.message);
        }
    }

    return (
        (user) ? (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>Welcome,{user.email}</Text>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("CreateTest")}
                        >
                            <Text style={styles.buttonText}>Create Test</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        {
                            loading ? (
                                <Text>Loading...</Text>
                            ) : (
                                <View >
                                    <Text style={styles.Text}>Available Tests</Text>
                                    <View style={styles.cardContainer}>
                                        {testList.map((test, index) => {
                                            return (
                                                <View key={test.id}>
                                                    <ShowCards
                                                        navigation={navigation}
                                                        test={test}
                                                        setTestList={setTestList}
                                                        testList={testList}
                                                    />
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
        ) : (
            <Text>Not Logged In</Text>
        )
    )
}

export default CoordinatorDashboard

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 12,
        height: '100%',
    },
    headingContainer: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 8,
        justifyContent: 'center',
    },
    Text: {
        fontSize: 20,
        paddingVertical: 10,
    },
    button: {
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        backgroundColor: '#184E77',
        padding: 12,
        borderRadius: 16,
    },
    cardContainer: {
        flexDirection: 'column',
    },
    logoutButton: {
        alignItems: 'flex-end',
        padding: 8,
    },
    logoutButtonText: {
        fontSize: 20,
        padding: 12,
        backgroundColor: '#184E77',
        borderRadius: 16,
        color: 'white',
    },
})