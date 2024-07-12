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
import { AuthContext } from '../../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import { scale } from 'react-native-size-matters';

const EditProfile = ({navigation}) => {
  const {user} = useContext(AuthContext);
    const [image, setImage] = useState(null);

    const showCustom = () => {
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Data Updated',
        
        visibilityTime: 6000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        text1Style: {  fontWeight: 'bold', fontSize: fontSize.fieldText,  }, 
        text2Style: { width: 200 },
      });
    };
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

  const [userData, setUserData] = useState([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  useEffect(() => {
    if(!user){
      return
    }
    const userId = user.uid
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('Users').doc(userId).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
          setEmail(userDoc.data().email)
          setName(userDoc.data().name)
          setPhone(userDoc.data().phone)
          setLocation(userDoc.data().location)
          setImage(userDoc.data().profileImage)

          console.log('User==>', userDoc.data());
        } else {
          console.log('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async () => {
    try {
      const userId = user.uid; // Replace with actual user ID or use Firebase Authentication to get user ID
      await firestore().collection('Users').doc(userId).update({
        name: name,
        phone: phone,
        location: location,
        profileImage: image,
      }).then( console.log('User profile updated successfully'))
     
      showCustom()
      // Navigate to profile or any other screen after update
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error updating user profile:', error);
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
      <Header back onPress={()=>navigation.goBack()} text={"Edit Profile"} profile/>
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
                  source={image}
                />
              ) : (
                <Image style={AppStyles.image} source={appIcons.user} />
              )}
            </TouchableOpacity>
    <InputField value={email} lebal={'Email'} placeholder={"abc@gmail.com"} edit={false}/>
    <InputField type={"numeric"} onChangeText={setPhone} value={phone} lebal={'Phone'} placeholder={"+923034518303"} />
    <InputField onChangeText={setName} value={name} lebal={'Name'} placeholder={"username"} />
    <InputField onChangeText={setLocation} value={location} lebal={'Country'} placeholder={"Pakistan"} />
    <View style={AppStyles.btnContainer}>
        <Button text={'Update'} onPress={updateProfile} />
      </View>

     
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
   
  );
};

export default EditProfile;

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
