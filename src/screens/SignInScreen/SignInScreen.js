import React, {useState} from 'react'
import {View, TextInput, Image, StyleSheet, Dimensions, ScrollView} from 'react-native'
import Logo from '../../../assets/images/mood-journal-logo.png'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
//import { Auth } from 'aws-amplify'
import { useForm, Controller } from 'react-hook-form'
import { signIn } from 'aws-amplify/auth';
//import { Hub } from 'aws-amplify/utils';


const SignInScreen = () => {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)

    const {control, handleSubmit, formState: {errors}} = useForm()

    const onSignInPressed = async (data) => {
        if(loading){
            return;
        }

        setLoading(true)

        try {
            const { isSignedIn, nextStep } = await signIn({
                username: data.username,
                password: data.password,
            });
            console.log('Signed in successfully:', isSignedIn, nextStep);
            //Hub.dispatch('auth', { event: 'signIn' });
        } catch (error) {
            console.log('Sign-in error:', error);

            let errorMessage = 'An unknown error occurred';
            if (error.name === 'UserNotFoundException') {
                errorMessage = 'User does not exist';
            } else if (error.name === 'NotAuthorizedException') {
                errorMessage = 'Incorrect username or password';
            } else if (error.name === 'UserNotConfirmedException') {
                errorMessage = 'User is not confirmed';
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('Sign-in failed', errorMessage);
        }
        setLoading(false)
    };

    const onForgotPasswordPressed = () => {
        navigation.navigate('ForgotPassword')
    }

    const onSignUpPressed = () => {
        navigation.navigate('SignUp')
    }

    return(
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Image 
                source={Logo}
                style={styles.logo} 
                resizeMode='contained'
            />
            <CustomInput 
                name='username'
                placeholder="Username" 
                control={control}
                rules= {{required:'Username is required'}}
                secureTextEntry={false}
            />
            <CustomInput 
                name='password'
                placeholder="Password" 
                control={control}
                rules= {{required:'Password is required', minLength: {value:8, message:'Password must have at least 8 characters'}}}
                secureTextEntry={true}
            />
            <CustomButton 
                text={loading ? "Loading..." : "Sign In"} 
                onPress={handleSubmit(onSignInPressed)}
            />
            <CustomButton 
                text="Forgot password?" 
                onPress={onForgotPasswordPressed}
                type="TERTIARY"    
            />
            <CustomButton 
                text="Don't have an account? Create one" 
                onPress={onSignUpPressed}
                type="TERTIARY"    
            />
        </View>
        </ScrollView>
    )
}

// Your styles remain the same...
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
        minWidth: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#fbdbab'
    },
    root:{
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    logo:{
        width: windowWidth * 0.7,
        height: windowHeight * 0.2,
        maxWidth: 300,
        maxHeight: 200,
        marginTop: 20,
        borderRadius: 5
    }
})

export default SignInScreen