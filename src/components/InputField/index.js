import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
  } from 'react-native';
  import React, {useState} from 'react';
  import {fontSize} from '../../services/utilities/Fonts';
  import {
    responsiveHeight,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import {scale} from 'react-native-size-matters';
  import {appIcons} from '../../services/utilities/Assets';
  import {AppStyles} from '../../services/utilities/AppStyles';
import { Colors } from '../../services/utilities/Colors';
  
  const InputField = props => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const telephoneCheck = str => {
      const patt = /^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/;
      return patt.test(str);
    };
    const formatValue = value => {
      if (props.phone) {
        let cleaned = ('' + value).replace(/\D/g, '');
        let output = '';
    
        if (telephoneCheck(cleaned)) {
          if (cleaned.length === 10) {
            output += `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
            return output;
          }
        }
      } else {
        return value;
      }
    };
    const toggleSecureTextEntry = () => {
      setSecureTextEntry(prev => !prev);
    };
    const onBlurHandler = () => {
      setIsFocused(false);
      props.onBlur && props.onBlur(); 
    };
    
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{props.lebal}</Text>
        <View
          style={[
            styles.inputContainer,
          ]}>
          <TextInput
            style={AppStyles.input}
            placeholder={props.placeholder}
            onChangeText={props.onChangeText}
            value={formatValue(props.value)}
            keyboardType={props.type}
            secureTextEntry={secureTextEntry && props.secureTextEntry}
            onFocus={() => {
              setIsFocused(true);
              {props.onFocus && props.onFocus();} 
            }}
            maxLength={props.maxLength}
            onBlur={onBlurHandler}
            placeholderTextColor={Colors.placeholder}
            editable={props.edit}
          />
          {props.message  && !props.secureTextEntry && (
            <View style={styles.right}>
              <Image
                source={appIcons.cross}
                style={{width: scale(18), height: scale(18)}}
              />
            </View>
          )}
          {props.message === null && !props.secureTextEntry && (
            <View style={styles.right}>
              <Image
                source={appIcons.tickgreen}
                style={{width: scale(18), height: scale(18)}}
              />
            </View>
          )}
          {props.secureTextEntry && (
            <TouchableOpacity
              style={[styles.right, {borderLeftWidth: responsiveWidth(0.1)}]}
              onPress={toggleSecureTextEntry}>
              {secureTextEntry ? (
                <Image source={appIcons.eye} style={styles.passwordIcon} />
              ) : (
                <Image source={appIcons.eye1} style={styles.passwordIcon2} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {props.message && (
          <Text style={[styles.username]}>
          {props.message}
          </Text>
        )}
        {props.userName && (
          <Text style={styles.username}>
            Usernames must be between 3 and 25 characters.
          </Text>
        )}
      </View>
    );
  };
  
  export default InputField;
  
  const styles = StyleSheet.create({
    container: {
      marginTop: responsiveHeight(1.5),
    },
    label: {
      fontSize: fontSize.lebal,
      color:Colors.textColor1
    },
    right: {
      width: '10%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputContainer: {
      height: responsiveHeight(6.7),
      marginTop: responsiveHeight(1),
      backgroundColor: Colors.appBackground2,
      borderRadius: scale(10),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.7)",
    },
    passwordIcon: {
      width: scale(20),
      height: scale(20),
    },
    passwordIcon2: {
      width: scale(20),
      height: scale(15),
      backgroundColor: Colors.textColor1,
    },
    username: {
      color: Colors.textColor1,
      fontSize: fontSize.userName,
    },
  });
  