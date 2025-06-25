import React, {useState} from 'react'
import {View, Text} from 'react-native'
import { signOut } from 'aws-amplify/auth';
import CustomButton from './../../components/CustomButton'
//import { Hub } from 'aws-amplify/utils';

const HomeScreen = () => {
    const [loading, setLoading] = useState(false)

    const handleSignOut = async () => {
        if(loading){
            return;
        }

        setLoading(true)

        try {
            await signOut()
            //Hub.dispatch('auth', { event: 'signOut' })
        } catch (e) {
            console.log('Sign out error:', e)
        }
        setLoading(false)
    };

    return(
        <View>
            <Text>Home Screen!!!</Text>
            <CustomButton 
                text={loading ? "Loading..." : "Sign Out"} 
                onPress={handleSignOut}
            />
        </View>
    )
}

export default HomeScreen