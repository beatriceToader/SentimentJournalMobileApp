import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const ForgotPasswordScreen = () => {
    const [username, setUsername] = useState('')

    const navigation = useNavigation();   

    const onSendPressed = () => {
        navigation.navigate('NewPassword')
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn')
    }

    return(
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Reset your password</Text>
            <CustomInput 
                placeholder="Username" 
                value={username} 
                setValue={setUsername} 
                secureTextEntry={false}
            />
           
            <CustomButton 
                text="Send" 
                onPress={onSendPressed}
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