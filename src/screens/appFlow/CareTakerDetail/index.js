import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, { useState } from 'react';
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

const CareTakerDetail = ({navigation}) => {
    const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
    const items = [
        {label: 'Safroon Crocus, Pasrur', value: 'Safroon Crocus'},
        {label: 'Vanila Orchard, Daska', value: 'Vanila Orchard'},
        {label: 'Ginsang, Sialkot', value: 'Ginsang'},
       
      ];
  const [on, setOn] = useState(false);
  const Add = () =>{
 navigation.navigate('Home')
  }
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
    <View style={AppStyles.imageContainer}>
              <Image style={AppStyles.image} source={appIcons.user} />
            </View>
    <InputField lebal={'Email'} placeholder={"s@gmail.com"} edit={false}/>
    <InputField lebal={'Phone'} placeholder={"+923034518303"} edit={false}/>
    <InputField lebal={'Name'} placeholder={"Shamraiz"} edit={false}/>
    <View style={{marginTop:responsiveScreenHeight(2)}}>
              <Text style={AppStyles.field}>Plant Name</Text>
              <View >
                <DropDownPicker
                  items={items.map((item, index) => ({
                    label: item.label,
                    value: item.value,
                    key: index.toString(),
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
    <View style={AppStyles.btnContainer}>
        <Button text={'Update Care Taker'} onPress={()=>navigation.navigate('Home')} />
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
