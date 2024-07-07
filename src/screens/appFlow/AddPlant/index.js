import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import InputField from '../../../components/InputField';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily, fontSize} from '../../../services/utilities/Fonts';
import Button from '../../../components/Button';
import {Colors} from '../../../services/utilities/Colors';
import { appImages } from '../../../services/utilities/Assets';
import { AppStyles } from '../../../services/utilities/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from 'react-native-size-matters';
import Header from '../../../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../navigation/AuthProvider';

const AddPlant = ({navigation}) => {
  const {user} = useContext(AuthContext)
  const userid = user.uid;
  const userDocRef = firestore().collection('Devices').doc(userid);
  const plantDocRef = firestore().collection('Plants');
    const [items,setItems] = useState([])
    useEffect(() => {
      const fetchPlants = async () => {
        try {
          const plantsCollectionRef = firestore().collection('Plants');
          const querySnapshot = await plantsCollectionRef.get();
          const plants = [];
  
          querySnapshot.forEach((doc) => {
            plants.push({ id: doc.id, ...doc.data() });
          });
  
          console.log('Fetched plants:', plants);
          setItems(plants);
        } catch (error) {
          console.error('Error fetching plants from Firestore:', error);
          setItems([]);
        }
      };
  
      fetchPlants();
    }, []); // Empty dependency array to run only once
  const Add = async () => {
    const deviceData = {
      name: name,
      location: location,
      deviceId: deviceId,
      plant: status
    };
  
    try {
      const devicesSnapshot = await firestore().collection('Devices').get();
      
      let deviceExists = false;
      devicesSnapshot.forEach(doc => {
        const devices = doc.data().messages || [];
        if (devices.some(device => device.deviceId === deviceId)) {
          deviceExists = true;
        }
      });
  
      if (deviceExists) {
        console.log('Device ID already exists in Firestore');
        return; // Exit the function if the device ID exists
      }
  
      // If device ID does not exist, add the new device data
      await userDocRef.set({
        messages: firestore.FieldValue.arrayUnion(deviceData)
      }, { merge: true });
  
      console.log('Device added successfully');
      // Uncomment the following line if you want to navigate after successful addition
       navigation.navigate('HomeStack');
    } catch (error) {
      console.error('Error adding message to Firestore:', error);
    }
  };
  
  
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [deviceId, setDeviceId] = useState('')
  
  
  return (
    
    <LinearGradient
    colors={Colors.appGradientColors1}
      start={{ x: -1, y:-1  }}
      end={{ x: 0, y: 1 }}
      style={[
        AppStyles.linearGradient,
      ]}
    >
      <Header text={"Add Plant"} press={()=>navigation.navigate('Profile')} />
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
    <InputField lebal={'Plant Name'} onChangeText={setName} value={name} />
      <InputField lebal={'Location'} onChangeText={setLocation} value={location} />
      <View style={{marginTop:responsiveScreenHeight(2)}}>
              <Text style={AppStyles.field}>Plant</Text>
              <View >
                <DropDownPicker
                  items={items.map((item, index) => ({
                    label: item.name,
                    value: item.id,
                    
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
            <InputField lebal={'Device Seriel'} onChangeText={setDeviceId} value={deviceId} />
      <View
        style={[AppStyles.btnContainer, {marginTop: responsiveScreenHeight(10), marginBottom:10}]}>
        <Button text={'Add'} background={Colors.appBackground1} onPress={Add}/>
      </View>
      
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
   
  );
};

export default AddPlant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  
  forgot:{
    color:Colors.textColor4,
    marginTop:responsiveScreenHeight(1),
    fontFamily:fontFamily.Montserrat,
    fontSize:fontSize.fieldText,
    fontWeight:'700'
  }
  
});
