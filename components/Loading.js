import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loading = ({loadingMsg}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>{loadingMsg}</Text>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Text: {
        fontSize: 24,
    }
})