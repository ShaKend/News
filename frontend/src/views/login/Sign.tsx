import React, {useState, useEffect} from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";

function Sign() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Sign in or Sign up page here!</Text>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Sign;

