import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
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
import SwitchToggle from "react-native-switch-toggle";
import InputField from '../../../components/InputField';
import { appIcons } from '../../../services/utilities/Assets';
import Button from '../../../components/Button';
import * as ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../navigation/AuthProvider';
import DropDownPicker from 'react-native-dropdown-picker';

const AddCareTaker = ({navigation}) => {
  const {user} = useContext(AuthContext);

    const [image, setImage] = useState(null);
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')

    

  const pickImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('ImagePicker Response:', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setImage({ uri: response.assets[0].uri });
      }
    });
  };

  const Add = async() =>{
    try{
      if(!user){
        return
      }
      
      const userId = user.uid

      const usercareTakerDocRef = firestore().collection('careTakers').doc(userId);
      if(name==='',phone=== '', email==='',location===''){
        console.log('====================================');
        console.log('please fill all fields');
        console.log('====================================');
        return
      }
    const careTaker = {
      name: name,
      location: location,
      email: email,
      phone: phone,
      image: image
    };
    const careTakerSnapshot = await firestore().collection('CareTakers').get();
    let careTakerExist = false;
    careTakerSnapshot.forEach(doc => {
        const careTakers = doc.data().careTakers || [];
        if (careTakers.some(careTakers => careTakers.email === email || careTakers.phone === phone)) {
          careTakerExist = true;
        }
      });
      if (careTakerExist) {
        console.log('careTakerExist exists in Firestore');
        return; // Exit the function if the device ID exists
      }
      await usercareTakerDocRef.set({
        careTakers: firestore.FieldValue.arrayUnion(careTaker)
      }, { merge: true });
      if (status) {
        try {
          const devicesRef = firestore().collection('Devices').doc(userId);
          const devicesDoc = await devicesRef.get();
          if (devicesDoc.exists) {
            const devicesData = devicesDoc.data();
            const updatedMessages = devicesData.messages.map(device => {
              if (device.deviceId === status) {
                return {
                  ...device,
                  careTaker: email, // Assign user's email as careTaker
                };
              }
              return device;
            });
  
            await devicesRef.update({
              messages: updatedMessages,
            });
  
            console.log('Device updated successfully!');
          } else {
            console.log('No devices document found!');
          }
        } catch (error) {
          console.error('Error updating device in Firestore:', error);
        }
      }

      console.log('Device added successfully');
       navigation.navigate('HomeStack');
    } catch (error) {
      console.error('Error adding message to Firestore:', error);
    }
  }
  useEffect(() => {
    const userId = user.uid
    const devicesDocRef = firestore().collection('Devices').doc(userId);
  
    const fetchDevicesWithoutCareTaker = async () => {
      try {
        const devicesDoc = await devicesDocRef.get();
        if (devicesDoc.exists) {
          const devicesData = devicesDoc.data();
          const devicesWithoutCareTaker = devicesData.messages.filter(device => !device.careTaker);
          
          setItems(devicesWithoutCareTaker)
          console.log('Devices without caretaker:', devicesWithoutCareTaker);
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
  const [status, setStatus] = useState('');
  return (
    
    <LinearGradient
    colors={Colors.appGradientColors1}
      start={{ x: -1, y:-1  }}
      end={{ x: 0, y: 1 }}
      style={[
        AppStyles.linearGradient,
      ]}
    >
      <Header back onPress={()=>navigation.goBack()} text={"Add CareTaker"} profile/>
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
                  style={[AppStyles.image, {borderRadius: scale(10)}]}
                  source={image}
                />
              ) : (
                <Image style={AppStyles.image} source={appIcons.user} />
              )}
            </TouchableOpacity>
    <InputField mode={"email"} value={email} onChangeText={setEmail} lebal={'Email'} placeholder={"s@gmail.com"} />
    <InputField type={"number-pad"} value={phone} onChangeText={setPhone} lebal={'Phone'} placeholder={"+923034518303"} />
    <InputField value={name} onChangeText={setName} lebal={'Name'} placeholder={"Shamraiz"} />
    <View style={{marginTop:responsiveScreenHeight(2)}}>
              <Text style={AppStyles.field}>Plant</Text>
              <View >
                <DropDownPicker
                  items={items.map((item, index) => ({
                    label: item.name,
                    value: item.deviceId,
                    
                  }))}
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
    <InputField value={location} onChangeText={setLocation} lebal={'Location'} placeholder={"Sialkot"} />
    <View style={AppStyles.btnContainer}>
        <Button text={'Add'} onPress={Add} />
    </View>

     
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
   
  );
};

export default AddCareTaker;

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
