import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import InputField from '../../../components/InputField';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily, fontSize} from '../../../services/utilities/Fonts';
import {Colors} from '../../../services/utilities/Colors';
import { appImages } from '../../../services/utilities/Assets';
import { AppStyles } from '../../../services/utilities/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Header';

const CareGuide = ({navigation}) => {
 
  return (
    
    <LinearGradient
    colors={Colors.appGradientColors1}
      start={{ x: -1, y:-1  }}
      end={{ x: 0, y: 1 }}
      style={[
        AppStyles.linearGradient,
      ]}
    >
        <Header back text={"Saffron Crocus "} onPress={()=>navigation.goBack()} press={()=>navigation.navigate('Profile')} />
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
    <Image source={appImages.item3} style={[AppStyles.logo,{marginTop:responsiveScreenHeight(5)}]} />
        
        <Text style={styles.forgot}><Text style={styles.heading}>Temprature Need:</Text> 17°C to 30°C</Text>
     
    
        
        <Text style={styles.forgot}><Text style={styles.heading}>Humidity Need:</Text> 40% to 60%</Text>
      
      
        
        <Text style={styles.forgot} numberOfLines={5}><Text style={styles.heading}>Moisture Need:</Text> requires well-draining, sandy soil with good drainage.</Text>
      
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
   
  );
};

export default CareGuide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row:{
    marginVertical:responsiveScreenHeight(1),
    flexDirection:'row',
    alignItems:"center",
    justifyContent:'flex-start',
    width:'100%'
  },
  heading:{
    fontSize:fontSize.h1,
    color:Colors.textColor1,
    fontWeight:'bold'
},
  
  forgot:{
    color:Colors.textColor4,
    fontFamily:fontFamily.Montserrat,
    fontSize:fontSize.fieldText,
    fontWeight:'700',
    marginVertical:responsiveScreenHeight(2)
  }
  
});
