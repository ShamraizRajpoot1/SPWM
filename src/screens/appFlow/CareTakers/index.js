import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {appIcons, appImages} from '../../../services/utilities/Assets';
import {scale} from 'react-native-size-matters';
import SearchBar from '../../../components/SearchBar';
import {fontSize} from '../../../services/utilities/Fonts';
import Header from '../../../components/Header';
import { Colors } from '../../../services/utilities/Colors';
import { AppStyles } from '../../../services/utilities/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../../navigation/AuthProvider';

import firestore from '@react-native-firebase/firestore';
const CareTakers = ({navigation}) => {
  const {user} = useContext(AuthContext)
  const [initialData, setInitialData] = useState([])

  useEffect(() => {
    if (!user) {
      return;
    }

    const userId = user.uid;
    const careTakersRef = firestore().collection('careTakers').doc(userId);

    const unsubscribeCareTakers = careTakersRef.onSnapshot(docSnapshot => {
      if (docSnapshot.exists) {
        const userData = docSnapshot.data();
        const careTakers = userData.careTakers || [];
        console.log('Fetched careTakers:', careTakers);
        setInitialData(careTakers);
        setFilteredData(careTakers)
      } else {
        console.log('No document found with the specified userId');
        setInitialData([]);
      }
    }, error => {
      console.error('Error fetching careTakers from Firestore:', error);
      setInitialData([]);
    });

    

    // Clean up the listeners when the component unmounts
    return () => {
      unsubscribeCareTakers();
    };
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);

  const handleSearch = query => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredData(initialData);
    } else {
      const filtered = initialData.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const caretakerInfo = (id) => {
    navigation.navigate('CareTakerDetail', { id });
  };
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.itemContainer} onPress={()=>caretakerInfo(item.email)}>
      <View style={styles.plantrow}>
        <Image source={item.image ? item.image : appImages.user} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={[styles.name, {fontWeight: 'bold'}]}>{item.name}</Text>
          <Text style={styles.name}>{item.location}</Text>
        </View>
      </View>
      
    </TouchableOpacity>
  );
 
  return (
   
   <LinearGradient
          colors={Colors.appGradientColors1}
          start={{ x: -1, y: -1 }}
          end={{ x: 0, y: 1 }}
          style={[
              AppStyles.linearGradient,
          ]}
      >
      <Header back text={"Care Takers"} onPress={()=>navigation.goBack()} press={()=>navigation.navigate('Profile')}/>
     
      <View >
        <SearchBar onChangeText={handleSearch} value={searchQuery} placeholder={"search plant"} />
      </View>
      

            <View style={styles.listContainer}>
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                scrollEnabled={false} 
              />
            </View>
         
      </LinearGradient>
      
  );
};

export default CareTakers;

const styles = StyleSheet.create({
  head: {
    paddingVertical: responsiveScreenHeight(2),
    height: responsiveScreenHeight(7),
    flexDirection: 'row',
    width: responsiveScreenWidth(90),
    justifyContent: 'space-between',
    marginHorizontal: responsiveScreenWidth(5),
  },
  icon: {
    width: scale(28),
    height: scale(28),
  },
  row2: {
    flexDirection: 'row',
    width: responsiveScreenWidth(20),
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsiveScreenWidth(3),
    borderBottomWidth: scale(1),
    borderBottomColor: '#ddd',
  },
  image: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(6),
  },
  name: {
    fontSize: fontSize.lebal,
    color: Colors.textColor1,
  },
  iconright: {
    width: scale(10),
    height: scale(15),
  },
  plantrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: responsiveScreenWidth(5),
  },
  listContainer: {
      width:'90%',
    borderWidth: responsiveScreenWidth(0.1),
    borderRadius: scale(10),
    borderColor: 'black',
    paddingBottom: responsiveScreenHeight(8),
  },
});
