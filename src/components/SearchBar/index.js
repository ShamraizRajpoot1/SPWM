import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { AppStyles } from '../../services/utilities/AppStyles';
import { Colors } from '../../services/utilities/Colors';
import { appIcons } from '../../services/utilities/Assets';
import { responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import { scale } from 'react-native-size-matters';

const SearchBar = (props) => {
  const onClear = () => {
    if (props.onClearText) {
      props.onClearText();
    }
  };

  return (
    <View style={styles.search}>
      <Image source={appIcons.search} />
      <TextInput
        style={AppStyles.input}
        placeholder={props.placeholder}
        placeholderTextColor={Colors.placeholder}
        keyboardType="default"
        value={props.value}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
        returnKeyType="search"
      />
      {props.value && props.clear ? (
        <TouchableOpacity onPress={onClear}>
          <Image source={appIcons.clear} style={styles.clearIcon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  search: {
    backgroundColor:Colors.search,
    marginTop: responsiveScreenHeight(3),
    width: '100%',
    height: responsiveScreenHeight(4),
    borderWidth: scale(1),
    alignSelf: 'center',
    borderRadius: scale(6),
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '3.5%',
    marginBottom: responsiveScreenHeight(2),
    color: Colors.lebal,
    borderColor: Colors.border1,
    backgroundColor:Colors.appBackground2
  },
  clearIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});
