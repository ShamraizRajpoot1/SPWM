import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Alert
} from 'react-native';
import React, {useState} from 'react';
import {AppStyles} from '../../../services/utilities/AppStyles';
import {Colors} from '../../../services/utilities/Colors';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import {
  responsiveScreenHeight,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Button from '../../../components/Button';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

const Forgot = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMassage] = useState()
  const showCustomToast = () => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Email sent to your email address',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
      text1Style: { height: responsiveScreenHeight(20) , fontWeight: 'bold', fontSize: 16, width: 200, marginVertical: responsiveScreenHeight(2) }, 
      text2Style: { width: 200 },
    });
  };
  const back = () => {
    navigation.goBack();
  };
  const isButtonDisabled = buttonDisabled;
  const buttonColor = isButtonDisabled ? Colors.disabledButton : Colors.button1;
  const checkEmailExistence = () => {
    const usersRef = firestore().collection('Users');
    usersRef
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          setButtonDisabled(false);
          setMassage(null)
        } else {
          setButtonDisabled(true);
          setMassage('')
        }
      })
      .catch(error => {
        console.error('Error checking email existence: ', error);
      });
  };
  React.useEffect(() => {
    checkEmailExistence();
  }, [email]);
  const handleSendPasswordReset = async (email) => {
    try {
      const auth = firebase.auth();
      setIsLoading(true); 
      await auth.sendPasswordResetEmail(email);
      showCustomToast();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      Alert.alert('Error', 'There was an error sending the password reset email.');
    } finally {
      setIsLoading(false); 
    }
  };
  
  return (
    <>
      <Header Image={true} onPress={back} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
        <TouchableWithoutFeedback>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={[
              AppStyles.contentContainer,
              {backgroundColor: Colors.backgroud1},
            ]}
            keyboardShouldPersistTaps="handled">
            <View style={styles.text}>
              <Text style={AppStyles.loginText}>
                Enter the Email address used to {'\n'}create account
              </Text>
            </View>
            <View>
              <InputField
                lebal="Email"
                type="email-address"
                onChangeText={setEmail}
                value={email}
                message={message}
              />
            </View>

            <View
              style={[
                AppStyles.button,
                {marginTop: responsiveScreenHeight(8)},
              ]}>
              <Button
              onPress={() =>handleSendPasswordReset(email)}
                background={buttonColor}
                text="Update Password"
                disabled={isButtonDisabled}
                isLoading={isLoading}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  text: {
    marginLeft: responsiveWidth(10),
    marginTop: responsiveHeight(8),
    marginBottom: responsiveHeight(2),
  },
});
