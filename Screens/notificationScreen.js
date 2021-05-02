import * as React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";
import MyHeader from "../components/myHeader.js";
import firebase from "firebase";
import db from "../Config";

export default class NotificationScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.requestRef = null;
  }

  getNotifications = () => {
    db.collection("all_notifications")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((document) => {
          var notification = document.data();
          notification["doc_id"] = document.id;
          allNotifications.push(notification);
        });
        this.setState({ allDonations: allDonations });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={index}
      leftElement={<Icon name="item" type="font-awesome" color="#696969" />}
      title={item.item_name}
      titleStyle={{ color: "black", fontWeight: "bold" }}
      subtitle={item.message}
      bottomDivider
    />
  );

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="Notifications" />
        <View style={{ flex: 1 }}>
          {this.state.allNotifications.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of all Notifications</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allNotifications}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
