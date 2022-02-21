import { ScrollView, StyleSheet, Text, View,BackHandler } from 'react-native'
import React,{useEffect} from 'react'

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
            <View style={styles.container}>
                <Text style={styles.title}>{test.testName}</Text>
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
    container: {
        paddingTop: 40,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 8,
        textAlign: 'center',
    },
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