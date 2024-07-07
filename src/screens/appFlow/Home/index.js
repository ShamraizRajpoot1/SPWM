import { FlatList, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { AppStyles } from '../../../services/utilities/AppStyles'
import { Colors } from '../../../services/utilities/Colors'
import Header from '../../../components/Header'
import { responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions'
import { appIcons, appImages } from '../../../services/utilities/Assets'
import { scale } from 'react-native-size-matters'
import { fontFamily, fontSize } from '../../../services/utilities/Fonts'
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../navigation/AuthProvider'
import GetData from '../GetData'
const Home = ({ navigation }) => {
    const {user} = useContext(AuthContext)
    
    const [plants,setPlants] = useState([])
    const [caretakers, setCareTakers] = useState([])
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
            setCareTakers(careTakers);
          } else {
            console.log('No document found with the specified userId');
            setCareTakers([]);
          }
        }, error => {
          console.error('Error fetching careTakers from Firestore:', error);
          setCareTakers([]);
        });
    
        const devicesRef = firestore().collection('Devices').doc(userId);
    
        const unsubscribePlants = devicesRef.onSnapshot(docSnapshot => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data();
            const messages = userData.messages || [];
            console.log('Fetched messages:', messages);
            setPlants(messages);
          } else {
            console.log('No document found with the specified userId');
            setPlants([]);
          }
        }, error => {
          console.error('Error fetching messages from Firestore:', error);
          setPlants([]);
        });
    
        // Clean up the listeners when the component unmounts
        return () => {
          unsubscribeCareTakers();
          unsubscribePlants();
        };
      }, []);
      const Info = (id) => {
        navigation.navigate('PlantInfo', { id });
      };
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => Info(item.deviceId)} style={styles.plants}>
            <Image source={appImages.item1} style={styles.plantImage} />
        </TouchableOpacity>
    );
      const caretakerInfo = (id) => {
        navigation.navigate('CareTakerDetail', { id });
      };

    const renderItem1 = ({ item }) => (
        <TouchableOpacity onPress={()=>caretakerInfo(item.email)} style={styles.listItem}>
            <View style={styles.caretaker}>
                <Image source={item.image !== null ? item.source : appImages.user } style={styles.image} />
            </View>
<View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={[styles.location]} >{item.location}</Text>
            </View>
        </TouchableOpacity>
    );
    return (
        <>
        <GetData />
        <LinearGradient
            colors={Colors.appGradientColors1}
            start={{ x: -1, y: -1 }}
            end={{ x: 0, y: 1 }}
            style={[
                AppStyles.linearGradient,
            ]}
        >
            <Header text={"Home"} press={()=>navigation.navigate('Profile')}/>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
                <TouchableWithoutFeedback>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                        contentContainerStyle={[AppStyles.contentContainer]}
                        keyboardShouldPersistTaps="handled">
                        <View style={{ marginVertical: responsiveScreenHeight(3),width:responsiveScreenWidth(90) }}>
                            <View style={AppStyles.row}>
                                <Text style={styles.text1}>Plants</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Plants')}>
                                    <Text style={styles.text2}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                style={{ alignSelf: 'flex-start' }}
                                horizontal
                                data={plants}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.flatListContainer}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <View style={AppStyles.row}>
                            <Text style={styles.text1}>Care Takers</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('CareTakers')}>
                                <Text style={styles.text2}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container}>
                            <FlatList
                                data={caretakers}
                                renderItem={renderItem1}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.flatListContainer}
                                scrollEnabled={false}
                            />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </LinearGradient>
        </>
    )
}

export default Home

const styles = StyleSheet.create({
    plants: {
        width: responsiveWidth(25),
        height: responsiveWidth(25),
        backgroundColor: Colors.appBackground2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(3),
        borderRadius: scale(12)
    },
    plantImage: {
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        borderRadius:scale(16)
    },
    text1: {
        fontSize: fontSize.fieldText,
        color: Colors.textColor3,
        fontWeight: "400"
    },
    text2: {
        fontSize: fontSize.fieldText,
        color: Colors.textColor1,
        fontWeight: "400"
    },
    flatListContainer: {
        padding: responsiveScreenWidth(2),
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveScreenWidth(2),
        backgroundColor: Colors.appBackground5,
        borderRadius: scale(12)
    },
    image: {
        width: responsiveScreenWidth(20),
        height: responsiveScreenWidth(20),
        marginRight: responsiveScreenWidth(2),
    },
    image1: {
        width: responsiveScreenWidth(20),
        height: responsiveScreenWidth(20),
        marginRight: responsiveScreenWidth(2),
    },
    caretaker: {
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        backgroundColor: Colors.appBackground2,
        alignItems: 'center',
        justifyContent: 'center',
        margin: responsiveWidth(3),
        borderRadius: scale(12)
    },
    name: {
        fontSize: fontSize.h1,
        fontWeight: 'bold',
        fontFamily: fontFamily.Montserrat,
        color: Colors.textColor1
    },
    location: {
        fontSize: fontSize.lebal,
        fontWeight: '500',
        color: Colors.textColor1
    },
})