import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('contacts.db');

const FavouriteScreen = ({ navigation }) => {
  const [favoriteContacts, setFavoriteContacts] = useState([]);

  useEffect(() => {
    const loadFavoriteContacts = () => {
      // Fetch favorite contacts from the database
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM contacts WHERE favorite = 1',
          [],
          (_, { rows: { _array } }) => {
            setFavoriteContacts(_array);
          },
          (error) => {
            console.error('Error fetching favorite contacts: ', error);
          }
        );
      });
    };

    // Load favorite contacts when the component mounts
    loadFavoriteContacts();

    const unsubscribe = navigation.addListener('focus', () => {
      // Load favorite contacts when the screen comes into focus
      loadFavoriteContacts();
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Contact List</Text>
      <FlatList
        data={favoriteContacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem}>
            <Image
              style={styles.contactImage}
              source={{ uri: item.imageUri }}
            />
            <Text style={styles.contactName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
  },
  contactItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row', // Display image and name side by side
    alignItems: 'center',
  },
  contactName: {
    fontSize: 18,
    marginLeft: 10,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default FavouriteScreen;
