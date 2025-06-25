import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { signUp } from 'aws-amplify/auth';
import { Alert } from 'react-native';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUpScreen = () => {
    const {control, handleSubmit, watch} = useForm()
    const pwd = watch('password')
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation();

    const onRegisterPressed = async (data) => {
        if(loading){
            return;
        }

        setLoading(true)

        try{
            const {username, password, email}=data;
            const response = await signUp({
                username,
                password,
                options: {
                    userAttributes:{
                        email
                    }
                }
            })
            navigation.navigate('ConfirmEmail',{username})
        }catch(e){
            console.error('Sign up error', e);
            Alert.alert('Ooops', e.message)
        }
        setLoading(false)
    }

    const onTermsOfUsePressed = () => {
        console.warn("TermOfUse")
    }

    const onPrivacyPolicyPressed = () => {
        console.warn("PrivacyPolicy")
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn')
    }

    return(
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Create Account</Text>
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
            <CustomInput 
                name='email'
                placeholder="Email" 
                control={control}
                rules= {{required:'Email is required', pattern: {value: EMAIL_REGEX, message:'Email is invalid'}}} 
                secureTextEntry={false}
            />
            <CustomInput
                name='password' 
                placeholder="Password" 
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
            <CustomInput 
                name='repeatPassword'
                placeholder="Repeat Password" 
                control={control}
                rules= {{
                    required:'Repeat Password is required',
                    validate: value => 
                        value === pwd || 'Passwords do not match'
                }} 
                secureTextEntry={true}
            />
            <CustomButton 
                text={loading ? "Loading...":"Register"} 
                onPress={handleSubmit(onRegisterPressed)}
            />

            <Text style={styles.text}>By registering, you confirm that you accept our{' '}<Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and{' '}  
                                    <Text style={styles.link} onPress={onPrivacyPolicyPressed}>Privacy Policy</Text> </Text>

            <CustomButton 
                text="Have an account? Sign In" 
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
    text:{
        color: 'gray',
        marginVertical: 10,
        padding: 15,
    },
    link:{
        color: '#FDB075'
    }
})

export default SignUpScreen