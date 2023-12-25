import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { fontFamily, fontSize } from "../Fonts";
import { scale } from "react-native-size-matters";
import { Colors } from "../Colors";

export const AppStyles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  row:{
    marginHorizontal:responsiveScreenWidth(1),
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom: responsiveHeight(1)
  },
    input: {
        paddingLeft:responsiveScreenWidth(2),
        height: '100%',
        width: '80%',
        padding: 0,
        fontSize: fontSize.fieldText,
        borderRadius: scale(6),
        color: Colors.textColor1,
        fontFamily:fontFamily.MontserratRegular,
      },
      linearGradient: {
        flex: 1,
        paddingHorizontal: responsiveScreenWidth(5),
        borderTopRightRadius: scale(30),
        borderBottomRightRadius: scale(30),
        alignItems:'center',
        alignContent:'center'
      },
      logo:{
        width:scale(200),
        height:scale(200),
        alignSelf:'center'
      },
      btnContainer: {
        marginTop: responsiveScreenHeight(5),
        alignSelf:'center'
      },
      field: {
        fontSize: fontSize.lebal,
        color:Colors.lebal
      },
      dcontainer: {
    
        height: responsiveScreenHeight(7),
        borderRadius: scale(10),
        width: responsiveScreenWidth(80),
        marginTop: responsiveScreenHeight(1),
      },
      Dropdown: {
        backgroundColor: Colors.appBackground2,
        borderRadius: scale(10),
        width: responsiveScreenWidth(80),
        height:responsiveScreenHeight(6)
      },
      dropDownStyle: {
        backgroundColor: Colors.fieldBackground,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        width: responsiveScreenWidth(90),
      },
      imageContainer: {
        marginVertical: responsiveHeight(1),
        alignItems: 'center',
        alignSelf:'center',
        justifyContent: 'center',
        width: '100%',
      },
      image: {
        height: responsiveScreenWidth(30),
        width: responsiveScreenWidth(30),
        borderRadius: scale(100),
      },
})