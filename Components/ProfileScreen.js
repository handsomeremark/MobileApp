import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://10.10.8.207:5000/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ /* your request body */ }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUser(data); // Update the state with the fetched user data
        console.log('Profile data:', data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile(); // Call the correct function
  }, []);

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={require('./Images/Apple.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.profileLocation}>{user.address}</Text>
        <Text style={styles.profilePhone}>{user.phoneNumber}</Text>
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Icon name="shopping-cart" style={styles.icon} />
        </View>
        <Text style={styles.menuText}>Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Icon name="credit-card" style={styles.icon} />
        </View>
        <Text style={styles.menuText}>Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Icon name="cog" style={styles.icon} />
        </View>
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Icon name="info-circle" style={styles.icon} />
        </View>
        <Text style={styles.menuText}>Help</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileLocation: {
    fontSize: 14,
    color: 'gray',
  },
  profilePhone: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  icon: {
    fontSize: 20,
    color: '#4caf50',
  },
  menuText: {
    fontSize: 16,
  },
});

export default Profile;
