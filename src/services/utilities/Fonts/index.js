import { responsiveFontSize } from "react-native-responsive-dimensions"

const fontFamily = {
    Montserrat: 'Montserrat-VariableFont_wght',
    
  }
  const fontSize = {
    h1 : responsiveFontSize(2.2),
    h2 : responsiveFontSize(2.5),
    h3 : responsiveFontSize(2.1),
    h4 : responsiveFontSize(2.6),
    plus: responsiveFontSize(4),
    lebal: responsiveFontSize(2),
    fieldText : responsiveFontSize(1.8),
    usernameText : responsiveFontSize(1.6),
    pDetail : responsiveFontSize(1.7),
    userName:responsiveFontSize(1.5),
    productName: responsiveFontSize(1.2),
    userNameComunity:responsiveFontSize(1.4)
  
  }

  export  {fontSize, fontFamily}