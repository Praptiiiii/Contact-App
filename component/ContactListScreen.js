

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import db from './Database';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-swipeable';
import { useFocusEffect } from '@react-navigation/native';


export const ContactListScreen = ({ navigation, route }) => {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');

  
  const loadContacts = () => {
    db.transaction((tx) => {
      let query = `SELECT * FROM contacts ORDER BY name ASC`;

      if (searchText) {
        query = `SELECT * FROM contacts WHERE name LIKE '%${searchText}%' ORDER BY name ASC`;
      }

      tx.executeSql(
        query,
        [],
        (_, { rows }) => {
          const data = rows._array;
          setContacts(data);
        },
        (error) => {
          console.error('Error selecting contacts: ', error);
        }
      );
    });
  };
  

  useEffect(() => {
    loadContacts(searchText);
  }, [searchText, route.params]);

  useEffect(() => {
    if (route.params?.contact) {
      const newContact = route.params.contact;
      setContacts([...contacts, newContact]);
    }
  }, [route.params]);

  
  useFocusEffect(
    React.useCallback(() => {
      loadContacts();
    }, [])
  );
  
  

  const handleDeleteContact = (contactId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM contacts WHERE id = ?',
        [contactId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            // Contact deleted successfully
            loadContacts(searchText); // Reload the contact list after deletion
          } else {
            console.error('Error deleting contact');
          }
        },
        (error) => {
          console.error('Error deleting contact: ', error);
        }
      );
    });
  };

  const renderContactItem = (item) => {
    const leftContent = [
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteContact(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>,
    ];

    const rightButtons = [
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('UpdateScreen', { contact: item })}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>,
    ];

    return (
      <Swipeable leftContent={leftContent} rightButtons={rightButtons} onLeftActionRelease={() => handleDeleteContact(item.id)}>
        <TouchableOpacity style={styles.contactItem}>
          <Image style={styles.contactImage} source={{ uri: item.imageUri }} />
          <Text style={styles.contactName}>{item.name}</Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact List</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Contacts"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <FlatList data={contacts} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => renderContactItem(item)} />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddContactScreen')}>
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  contactItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: 'white',
  },
  editButton: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'blue',
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: 'white',
  },
});

export default ContactListScreen;

