import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView, Alert} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { confirmResetPassword } from 'aws-amplify/auth';
import { useRoute } from '@react-navigation/native';

const NewPasswordScreen = () => {
    const route = useRoute();
    const username = route?.params?.username;
    const {control, handleSubmit} = useForm()
    const [loading, setLoading] = useState(false)

    const navigation=useNavigation()

    const onSubmitPressed = async(data) => {
        if(loading){
            return;
        }

        setLoading(true)

        try {
            await confirmResetPassword({
                username,
                newPassword: data.password,
                confirmationCode: data.code,
            });

            Alert.alert('Success', 'Password reset successful. You can now sign in.');
            navigation.navigate('SignIn');
        } catch (e) {
            console.log('Reset password error:', e);

            let message = 'Something went wrong';
            if (e.name === 'CodeMismatchException') {
                message = 'Invalid confirmation code';
            } else if (e.name === 'ExpiredCodeException') {
                message = 'Code expired. Please request a new one.';
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
                name='code'
                placeholder="Code" 
                control={control}
                rules={{required:'Code is required'}} 
                secureTextEntry={false}
            />

            <CustomInput 
                name='password'
                placeholder="Enter new password" 
                control={control}
                rules= {{
                    required:'Password is required',
                    minLength: {
                        value:8,
                        message:'Password should have at least 3 characters'
                    },
                }}
                secureTextEntry={true}
            />
           
            <CustomButton 
                text={loading ? "Loading..." : "Submit"} 
                onPress={handleSubmit(onSubmitPressed)}
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

export default NewPasswordScreen