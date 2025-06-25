import React, {useState} from 'react'
import {View, Text, ScrollView, Image, TextInput, StyleSheet, Dimensions} from 'react-native'
import { signOut } from 'aws-amplify/auth'
import CustomButton from './../../components/CustomButton'
import Logo from '../../../assets/images/mood-journal-logo.png'
import { post } from 'aws-amplify/api'
import { useNavigation, useRoute } from '@react-navigation/native'

const HomeScreen = () => {
    const [loading, setLoading] = useState(false)
    const [loadingAnalyze, setLoadingAnalyze] = useState(false)
    const [entry, setEntry] = useState('')

    const navigation = useNavigation()

    const handleSignOut = async () => {
        if(loading){
            return;
        }
        setLoading(true)

        try {
            await signOut()
        } catch (e) {
            console.log('Sign out error:', e)
        }
        setLoading(false)
    };

    async function handleAnalyze(text) {
         if(loadingAnalyze){
            return;
        }
        setLoadingAnalyze(true)

        try {
            const operation = post({
                apiName: 'moodApi',
                path: '/analyzeMood',
                options: {
                    body: { text },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
            });

            const response = await operation.response;
            const responseText = await response.body.text();

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (err) {
                console.error("Failed to parse response JSON:", err);
                throw new Error("Invalid response format");
            }

            console.log("Sentiment result:", result);

            navigation.navigate('Result', {
                sentiment: result.sentiment,
                confidence: result.scores[result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1).toLowerCase()],
                entry: text,
            })
        } catch (e) {
            console.error('Error calling sentiment API:', e);
        }
        setLoadingAnalyze(false)
    }

    return(
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.root}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />

            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>How are you feeling today?</Text>

            <TextInput
                style={styles.textArea}
                placeholder="Write your mood or journal entry..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={6}
                value={entry}
                onChangeText={setEntry}
            />

            <CustomButton text={loadingAnalyze ? "Loading..." : "Analyze"} onPress={() => handleAnalyze(entry)} />

            <CustomButton 
                text={loading ? "Loading..." : "Sign Out"} 
                onPress={handleSignOut}
                type="SECONDARY"
            />
        </View>
        </ScrollView>
    )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    scrollContainer:{
        flexGrow: 1,
        backgroundColor: '#fbdbab'
    },
    root: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        minHeight: height,
        backgroundColor: '#fbdbab',
    },
    logo: {
        width: width * 0.6,
        height: height * 0.2,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#58185e',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    textArea: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
})

export default HomeScreen