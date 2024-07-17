import {Dimensions, Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily, fontSize} from '../../../services/utilities/Fonts';
import {Colors} from '../../../services/utilities/Colors';
import { AppStyles } from '../../../services/utilities/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import { appIcons } from '../../../services/utilities/Assets';
import Button from '../../../components/Button';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from '../../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import ImageResizer from 'react-native-image-resizer';
import { scale } from 'react-native-size-matters';


const CareTakerDetail = ({route, navigation }) => {
  const {user} = useContext(AuthContext)
  const { id } = route.params; 
  useEffect(() => {
    const fetchCareTakers = async () => {
      if (!user) return;

      
      const userId = user.uid;

      try {
        const userDocRef = firestore().collection('careTakers').doc(userId);
        const docSnapshot = await userDocRef.get();

        if (docSnapshot.exists) {
          const userData = docSnapshot.data();
          const careTakers = userData.careTakers || [];

          const filteredCareTakers = careTakers.find(
            careTaker => careTaker.email === id
          );

          console.log('Fetched filter careTakers:', filteredCareTakers);
          setEmail(filteredCareTakers.email);
          setName(filteredCareTakers.name)
          setLocation(filteredCareTakers.location)
          setPhone(filteredCareTakers.phone)
          setImage(filteredCareTakers.image)
        } else {
          console.log('No document found with the specified userId');
          // setCareTakers([]);
        }
      } catch (error) {
        console.error('Error fetching careTakers from Firestore:', error);
        // setCareTakers([]);
      }
    };

    fetchCareTakers();
  }, []);

  useEffect(() => {
    const userId = user.uid
    const devicesDocRef = firestore().collection('Devices').doc(userId);
  
    const fetchDevicesWithoutCareTaker = async () => {
      try {
        const devicesDoc = await devicesDocRef.get();
        if (devicesDoc.exists) {
          const devicesData = devicesDoc.data();
          const devicesWithoutCareTaker = devicesData.messages.filter(device => !device.careTaker || device.careTaker===id);
          const devicesWithoutCare = devicesData.messages.find(device => device.careTaker===id);
          if (devicesWithoutCare){
          setStatus(devicesWithoutCare.deviceId)
          }
          setItems(devicesWithoutCareTaker)
          console.log('Devices without caretaker:', devicesWithoutCare);
        } else {
          console.log('No devices document found!');
        }
      } catch (error) {
        console.error('Error fetching devices from Firestore:', error);
      }
    };
  
    fetchDevicesWithoutCareTaker();
  }, []);
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(id);

  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  const pickImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  
    ImagePicker.launchImageLibrary(options, async response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        const source = { uri: selectedAsset.uri };
        console.log('source', source);
        const filename = selectedAsset.fileName;
        const resizedImage = await ImageResizer.createResizedImage(
          selectedAsset.uri,
          Dimensions.get('window').width / 1,
          Dimensions.get('window').height / 1,
          'JPEG',
          70,
        );
        const uploadUri = Platform.OS === 'ios' ? resizedImage.uri.replace('file://', '') : resizedImage.uri;
        const reference = storage().ref(`/careTakers/${filename}`);
  
        try {
          await reference.putFile(uploadUri);
          const url = await reference.getDownloadURL();
          setImage(url);
          // setIsDisabled(false)
        } catch (error) {
          console.error('Error in uploading image to the bucket:', error);
        }
      }
    });
  };

  
  const Update = async () => {
    try {
      if (!user) {
        return;
      }
  
      const userId = user.uid;
  
      const usercareTakerDocRef = firestore().collection('careTakers').doc(userId);
  
      if (name === '' || phone === '' || email === '' || location === '') {
        console.log('====================================');
        console.log('Please fill all fields');
        console.log('====================================');
        return;
      }
  
      const careTaker = {
        name: name,
        location: location,
        email: email,
        phone: phone,
        image: image,
      };
  
      const docSnapshot = await usercareTakerDocRef.get();
  
      if (!docSnapshot.exists) {
        console.log('No document found with the specified userId');
        return;
      }
  
      const userData = docSnapshot.data();
      const careTakers = userData.careTakers || [];
  
      const careTakerIndex = careTakers.findIndex(
        careTaker => careTaker.email === email
      );
  
      if (careTakerIndex === -1) {
        console.log('CareTaker with the specified email not found');
        return;
      }
  
      careTakers[careTakerIndex] = careTaker; // Update the careTaker details
  
      await usercareTakerDocRef.update({
        careTakers: careTakers,
      });
      if (status) {
        try {
          const devicesRef = firestore().collection('Devices').doc(userId);
          const devicesDoc = await devicesRef.get();
          
          if (devicesDoc.exists) {
            const devicesData = devicesDoc.data();
            
            // Update messages array
            const updatedMessages = devicesData.messages.map(device => {
              if (device.deviceId === status) {
                // Assign user's email as careTaker for the selected device
                return {
                  ...device,
                  careTaker: email,
                };
              } else if (device.careTaker === email) {
                // Remove email as careTaker only if it matches current email
                return {
                  ...device,
                  careTaker: '',
                };
              } else {
                // Keep existing careTaker assignments unchanged
                return device;
              }
            });
      
            // Update Firestore document with the updated messages array
            await devicesRef.update({
              messages: updatedMessages,
            });
      
            console.log('Devices updated successfully!');
          } else {
            console.log('No devices document found!');
          }
        } catch (error) {
          console.error('Error updating devices in Firestore:', error);
        }
      }
      
      console.log('CareTaker updated successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error updating careTaker in Firestore:', error);
    }
  };
  
  
  return (
    
    <LinearGradient
    colors={Colors.appGradientColors1}
      start={{ x: -1, y:-1  }}
      end={{ x: 0, y: 1 }}
      style={[
        AppStyles.linearGradient,
      ]}
    >
      <Header back onPress={()=>navigation.goBack()} text={"Care Taker"} profile/>
     <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
        <TouchableWithoutFeedback>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            contentContainerStyle={[AppStyles.contentContainer]}
            keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
    <TouchableOpacity onPress={pickImage} style={AppStyles.imageContainer}>
    {image ? (
                <Image
                  style={[AppStyles.image, {borderRadius: scale(100)}]}
                  source={{uri:image}}
                />
              ) : (
                <Image style={AppStyles.image} source={appIcons.user} />
              )}
            </TouchableOpacity>
            <InputField edit={false} value={email} onChangeText={setEmail} lebal={'Email'} placeholder={"s@gmail.com"} />
    <InputField type={"numeric"} value={phone} onChangeText={setPhone} lebal={'Phone'} placeholder={"+923034518303"} />
    <InputField value={name} onChangeText={setName} lebal={'Name'} placeholder={"Shamraiz"} />
    <InputField value={location} onChangeText={setLocation} lebal={'Location'} placeholder={"Sialkot"} />
    <View style={{marginTop:responsiveScreenHeight(2)}}>
              <Text style={AppStyles.field}>Plant</Text>
              <View >
                <DropDownPicker
                  items={items.map((item, index) => ({
                    label: item.name,
                    value: item.deviceId,
                    
                  }))}
                  defaultValue={status}
                  arrowColor={Colors.blackText}
                  labelStyle={styles.label}
                  placeholder={' '}
                  dropDownMaxHeight={170}
                  containerStyle={AppStyles.dcontainer}
                  style={AppStyles.Dropdown}
                  setValue={value => setStatus(value)}
                  setOpen={() => setIsOpen(!isOpen)}
                  open={isOpen}
                  value={status}
                  dropDownStyle={AppStyles.dropDownStyle}
                />
              </View>
              </View>
    <View style={AppStyles.btnContainer}>
        <Button text={'Update Care Taker'} onPress={Update} />
      </View>
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
   
  );
};

export default CareTakerDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  
  forgot:{
    color:Colors.textColor1,
    marginTop:responsiveScreenHeight(1),
    fontFamily:fontFamily.Montserrat,
    fontSize:fontSize.h2,
    fontWeight:'700'
  }
  
});
