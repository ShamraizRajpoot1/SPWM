import {Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import React, { useContext, useState } from 'react';
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
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../../navigation/AuthProvider';

const SignUp = ({navigation}) => {
  const {register} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const Login = () =>{
    navigation.navigate('Login')
     }
     const showCustomToast = () => {
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'SignUp Successfull',
        visibilityTime: 6000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        text1Style: {
          height: responsiveScreenHeight(20),
          fontWeight: 'bold',
          fontSize: fontSize.h3,
          width: 200,
          marginVertical: responsiveScreenHeight(2),
          color:Colors.textColor1
        },
        text2Style: {width: 200},
      });
    };
    const showCustom = () => {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Please check your email and password fields',
        visibilityTime: 6000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        text1Style: { height: responsiveScreenHeight(20) , fontWeight: 'bold', fontSize: fontSize.h3, width: 200, marginVertical: responsiveScreenHeight(2), color:Colors.textColor1 }, 
        text2Style: { width: 200 },
      });
    };
     const isValidEmail = email => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return emailRegex.test(email);
    };
     const Signup = () => {
      try {
        setIsLoading(true);
  
        if (!isValidEmail(email)) {
          showCustom()
          return;
        }
        if (password !== confirmPassword) {
          showCustom()
          return;
        }
  
        register(email, password)
          .then(async user => {
            const userCredential = await auth().signInWithEmailAndPassword(
              email,
              password,
            );
            const userId = userCredential.user.uid;

            if (user) {
              firestore()
                .collection('Users')
                .doc(userId)
                .set({
                  userId: userId,
                  email: email,
                  name: '',
                  phone: '',
                  location: '',
                  profileImage: '',
                })
                .then(async () => {
                  await AsyncStorage.setItem('Token', userId);
                  setIsLoading(false);
                  showCustomToast();
                  navigation.navigate('App');
                })
                .catch(error => {
                  setIsLoading(false);
                });
            } else {
              setIsLoading(false);
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.error(error);
          });
      } catch (error) {
        setIsLoading(false);
        Toast.show(error.message, Toast.LONG);
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
      <InputField lebal={'Email'} placeholder={"s@gmail.com"} value={email} onChangeText={setEmail} />
      <InputField lebal={'Password'} secureTextEntry={true} value={password} onChangeText={setPassword} />
      <InputField lebal={'Confirm Password'} secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword} />
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
