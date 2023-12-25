import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { appIcons } from '../../../services/utilities/Assets';
import { Colors } from '../../../services/utilities/Colors';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import HomeStack from '../HomeStack';
import AddPlant from '../../../screens/appFlow/AddPlant';
import CareTaker from '../../../screens/appFlow/CareTakers';
import Setting from '../../../screens/appFlow/Settings';
import { scale } from 'react-native-size-matters';
import Library from '../../../screens/appFlow/Library';
import LibraryStack from '../LibraryStack';
import SettingStack from '../SettingStack';

const Bottom = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Bottom.Navigator
    screenOptions={{
      tabBarStyle: [
        {
        height: responsiveScreenHeight(7),
          display: 'flex',
          backgroundColor: Colors.appBackground2
        },
        null,
      ],
      tabBarLabelStyle: {
        display: 'none',
      },
      tabBarItemStyle: {
        marginVertical: responsiveScreenWidth(2),
        marginHorizontal:responsiveScreenWidth(6),
        borderRadius:scale(10)
      },
      tabBarActiveBackgroundColor: Colors.appBackground5,
    }}
  >
      <Bottom.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Image
              source={appIcons.home}
              style={styles.icon}
            />
          ),
        }}
      />

      <Bottom.Screen
        name="AddPlant"
        component={AddPlant}
        options={{
          headerShown: false,
          tabBarLabel: 'AddPlant',
          tabBarIcon: ({color, size}) => (
            <Image
              source={appIcons.bottomPlus}
              style={styles.icon}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="LibraryStack"
        component={LibraryStack}
        options={{
          headerShown: false,
          tabBarLabel: 'LibraryStack',
          tabBarIcon: ({color, size}) => (
            <Image
              source={appIcons.menu}
              style={[styles.icon,{width:responsiveScreenWidth(6)}]}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="SettingStack"
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Setting',
          tabBarIcon: ({color, size}) => (
            <Image
              source={appIcons.setting}
              style={[styles.icon,{width:responsiveScreenWidth(6)}]}
            />
          ),
        }}
      />
    </Bottom.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
icon:{
    width: responsiveScreenWidth(7),
    height: responsiveScreenWidth(6)
}
})
