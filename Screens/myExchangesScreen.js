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

export default class MyExchangesScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allExchanges: [],
      userName: "",
    };
    this.requestRef = null;
  }

  getAllExchanges = () => {
    db.collection("all_exchanges")
      .where("donor_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allExchanges = [];

        snapshot.docs.map((document) => {
          var exchange = document.data();
          exchange["doc_id"] = document.id;
          allExchanges.push(exchange);
        });
        this.setState({ allExchanges: allExchanges });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.item_name}
      subtitle={
        "Requested By : " +
        item.requested_by +
        "\nStatus : " +
        item.request_status
      }
      leftElement={<Icon name="Item" type="font-awesome" color="#696969" />}
      titleStyle={{ color: "black", fontWeight: "bold" }}
      rightElement={
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                item.request_status === "item Sent" ? "green" : "#ff5722",
            },
          ]}
          onPress={() => {
            this.sendItem(item);
          }}
        >
          <Text style={{ color: "#ffff" }}>
            {item.request_status === "Item Sent" ? "Item Sent" : "Send Item"}
          </Text>
        </TouchableOpacity>
      }
      bottomDivider
    />
  );

  getDonorDetails = (userId) => {
    db.collection("users")
      .where("userName", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  sendNotification = (itemDetails, requestStatus) => {
    var requestId = itemDetails.request_id;
    var donorId = itemDetails.donor_id;

    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Item Sent") {
            message = this.state.userName + "Has Exchanged your Item";
          } else {
            message =
              this.state.userName + " has shown interest in Exchanging items";
          }
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendItem = (itemDetails) => {
    if (itemDetails.request_status === "Item Sent") {
      var requestStatus = "Exchanger interested";
      db.collection("all_exchanges").doc(itemDetails.doc_id).update({
        request_status: "Exchanger Interested",
      });
      this.sendNotification(itemDetails, requestStatus);
    } else {
      var requestStatus = "Item Sent";
      db.collection("all_exchanges").doc(itemDetails.doc_id).update({
        request_status: "Item Sent",
      });
      this.sendNotification(itemDetails, requestStatus);
    }
  };

  componentDidMount() {
    this.getDonorDetails(this.state.userId);
    this.getAllExchanges();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Exchanges" />
        <View style={{ flex: 1 }}>
          {this.state.allExchanges.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of all item Exchanges</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allExchanges}
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
