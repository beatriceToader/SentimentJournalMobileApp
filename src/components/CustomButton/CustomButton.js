import React from 'react'
import {View, Text, StyleSheet, Pressable} from 'react-native'

const CustomButton = ({onPress, text, type='PRIMARY'}) => {
    return(
        <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
            <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '80%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5
    },
    container_PRIMARY: {
        backgroundColor: '#fb747c',
    },
    container_SECONDARY:{
        borderColor: '#fb747c',
        borderWidth: 2
    },
    container_TERTIARY: {
        
    },
    text: {
        fontWeight: 'bold',
        color: '#58185e'
    },
    text_SECONDARY: {
        color: '#fb747c'
    },
    text_TERTIARY: {
        fontStyle: 'italic',
        color: '#58185e'
    },
})

export default CustomButton