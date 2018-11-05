/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  NativeModules, 
  NativeEventEmitter,
  AsyncStorage,
  Alert
} from 'react-native';
import firebase from 'react-native-firebase';
import { Notification } from 'react-native-firebase';

// take native GeofenceModule from ios
const GeofenceNative = NativeModules.GeofenceModule

// instantiate the event emitter
const Events = new NativeEventEmitter(NativeModules.GeofenceModule)


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const latitude = 12.930996
const longitude = 77.623831
const radius = 100
const id = "Walkin";

const dummyLocationList = [
  {
      lat: 12.930844,
      lng: 77.623794,
      radius: 100, // in meters
      id: "FirstWalkin"
  },
  {
      lat: 12.9313507,
      lng: 77.6224066,
      radius: 100, // in meters
      id: "Kormangala BDA Complex"
  },
  {
      lat: 12.9306733,
      lng: 77.6230345,
      radius: 100, // in meters
      id: "Sagar",
  },
  {
      lat: 12.930371,
      lng: 77.622847,
      radius: 100, // in meters
      id: "CCD BDA Complex",
  }
]

export default class App extends Component  {
  constructor(props){
    super(props);
    this.state = {
      eventInsideArray: [],
      eventOutsideArray: []
    }
  }
  // define all the geocenter location

  componentDidMount(){
      this.checkPermission();
      this.createNotificationListeners();
      GeofenceNative.setGeofenceValues(dummyLocationList, (success, error) => { 
        console.log("err", error);
      });
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }
  
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  
    //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken', value);
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  
    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
  
  
  render() {
    Events.addListener(
      "onEnter",
      res => {
        console.log("On Enter event", res)
        const val = "Inside the " + res["id"]
        this.showAlert("OnEnter", val);
        const newVal = [];
        newVal.push(val);
        this.setState({ eventInsideArray: newVal});
      }
    )
    
    Events.addListener(
      "onExit",
      res => {
        console.log("On Exit event", res)
        const val = "Outside the " + res["id"]
        this.showAlert("OnExit", val);
        const newVal = [];
        newVal.push(val);
        this.setState({ eventOutsideArray: newVal})
      }
    )
    console.log(this.state.eventArray);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>{this.state.eventInsideArray}</Text>
        <Text style={styles.instructions}>{this.state.eventOutsideArray}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
