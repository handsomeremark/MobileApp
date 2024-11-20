// import React, { useState } from 'react';
// import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

// const GetStarted = ({ navigation }) => {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const images = [
//         require('./Images/Delivery.jpg'),
//         require('./Images/Organic.jpg'),
//         require('./Images/FreshFarm.png'),
//     ];

//     const handleNext = () => {
//         if (currentImageIndex < images.length - 1) {
//             setCurrentImageIndex(currentImageIndex + 1);
//         } else {
//             navigation.navigate('Login');
//         }
//     };

//     const handleSkip = () => {
//         console.log("skip click");
//     };

//     return (
//         <View style={styles.container}>
//             <Image
//                 source={images[currentImageIndex]}
//                 style={styles.backgroundImage}
//             />
//             <Text style={styles.text}>Welcome to GreenCartPH</Text>
//             <Text style={styles.subtext}>Your go-to app for fresh fruits and veggies</Text>
//             <Text style={styles.additionaltext}>Start shopping now and enjoy healthy living!</Text>
//             <View style={styles.indicatorContainer}>
//                 {images.map((_, index) => (
//                     <View
//                         key={index}
//                         style={[
//                             styles.indicator,
//                             index === currentImageIndex ? styles.activeIndicator : null,
//                         ]}
//                     />
//                 ))}
//             </View>
//             {currentImageIndex === images.length - 1 ? (
//                 <TouchableOpacity style={styles.button} onPress={handleNext}>
//                     <Text style={styles.buttonText}>Get Started</Text>
//                 </TouchableOpacity>
//             ) : (
//                 <>
//                     <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//                         <Text style={styles.buttonText}>Next</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
//                         <Text style={styles.buttonSkip}>Skip</Text>
//                     </TouchableOpacity>
//                 </>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#FFFFFF',
//     },
//     backgroundImage: {
//         width: '100%',
//         height: '40%',
//         position: 'absolute',
//         top: 70,
//         borderRadius: 5,
//     },
//     text: {
//         fontWeight: 'bold',
//         fontSize: 27,
//         marginBottom: 20,
//         top: '10%',
//     },
//     subtext: {
//         fontSize: 14,
//         marginBottom: 20,
//         top: '10%',
//     },
//     additionaltext: {
//         fontSize: 13,
//         marginBottom: 10,
//         top: '8%',
//     },
//     indicatorContainer: {
//         flexDirection: 'row',
//         marginBottom: 10,
//     },
//     indicator: {
//         width: 15,
//         height: 15,
//         borderRadius: 10,
//         backgroundColor: '#ccc',
//         marginHorizontal: 4,
//         top: 100,
//     },
//     activeIndicator: {
//         backgroundColor: '#336841',
//     },
//     nextButton: {
//         position: 'absolute',
//         backgroundColor: '#336841',
//         paddingVertical: 10,
//         paddingHorizontal: 100,
//         borderRadius: 5,
//         bottom: 140,
//     },
//     button: {
//         position: 'absolute',
//         backgroundColor: '#336841',
//         paddingVertical: 10,
//         paddingHorizontal: 50,
//         borderRadius: 5,
//         bottom: 130,
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 18,
//         textAlign: 'center',
//     },
//     buttonSkip: {
//         top: 190,
//         textDecorationLine: 'underline',
//         width: '50',
//         fontSize: 18,
//     },
// });

// export default GetStarted;
