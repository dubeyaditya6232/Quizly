import { View, Text, TouchableOpacity, StyleSheet, Image, BackHandler, ScrollView, TextInput, Alert } from 'react-native';
import Title from '../components/Title';
import React, { useEffect, useState } from 'react';

import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { useUserAuth } from '../useContext';

const Dashboard = ({ navigation }) => {

    const { user, logout } = useUserAuth();
    const [Search, setSearch] = useState('');
    const [searchError, setSearchError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
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
            return true;
        }

        if (user === null) {
            navigation.navigate('Login');
        }

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = async () => {
        try {
            await logout()
                .then(() => {
                    navigation.navigate('Login');
                }, (err) => console.log(err))
                .catch(err => console.log(err));

        }
        catch (err) {
            console.log(err.message);
        }
    }

    const handleSearch = async () => {
        if (Search === '') {
            setSearchError('This field is required');
        }
        else {
            setLoading(true);
            const collectionRef = collection(db, "Test");
            const q = query(collectionRef, where('testCode', '==', Search));
            return onSnapshot(q, (snapshot) => {
                if (snapshot.empty) {
                    setSearchResult([]);
                    setSearchError('Invalid Test code');
                }
                else {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    setSearchError('');
                    setSearchResult([...data])
                    setSearch('')
                }
                setLoading(false)
            })
        }
    };
    const handleTestClick = (test) => {
        setSearchResult([]);
        setLoading(true);
        setSearchError('');
        navigation.navigate('Quiz', { test });
    }

    return (
        (!user) ? (
            <Text>user not Logged In</Text>
        ) : (
            <ScrollView>
                <View style={styles.container}>
                    <Title />
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                    <View style={styles.bannerContainer}>
                        <Image source={require('../assets/quiz.png')}
                            style={styles.banner}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.inputLabel}>test code </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.input}
                        >
                            <TextInput
                                style={styles.inputText}
                                placeholder="Enter test code"
                                placeholderTextColor="#fff"
                                value={Search}
                                onChangeText={(text) => {
                                    setSearch(text)
                                    setSearchError('')
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSearch}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                    {!searchError ? null : (
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{searchError}</Text>
                        </View>
                    )}
                    <View>
                        {(loading) ? (
                            <Text>Loading...</Text>
                        ) : (
                            (searchResult.length > 0) ? (
                                <View>
                                    <Text style={styles.searchResultHeading}>Available Tests</Text>
                                    {searchResult.map((test, index) => {
                                        return (
                                            <View key={test.id}>
                                                <TouchableOpacity
                                                    style={styles.searchResult}
                                                    onPress={() => handleTestClick(test)}
                                                >
                                                    <Text style={styles.searchText}>{test.testName}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            ) : (
                                null
                            )
                        )}
                    </View>
                </View>
            </ScrollView>
        )
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 16,
        height: '100%',
    },
    banner: {
        height: 300,
        width: 300,
    },
    bannerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        width: '30%',
        backgroundColor: '#4a8cff',
        padding: 8,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        padding: 8,
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: '600',
        padding: 8,
    },
    input: {
        width: '68%',
        fontSize: 18,
        backgroundColor: '#4a8cff',
        padding: 8,
        borderRadius: 16,

    },
    inputText: {
        fontSize: 18,
    },
    logoutButton: {
        alignItems: 'flex-end',
        padding: 8,
    },
    logoutButtonText: {
        fontSize: 18,
        padding: 12,
        backgroundColor: '#4a8cff',
        borderRadius: 16,
    },
    searchResultHeading: {
        fontSize: 18,
        fontWeight: '600',
        padding: 8,
    },
    searchResult: {
        backgroundColor: '#4a8cff',
        padding: 8,
        borderRadius: 16,
        alignItems: 'center',
    },
    searchText: {
        fontSize: 18,
        fontWeight: '600',
        padding: 8,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});

