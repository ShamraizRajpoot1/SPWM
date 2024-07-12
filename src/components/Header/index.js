import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { scale } from 'react-native-size-matters';
import { appIcons, appImages } from '../../services/utilities/Assets';
import { Colors } from '../../services/utilities/Colors';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
const Header = (props) => {
  const [userData, setUserData] = useState([])
  const [image, setImage] = useState(null)
  const {user} = useContext(AuthContext)
  useEffect(() => {
    if (!user) {
      return;
    }
  
    const userId = user.uid;
    const userRef = firestore().collection('Users').doc(userId);
  
    const unsubscribe = userRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        setUserData(snapshot.data());
        setImage(snapshot.data().profileImage)
        console.log('User data updated:', snapshot.data());
      } else {
        console.log('User document does not exist');
      }
    });
  
    return () => unsubscribe(); // Cleanup function to unsubscribe from snapshot listener
  
  }, []);

  return (
    
      <View style={styles.container}>
       
       
        <TouchableOpacity style= {styles.back} onPress={props.onPress}>
        {props.back &&
        <Image source={appIcons.back} style={styles.logo}/>}
        </TouchableOpacity>
        <Text style={styles.text}>{props.text}</Text>
        {props.profile ? <View style={styles.user}></View> :
        <TouchableOpacity style={styles.user} onPress={props.press}>
          {image ? (
                <Image
                style={[styles.image, {borderRadius: scale(100)}]}
                  source={image}
                />
              ) : (
                <Image style={styles.logo} source={appIcons.user} />
              )}
        </TouchableOpacity>
}
      </View>
   
  );
};

export default Header;

const styles = StyleSheet.create({
  
  container: {
    height: responsiveScreenHeight(6),
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    flexDirection:'row'
  },
  text: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    color: Colors.textColor1 ,
    width: responsiveScreenWidth(70),
     alignContent:'center',
     textAlign:'center'
  },
  logo:{
    width:scale(30),
    height:scale(30),
    tintColor:'#000000',
  },
  image:{
    width:scale(30),
    height:scale(30),
  },
  back:{
    width:responsiveScreenWidth(15),
    alignItems:'center'
  },
  user:{
    width:responsiveScreenWidth(15)
  }
});
