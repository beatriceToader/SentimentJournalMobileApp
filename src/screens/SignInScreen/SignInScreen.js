import React, {useState} from 'react'
import {View, Text, Image, StyleSheet, Dimensions, ScrollView} from 'react-native'
import Logo from '../../../assets/images/mood-journal-logo.png'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const SignInScreen = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();

    const onSignInPressed = () => {
        //validate User
        navigation.navigate('Home')
    }

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
                placeholder="Username" 
                value={username} 
                setValue={setUsername} 
                secureTextEntry={false}
            />
            <CustomInput 
                placeholder="Password" 
                value={password} 
                setValue={setPassword} 
                secureTextEntry={true}
            />
            <CustomButton 
                text="Sign In" 
                onPress={onSignInPressed}
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
        paddingTop: 50, // distanță față de topul ecranului
        paddingHorizontal: 20,
        //alignSelf: 'stretch', 
        //backgroundColor: 'white'
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