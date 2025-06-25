import React from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
import { useForm, Controller } from 'react-hook-form'

const CustomInput = ({control, name, rules = {}, placeholder, secureTextEntry}) => {
    return(
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <>
                    <View style={[styles.container, {borderColor: error ? 'red': '#e8e8e8'}]}>
                    <TextInput 
                        value={value} 
                        onChangeText={onChange} 
                        onBlur={onBlur} 
                        placeholder={placeholder}
                        placeholderTextColor="#666"
                        style={styles.input}
                        secureTextEntry={secureTextEntry}
                    />
                    </View>
                    {error && (
                        <Text style={{color:'red', alignSelf: 'center'}}>{error.message || 'Error'}</Text>)}
                    </>
                )}
            />
    )
}

const styles= StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '80%',
        //height: '5%',
        minHeight: 45,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10
    },
    input: {
        color: 'black', // ✅ face textul vizibil
        fontSize: 16,   // (opțional) mărime text clară
        flex: 1
    }
})

export default CustomInput
