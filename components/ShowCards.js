import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Icon } from 'react-native-elements';

import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ShowCards = ({ navigation, test, testList, setTestList }) => {

    const [menu, setMenu] = useState(false);

    const deleteTest = async (testId) => {
        setMenu(false);
        setTestList(testList.filter(test => test.id !== testId));
        const docRef = doc(db, 'Test', testId);
        await deleteDoc(docRef)
            .then(() => console.log('Deleted'), (err) => console.log(err))
            .catch(error => console.log(error));
    };

    const editTest = (test) => {
        setMenu(false);
        navigation.navigate("EditTest", { test });
    };

    const testDetails = (test) => {
        setMenu(false);
        navigation.navigate("TestDetails", { test });
    };

    const testResults = (test) => {
        setMenu(false);
        navigation.navigate("TestResults", { test });
    };

    return (
        <View>
            <View style={styles.testBoxContainer}>
                <Text style={styles.testBoxContainerText}>{test.testName}</Text>
                <View style={styles.IconBlock}>
                    <TouchableOpacity
                        style={styles.Icon}
                        onPress={() => setMenu(!menu)}
                    >
                        <Icon
                            name="more-vert"
                            type="material"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {menu && (
                <View style={styles.menu}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => testResults(test)}
                        >
                            <Text style={styles.menuText}>Results</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => testDetails(test)}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuText}>Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => editTest(test)}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => deleteTest(test.id)}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    )
}

export default ShowCards

const styles = StyleSheet.create({
    testBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#4a8cff',
        padding: 10,
        borderRadius: 16,
        marginBottom: 6,
    },
    testBoxContainerText: {
        fontSize: 20,
    },
    IconBlock: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    Icon: {
        padding: 6,
    },
    menu: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    menuContainer: {
        width: '30%',
        backgroundColor: '#07bcf8',
        borderRadius: 16,
        padding: 6,
        zIndex: 1,
    },
    menuText: {
        fontSize: 16,
        paddingHorizontal: 10
    },
    menuItem: {
        borderWidth: 2,
        borderColor: '#07255b',
        padding: 2,
        marginBottom: 2,
        borderRadius: 8,
    },
})