import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView, Alert} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { resetPassword } from 'aws-amplify/auth';

const ForgotPasswordScreen = () => {
    const {control, handleSubmit} = useForm()
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation();   

    const onSendPressed = async(data) => {
        if(loading){
            return;
        }

        setLoading(true)

        try {
            const response = await resetPassword({ username: data.username });

            console.log('Reset password response:', response);
            Alert.alert('Success', 'Confirmation code sent to your email');
            navigation.navigate('NewPassword', { username: data.username });
        } catch (e) {
            console.log('Forgot password error', e);

            let message = 'Something went wrong';
            if (e.name === 'UserNotFoundException') {
                message = 'User not found';
            } else if (e.name === 'InvalidParameterException') {
                message = 'Invalid username';
            } else if (e.message) {
                message = e.message;
            }

            Alert.alert('Ooops', message);
        }
        setLoading(false)
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn')
    }

    return(
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Reset your password</Text>
            <CustomInput 
                name='username'
                placeholder="Username" 
                control={control}
                rules= {{
                    required:'Username is required',
                    minLength: {
                        value:3,
                        message:'Username should have at least 3 characters'
                    },
                    maxLength: {
                        value:24,
                        message:'Username should have less than 24 characters'
                    },
                }} 
                secureTextEntry={false}
            />
           
            <CustomButton 
                text={loading ? "Loading..." : "Send"} 
                onPress={handleSubmit(onSendPressed)}
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

export default ForgotPasswordScreen