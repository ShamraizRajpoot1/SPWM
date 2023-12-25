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
  import React, {useState} from 'react';
  
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
  
  const Plants = ({navigation}) => {
    const initialData = [
      {
        id: '1',
        plantImage: appImages.item1,
        name: 'Safron Crocus',
        location: 'Pasrur',
      },
      {
        id: '2',
        plantImage: appImages.item2,
        name: 'Venila Orchard',
        location: 'Sialkot',
      },
      {
        id: '3',
        plantImage: appImages.item1,
        name: 'Safron Crocus',
        location: 'Pasrur',
      },
      {
        id: '4',
        plantImage: appImages.item2,
        name: 'Venila Orchard',
        location: 'Sialkot',
      },
      {
        id: '5',
        plantImage: appImages.item1,
        name: 'Safron Crocus',
        location: 'Pasrur',
      },
      {
        id: '6',
        plantImage: appImages.item2,
        name: 'Venila Orchard',
        location: 'Sialkot',
      },
    ];
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
  
    const Info = () =>{
      navigation.navigate('PlantInfo');
    }
    const renderItem = ({item}) => (
      <TouchableOpacity style={styles.itemContainer} onPress={Info}>
        <View style={styles.plantrow}>
          <Image source={item.plantImage} style={styles.image} />
          <View style={styles.nameContainer}>
            <Text style={[styles.name, {fontWeight: 'bold'}]}>{item.name}</Text>
            <Text style={styles.name}>{item.location}</Text>
          </View>
        </View>
        <Image source={appIcons.dot} style={styles.iconright} />
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
        <Header back text={"Plants"} onPress={()=>navigation.goBack()} press={()=>navigation.navigate('Profile')} />
       
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
  