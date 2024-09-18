import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BottomNavigationBar from './BottomNavigationBar';

const Notification = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Delivery');

    const tabs = ['Delivery', 'News & Update'];

    const renderTab = (tab) => {
        return (
            <TouchableOpacity
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
            >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
        );
    };

    const renderNotification = (title, date, status, items) => {
        return (
            <View style={styles.notification}>
                <View style={styles.circle} />
                <View style={styles.info}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.date}>{date}</Text>
                    <Text style={styles.status}>{status} • {items} items</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => renderTab(tab))}
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'Delivery' && (
                    <>
                        <Text style={styles.sectionHeader}>Current</Text>
                        {renderNotification('Apple', 'On the way', '', 2)}
                        <Text style={styles.sectionHeader}>April 2024</Text>
                        {renderNotification('Apple', 'Delivered', '', 3)}
                        {renderNotification('Apple', 'Delivered', '', 3)}
                        {renderNotification('Apple', 'Delivered', '', 3)}
                        {renderNotification('Apple', 'Delivered', '', 3)}
                    </>
                )}

                {activeTab === 'News & Update' && (
                    <>
                        <Text style={styles.sectionNewsHeader}>April 2024</Text>

                        {/* Promotions and Updates */}
                        <View style={styles.notification}>
                            <View style={styles.info}>
                                <Text style={styles.title}>Promotion</Text>
                                <Text style={styles.Newsdate}>April 21 • 6:00</Text>
                                <Text style={styles.status}>
                                    Lorem ipsum dolor sit amet. Est voluptas sunt est nulla ipsum eum vitae cupiditate. Ut aliquam doloribus ut nostrum facilis sed Quis enim ut cumque cupiditate.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.notification}>
                            <View style={styles.info}>
                                <Text style={styles.title}>Promotion</Text>
                                <Text style={styles.Newsdate}>April 21 • 6:00</Text>
                                <Text style={styles.status}>
                                    Lorem ipsum dolor sit amet. Est voluptas sunt est nulla ipsum eum vitae cupiditate. Ut aliquam doloribus ut nostrum facilis sed Quis enim ut cumque cupiditate.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.notification}>
                            <View style={styles.info}>
                                <Text style={styles.title}>Promotion</Text>
                                <Text style={styles.Newsdate}>April 21 • 6:00</Text>
                                <Text style={styles.status}>
                                    Lorem ipsum dolor sit amet. Est voluptas sunt est nulla ipsum eum vitae cupiditate. Ut aliquam doloribus ut nostrum facilis sed Quis enim ut cumque cupiditate.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.notification}>
                            <View style={styles.info}>
                                <Text style={styles.titleUpdate}>Update</Text>
                                <Text style={styles.Newsdate}>April 21 • 6:00</Text>
                                <Text style={styles.status}>
                                    Lorem ipsum dolor sit amet. Est voluptas sunt est nulla ipsum eum vitae cupiditate. Ut aliquam doloribus ut nostrum facilis sed Quis enim ut cumque cupiditate.
                                </Text>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            <BottomNavigationBar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 1,
    },
    tab: {
        width: '40%',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    activeTab: {
        backgroundColor: '#336841',
        borderColor: '#00b050',
    },
    tabText: {
        fontSize: 16,
        color: '#333',
    },
    activeTabText: {
        color: '#fff',
    },
    content: {
        padding: 15,
        paddingBottom: 100, 
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sectionNewsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    titleUpdate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
    },
    date: {
        fontSize: 14,
        color: '#336841',
        marginBottom: 4,
    },
    Newsdate: {
        fontSize: 14,
        color: '#666',
        alignSelf: 'flex-end',
        bottom: 22,
    },
    status: {
        fontSize: 14,
        color: '#333',
    },
});

export default Notification;
