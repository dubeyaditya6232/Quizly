import { StyleSheet } from "react-native";

export const titleStyles = StyleSheet.create({
    pageTitle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageTitleText: {
        fontSize: 24,
        fontWeight: '600',
    },
});

export const formStyles = StyleSheet.create({
    form: {
        paddingHorizontal: 16,
    },
    formText: {
        fontSize: 18,
        padding: 4
    },
    formInput: {
        marginBottom: 10,
    },
    formInputText: {
        borderRadius: 12,
        backgroundColor: '#4a8cff',
        padding: 8,
    },
});

export const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 16,
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 1,
        marginTop: 5,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '600',
    },
    bottom: {
        alignItems: 'center',
    },
    bottomText: {
        fontSize: 16,
        paddingHorizontal: 8,
        color: '#4a8cff',
    },

});

export const errorStyles = StyleSheet.create({
    error: {
        alignItems: 'center',
        padding: 6,
    },
    errorText: {
        color: "red",
        fontSize: 12,
    }
});

export const testStyles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 12
    },
});

export const containerStyles = StyleSheet.create({
    container: {
        paddingTop: 40,
        height: '100%',
        paddingHorizontal: 12,
    },
});

export const bannerStyles = StyleSheet.create({
    banner: {
        height: 300,
        width: 300,
    },
    bannerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});