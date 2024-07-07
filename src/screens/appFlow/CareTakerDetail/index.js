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
import InputField from '../../../components/InputField';
import { appIcons } from '../../../services/utilities/Assets';
import Button from '../../../components/Button';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from '../../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const CareTakerDetail = ({route, navigation }) => {
  const {user} = useContext(AuthContext)
  const { id } = route.params; 
  useEffect(() => {
    const fetchCareTakers = async () => {
      if (!user) return;

      
      const userId = user.uid;
      const targetEmail = 'target-email@example.com'; // Replace with the email you want to match

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
                  style={[AppStyles.image, {borderRadius: scale(10)}]}
                  source={image}
                />
              ) : (
                <Image style={AppStyles.image} source={appIcons.user} />
              )}
            </TouchableOpacity>
            <InputField edit={false} value={email} onChangeText={setEmail} lebal={'Email'} placeholder={"s@gmail.com"} />
    <InputField type={"numeric"} value={phone} onChangeText={setPhone} lebal={'Phone'} placeholder={"+923034518303"} />
    <InputField value={name} onChangeText={setName} lebal={'Name'} placeholder={"Shamraiz"} />
    <InputField value={location} onChangeText={setLocation} lebal={'Location'} placeholder={"Sialkot"} />
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
