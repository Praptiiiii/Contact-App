import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { openDatabase } from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';


const db = openDatabase('contacts.db');

db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, mobile TEXT, landline TEXT, favorite INTEGER, imageUri TEXT)',
    [],
    () => {
      console.log('Table created successfully');
    },
    (error) => {
      console.error('Error creating table: ', error);
    }
  );
});

const AddContact = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [landline, setLandline] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log('Permission to access photos is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const saveContact = () => {
    if (name.trim() === '' || mobile.trim() === '') {
      Alert.alert('Missing Information', 'Name and mobile number are required fields.');
    } else if (mobile.length > 10 || (landline && landline.length > 10)) {
      Alert.alert('Invalid Mobile Number', 'Mobile number should not have more than 10 digits.');
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT id FROM contacts WHERE name = ?',
          [name],
          (_, result) => {
            if (result.rows.length > 0) {
              Alert.alert('Contact Already Exists', 'A contact with the same name already exists.');
            } else {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO contacts (name, mobile, landline, favorite, imageUri) VALUES (?, ?, ?, ?, ?)',
                  [name, mobile, landline, isFavorite ? 1 : 0, imageUri],
                  (_, result) => {
                    console.log('Contact saved successfully');
                    const newContact = {
                      id: result.insertId,
                      name,
                      mobile,
                      landline,
                      favorite: isFavorite ? 1 : 0,
                      imageUri,
                    };
                    if (route.params && route.params.onGoBack) {
                      console.log('onGoBack function is called');
                      route.params.onGoBack(newContact);
                    }
                    navigation.navigate('ContactListScreen');
                  },
                  (error) => {
                    console.error('Error saving contact: ', error);
                  }
                );
              });
            }
          },
          (error) => {
            console.error('Error checking for duplicate name: ', error);
          }
        );
      });
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <View style={styles.phoneScreen}>
        <View style={styles.favoriteIconContainer}>
          <TouchableOpacity onPress={toggleFavorite}>
            <Icon
              name={isFavorite ? 'star' : 'star-o'}
              size={24}
              color={isFavorite ? 'gold' : 'black'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Add New Contact</Text>
        <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="camera" size={40} color="gray" />
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Mobile"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Landline"
          value={landline}
          onChangeText={(text) => setLandline(text)}
          style={styles.input}
        />
        <TouchableHighlight
          style={styles.showItemsButton}
          underlayColor="#003366"
        >
          <Text style={styles.buttonText} onPress={saveContact}>
            Save
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  showItemsButton: {
    backgroundColor: 'grey',
    padding: 15,
    margin: 50,
    borderRadius: 5,
    alignSelf: 'center',
    color: 'black',
  },
  phoneScreen: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: '100%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    color: 'black',
  },
});

export default AddContact;
