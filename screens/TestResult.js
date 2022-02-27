import { ScrollView, StyleSheet, Text, View, BackHandler } from 'react-native'
import React, { useEffect } from 'react'

import { testStyles, containerStyles } from '../styles/styles';

const TestResult = ({ navigation, route }) => {

    const { test } = route.params;;
    test.participants?.sort((a, b) => b.score - a.score);

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
                <Text style={testStyles.title}>{test.testName}</Text>
                {test.participants?.map((participant, index) => {
                    return (
                        <View key={participant.participantId} style={styles.block} >
                            <Text style={styles.blockText}>{index + 1}) Name : {participant.participantName}</Text>
                            <Text style={styles.blockText}> {'  '} Score : {participant.score}</Text>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    )
}

export default TestResult

const styles = StyleSheet.create({
    block: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#07255b',
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#4a8cff',
    },
    blockText: {
        fontSize: 14,
    },
})