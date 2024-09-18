import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const SetUpLocation = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const navigation = useNavigation();

    const cebuRegion = {
        latitude: 10.3157,
        longitude: 123.8854,
        latitudeDelta: 0.6,
        longitudeDelta: 0.6,
    };

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const handleConfirmPress = () => {
        if (selectedLocation) {
            navigation.navigate('Home', { selectedLocation });
        } else {
            alert('No location selected.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <MaterialIcons name="arrow-back" size={24} color="black" style={styles.backIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a location"
                    placeholderTextColor="#999"
                />
            </View>
            <MapView
                style={styles.map}
                initialRegion={cebuRegion}
                onPress={handleMapPress}
            >
                {selectedLocation && (
                    <Marker coordinate={selectedLocation} />
                )}
            </MapView>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleConfirmPress}>
                <Text style={styles.buttonText}>Confirm Location</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        top: 50,
    },
    backIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#D9D9D9',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    map: {
        width: '95%',
        height: 660,
        alignSelf: 'center',
        top: 60,
    },
    buttonContainer: {
        backgroundColor: '#336841',
        width: '90%',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SetUpLocation;
