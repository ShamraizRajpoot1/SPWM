import {Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import InputField from '../../../components/InputField';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontSize} from '../../../services/utilities/Fonts';
import Button from '../../../components/Button';
import {Colors} from '../../../services/utilities/Colors';
import { AppStyles } from '../../../services/utilities/AppStyles';
import { appImages } from '../../../services/utilities/Assets';
import LinearGradient from 'react-native-linear-gradient';

const SignUp = ({navigation}) => {
  const Login = () =>{
    navigation.navigate('Login')
     }
     const Signup =()=>{
      navigation.navigate('App')
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
    <Image source={appImages.logo3} style={AppStyles.logo} />
      <InputField lebal={'Email'} placeholder={"s@gmail.com"}  />
      <InputField lebal={'Password'} secureTextEntry={true} />
      <InputField lebal={'Confirm Password'} secureTextEntry={true} />
      <View style={AppStyles.btnContainer}>
        <Button text={'SignUp'} onPress={Signup}/>
      </View>
      <View
        style={[AppStyles.btnContainer, {marginTop: responsiveScreenHeight(12), marginBottom:10}]}>
        <Button text={'Login'} background={Colors.appBackground1} onPress={Login}/>
      </View>
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lebal: {
    alignSelf: 'center',
    marginTop: responsiveScreenHeight(15),
    fontSize: fontSize.plus,
    fontWeight: 'bold',
    color: '#000000',
  },
});
