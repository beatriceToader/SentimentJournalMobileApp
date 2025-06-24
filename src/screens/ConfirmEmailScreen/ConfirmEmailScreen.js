import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const ConfirmEmailScreen = () => {
    const [code, setCode] = useState('')

    const navigation = useNavigation();

    const onConfirmPressed = () => {
        navigation.navigate('Home')
    }

    const onResendCodePressed = () => {
        console.warn("onResendCodePressed")
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn')
    }

    return(
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Confirm your email</Text>
            <CustomInput 
                placeholder="Enter confirmation code" 
                value={code} 
                setValue={setCode} 
                secureTextEntry={false}
            />
           
            <CustomButton 
                text="Confirm" 
                onPress={onConfirmPressed}
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