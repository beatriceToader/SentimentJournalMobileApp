import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

    const navigation = useNavigation();

    const onRegisterPressed = () => {
        navigation.navigate('ConfirmEmail')
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
                placeholder="Username" 
                value={username} 
                setValue={setUsername} 
                secureTextEntry={false}
            />
            <CustomInput 
                placeholder="Email" 
                value={email}
                setValue={setEmail} 
                secureTextEntry={false}
            />
            <CustomInput 
                placeholder="Password" 
                value={password} 
                setValue={setPassword} 
                secureTextEntry={true}
            />
            <CustomInput 
                placeholder="Repeat Password" 
                value={passwordRepeat} 
                setValue={setPasswordRepeat} 
                secureTextEntry={true}
            />
            <CustomButton 
                text="Register" 
                onPress={onRegisterPressed}
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