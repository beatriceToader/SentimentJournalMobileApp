import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import * as queries from '../../graphql/queries';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const PastEntriesScreen = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchEntries = async () => {
    setLoading(true);
    const client = generateClient();
    let username = null;

    try {
      const user = await getCurrentUser();
      username = user.username;
    } catch {
      username = 'guest';
    }

    try {
      const result = await client.graphql({
        query: queries.listJournalEntries,
        variables: {},
      });

      const allItems = result.data.listJournalEntries.items;
      const userItems = allItems.filter(entry => entry.username === username);
      setEntries(userItems);
    } catch (e) {
      console.error('Error fetching journal entries:', e);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log('Sign out error:', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.root}>
        <Text style={styles.title}>Past Journal Entries</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#58185e" />
        ) : entries.length === 0 ? (
          <Text style={styles.noEntryText}>No entries found.</Text>
        ) : (
          entries.map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <Text style={styles.entryDate}>
                {new Date(entry.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.entryText}>{entry.text}</Text>
              <Text style={styles.entrySentiment}>
                Sentiment: {entry.sentiment ?? 'N/A'}
              </Text>
            </View>
          ))
        )}

        <CustomButton text="Refresh Entries" onPress={fetchEntries} />
        <CustomButton
          text="Back to Home"
          onPress={() => navigation.navigate('Home')}
          type="PRIMARY"
        />
        <CustomButton
          text="Sign Out"
          onPress={handleSignOut}
          type="SECONDARY"
        />
      </View>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fbdbab',
  },
  root: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    minHeight: height,
    backgroundColor: '#fbdbab',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#58185e',
    marginBottom: 20,
    textAlign: 'center',
  },
  noEntryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  entryCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  entryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  entrySentiment: {
    fontSize: 14,
    color: '#58185e',
    marginBottom: 3,
  },
});

export default PastEntriesScreen;
