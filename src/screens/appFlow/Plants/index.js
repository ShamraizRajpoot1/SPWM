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
  import database from '@react-native-firebase/database';

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
const Plants = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const userid = user.uid;
  const userDocRef = firestore().collection('Devices').doc(userid);

  const [initialData, setInitialData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);

  useEffect(() => {
    const fetchMessages = async () => {
      if (user) {
        const userDocRef = firestore().collection('Devices').doc(user.uid);
        try {
          const docSnapshot = await userDocRef.get();

          if (docSnapshot.exists) {
            const userData = docSnapshot.data();
            const messages = userData.messages || [];

            console.log('2 Fetched messages:', messages);
            setInitialData(messages);
            setFilteredData(messages);
          } else {
            console.log('No document found with the specified userid');
            setInitialData([]);
          }
        } catch (error) {
          console.error('Error fetching messages from Firestore:', error);
          setInitialData([]);
        }
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const updatedData = await Promise.all(
        initialData.map(async (item) => {
          const temperatureRef = database().ref(`HouseInfo/${item.deviceId}/temperature`);
          const humidityRef = database().ref(`HouseInfo/${item.deviceId}/humidity`);
          const moistureRef = database().ref(`HouseInfo/${item.deviceId}/moisture`);

          const temperatureSnapshot = await temperatureRef.once('value');
          const humiditySnapshot = await humidityRef.once('value');
          const moistureSnapshot = await moistureRef.once('value');

          const temperature = temperatureSnapshot.val();
          const humidity = humiditySnapshot.val();
          const moisture = moistureSnapshot.val();

          let plantData = {};
          try {
            const plantDoc = await firestore().collection('Plants').doc(item.plant).get();
            if (plantDoc.exists) {
              plantData = plantDoc.data();
            }
          } catch (error) {
            console.error(`Error fetching plant data for plant ID ${item.plant}:`, error);
          }

          let wasOptimal = true;

          const isOptimal = temperature >= 20 && temperature <= 40 && humidity >= 20 && humidity <= plantData.maxHumi;
          return {
            ...item,
            temperature,
            humidity,
            moisture,
            isOptimal
          };
        })
      );
      setFilteredData(updatedData);
    };

    fetchData();
  }, [initialData]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredData(initialData);
    } else {
      const filtered = initialData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const Info = (id) => {
    navigation.navigate('PlantInfo', { id });
  };

  const renderItem = ({ item }) =>{
    const isOptimal = item.temperature >= 20 && item.temperature <= 50 && 
    item.humidity >= 10 && item.humidity <= 100 &&
    item.moisture >= 2000 && item.moisture <= 3000;
    

    return(
    
    <TouchableOpacity style={styles.itemContainer} onPress={() => Info(item.deviceId)}>
      <View style={styles.plantrow}>
        <Image source={appImages.item1} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { fontWeight: 'bold' }]}>{item.name}</Text>
          <Text style={styles.name}>{item.location}</Text>
        </View>
      </View>
      <Image
        source={appIcons.dot}
        style={[
          styles.iconright,
          { tintColor: item.isOptimal ? 'green' : 'red' }
        ]}
      />
    </TouchableOpacity>
  )};

  return (
    <LinearGradient
      colors={Colors.appGradientColors1}
      start={{ x: -1, y: -1 }}
      end={{ x: 0, y: 1 }}
      style={[AppStyles.linearGradient]}
    >
      <Header back text={"Plants"} onPress={() => navigation.goBack()} press={() => navigation.navigate('Profile')} />

      <View>
        <SearchBar onChangeText={handleSearch} value={searchQuery} placeholder={"search caretaker"} />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.deviceId}
          scrollEnabled={false}
        />
      </View>
    </LinearGradient>
  );
};

export default Plants;

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
    borderRadius: scale(12),
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
    width: '90%',
    borderWidth: responsiveScreenWidth(0.1),
    borderRadius: scale(10),
    borderColor: 'black',
    paddingBottom: responsiveScreenHeight(8),
  },
});
