import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView, Alert} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

const ConfirmEmailScreen = () => {
    const route = useRoute()
    const {control, handleSubmit} = useForm({defaultValues: {username: route?.params?.username}})
    

    const navigation = useNavigation();

    const onConfirmPressed = async(data) => {
        try{
            await confirmSignUp({
                username: data.username,
                confirmationCode: data.code,
            });

            Alert.alert('Success', 'Email confirmed. Please sign in.');
            navigation.navigate('SignIn');

        } catch(e){
            console.log('Confirm sign up error', e);
            let message = 'Something went wrong';

            if (e.name === 'CodeMismatchException') {
                message = 'Invalid confirmation code';
            } else if (e.name === 'UserNotFoundException') {
                message = 'User not found';
            } else if (e.name === 'NotAuthorizedException') {
                message = 'User already confirmed';
            } else if (e.message) {
                message = e.message;
            }

            Alert.alert('Ooops', message);
        }
    }

    const onResendCodePressed = async() => {
        try {
            const username = control._formValues.username; // sau poți folosi watch('username') dacă îl imporți

            await resendSignUpCode({ username });
            Alert.alert('Success', 'Confirmation code resent to your email.');
        } catch (e) {
            console.log('Resend code error', e);
            let message = 'Could not resend code';

            if (e.name === 'UserNotFoundException') {
                message = 'User not found';
            } else if (e.name === 'InvalidParameterException') {
                message = 'Invalid username';
            } else if (e.message) {
                message = e.message;
            }

            Alert.alert('Ooops', message);
        }
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn')
    }

    return(
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Confirm your email</Text>
            <CustomInput
                name='username' 
                placeholder="Username" 
                control={control}
                rules={{required:'Username is required'}} 
                secureTextEntry={false}
            />

            <CustomInput
                name='code' 
                placeholder="Enter confirmation code" 
                control={control}
                rules={{required:'Code is required'}} 
                secureTextEntry={false}
            />
           
            <CustomButton 
                text="Confirm" 
                onPress={handleSubmit(onConfirmPressed)}
            />

            <CustomButton 
                text="Resend Code" 
                onPress={onResendCodePressed}
                type="SECONDARY"    
            />

            <CustomButton 
                text="Back to Sign In" 
                onPress={onSignInPressed}
                type="TERTIARY"    
            />
            
        </View>
        </ScrollView>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,          // face ca ScrollView să se extindă complet
        justifyContent: 'center',  // sau 'flex-start'
        paddingVertical: 40,  // spațiu sus/jos
        //paddingHorizontal: 20,
        minWidth: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#fbdbab'
    },
    root:{
        //flex: 1, // Ocupă tot ecranul
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start', // aliniezi sus
        paddingTop: 100, // distanță față de topul ecranului
        paddingHorizontal: 20,
        //alignSelf: 'stretch', 
        //backgroundColor: 'white'
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        color:'#58185e', 
        margin: 10
    },
})

export default ConfirmEmailScreen