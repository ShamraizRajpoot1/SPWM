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
import LinearGradient from 'react-native-linear-gradient';
import { fontSize } from '../../../services/utilities/Fonts';

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
      text1Style: { color:Colors.textColor1, fontWeight: 'bold', fontSize:fontSize.fieldText }, 
      text2Style: { width: 200 },
    });
  };
  const back = () => {
    navigation.goBack();
  };
  const isButtonDisabled = buttonDisabled;
  const buttonColor = isButtonDisabled ? Colors.appBackground6 : Colors.button1;
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
    <LinearGradient
    colors={Colors.appGradientColors1}
      start={{ x: -1, y:-1  }}
      end={{ x: 0, y: 1 }}
      style={[
        AppStyles.linearGradient,
      ]}
    >
      <Header back text={"Forgot Password"} profile onPress={back} />
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
               // message={message}
              />
            </View>

            <View
              style={[
                AppStyles.btnContainer,
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
      </LinearGradient>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  text: {
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(8),
    marginBottom: responsiveHeight(2),
  },
});
