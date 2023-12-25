import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, { useState } from 'react';
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

const AddPlant = ({navigation}) => {
  const Add = () =>{
 navigation.navigate('HomeStack')
  }
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const items = [
    {label: 'Safroon Crocus', value: 'Safroon Crocus'},
    {label: 'Vanila Orchard', value: 'Vanila Orchard'},
    {label: 'Ginsang', value: 'Ginsang'},
   
  ];
  
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
    <InputField lebal={'Plant Name'} />
      <InputField lebal={'Location'} />
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
            <InputField lebal={'Device Seriel'} />
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
