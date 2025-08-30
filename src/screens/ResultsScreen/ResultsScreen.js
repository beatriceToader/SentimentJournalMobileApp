import React, {useState} from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { signOut } from 'aws-amplify/auth';

const ResultsScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(false)
    const { sentiment, confidence, entry } = route.params || {}

    const getEmoji = () => {
        switch(sentiment) {
            case 'POSITIVE': return '😊'
            case 'NEGATIVE': return '😢'
            case 'NEUTRAL': return '😐'
            case 'MIXED': return '😵'
            default: return '❓'
        }
    }

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

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Journal Entry</Text>

            <Text style={styles.emoji}>{getEmoji()}</Text>
            <Text style={styles.moodText}>{sentiment.charAt(0) + sentiment.slice(1).toLowerCase()}</Text>
            <Text style={styles.confidenceText}>{(confidence * 100).toFixed(0)}% {sentiment.charAt(0) + sentiment.slice(1).toLowerCase()}</Text>

            <Text style={styles.entryText}>
                {entry.length > 100 ? entry.slice(0, 100) + '...' : entry}
            </Text>

            <CustomButton text="Back" onPress={() => navigation.navigate('Home')} />
            <CustomButton 
                text={loading ? "Loading..." : "Sign Out"} 
                onPress={handleSignOut}
                type="SECONDARY"
            />
        </View>
    )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fbdbab',
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#58185e',
        marginTop: 20,
    },
    emoji: {
        fontSize: 48,
        marginTop: 10
    },
    moodText: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 5
    },
    confidenceText: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20
    },
    entryText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 40
    },
})

export default ResultsScreen
