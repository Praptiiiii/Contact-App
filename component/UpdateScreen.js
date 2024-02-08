import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, TouchableOpacity, StyleSheet , Alert} from 'react-native';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker'; 

const db = SQLite.openDatabase('contacts.db');

const UpdateScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const [name, setName] = useState(contact.name);
  const [mobile, setMobile] = useState(contact.mobile);
  const [landline, setLandline] = useState(contact.landline);
  const [isFavorite, setIsFavorite] = useState(contact.favorite);
  const [imageUri, setImageUri] = useState(contact.imageUri);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const updateContact = () => {
  
  if (mobile.length > 10 || landline.length > 10) {
    Alert.alert('Invalid Mobile Number', 'Mobile number should not have more than 10 digits.');
    return;
  }

  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE contacts SET name=?, mobile=?, landline=?, favorite=?, imageUri=? WHERE id=?',
      [name, mobile, landline, isFavorite ? 1 : 0, imageUri, contact.id],
      (_, result) => {
        console.log('Contact updated successfully');
        navigation.navigate('ContactListScreen');
      },
      (_, error) => {
        console.error('Error updating contact:', error);
      }
    );
  });
};

  const deleteContact = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM contacts WHERE id=?',
        [contact.id],
        (_, result) => {
          console.log('Contact deleted successfully');
          navigation.navigate('ContactListScreen');
        },
        (_, error) => {
          console.error('Error deleting contact:', error);
        }
      );
    });
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
        <Text style={styles.title}>Update Contact</Text>
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
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.showItemsButton}
            underlayColor="#003366"
          >
            <Text style={styles.buttonText} onPress={updateContact}>
              Update
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.showItemsButton}
            underlayColor="#ff0000"
          >
            <Text style={styles.buttonText} onPress={deleteContact}>
              Delete 
            </Text>
          </TouchableHighlight>
        </View>
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
    margin: 10,
    borderRadius: 5,
    alignSelf: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default UpdateScreen;
