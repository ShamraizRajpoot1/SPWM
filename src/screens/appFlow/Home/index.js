import { FlatList, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { AppStyles } from '../../../services/utilities/AppStyles'
import { Colors } from '../../../services/utilities/Colors'
import Header from '../../../components/Header'
import { responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions'
import { appIcons, appImages } from '../../../services/utilities/Assets'
import { scale } from 'react-native-size-matters'
import { fontFamily, fontSize } from '../../../services/utilities/Fonts'

const Home = ({ navigation }) => {
    const imageList = [
        { id: '1', source: appImages.item1 },
        { id: '2', source: appImages.item2 },
        { id: '3', source: appImages.item2 },
        { id: '4', source: appImages.item2 },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.plants}>
            <Image source={item.source} style={styles.plantImage} />
        </TouchableOpacity>
    );
    const data = [
        { id: '1', name: 'Care Taker1', source: appImages.user },
        { id: '2', name: 'Care Taker2', source: appImages.user },
        { id: '3', name: 'Care Taker3', source: appImages.user },
        { id: '4', name: 'Care Taker4', source: appImages.user },
        // Add more data as needed
    ];

    const renderItem1 = ({ item }) => (
        <View style={styles.listItem}>
            <View style={styles.caretaker}>
                <Image source={item.source} style={styles.image} />
            </View>

            <Text style={styles.name}>{item.name}</Text>
        </View>
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
            <Header text={"Home"} />
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
                        <View style={{ marginVertical: responsiveScreenHeight(3) }}>
                            <View style={AppStyles.row}>
                                <Text style={styles.text1}>Plants</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Plants')}>
                                    <Text style={styles.text2}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                style={{ alignSelf: 'flex-start' }}
                                horizontal
                                data={imageList}
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
                                data={data}
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
        height: responsiveWidth(20)
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
})