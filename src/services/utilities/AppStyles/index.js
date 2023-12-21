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
})