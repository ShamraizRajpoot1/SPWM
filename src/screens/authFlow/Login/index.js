import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, { useContext, useState } from 'react';
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
import { AuthContext } from '../../../navigation/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const { login, user } = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const SignUp = () =>{
 navigation.navigate('SignUp')
  }
  const Login = () => {
    // setLoading(true);
    login(email, password)
      .then((user) => {
        console.log('User:', user);
        if (user) {
          // Returning a promise here to ensure proper chaining
          return AsyncStorage.setItem('Token', user.uid)
            .then(() => {
              console.log('Token set successfully');
              // Navigate to the 'App' screen after setting the token
              navigation.navigate('App');
            });
        } else {
          // Handle the case where user is not available
          Alert.alert('Login Error');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      })
      .finally(() => {
        console.log('Login process completed');
        // setLoading(false);
      });
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
      <Image source={appImages.logo3} style={[AppStyles.logo,{marginTop:responsiveScreenHeight(5)}]} />
      <InputField lebal={'Email'} placeholder={"s@gmail.com"} value={email} onChangeText={setEmail} />
      <InputField lebal={'Password'} secureTextEntry={true} value={password} onChangeText={setPassword} />
      <TouchableOpacity>
      <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={AppStyles.btnContainer}>
        <Button text={'Login'} onPress={Login} />
      </View>
      <View
        style={[AppStyles.btnContainer, {marginTop: responsiveScreenHeight(10), marginBottom:10}]}>
        <Button text={'SignUp'} background={Colors.appBackground1} onPress={SignUp}/>
      </View>
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
   
  );
};

export default Login;

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
