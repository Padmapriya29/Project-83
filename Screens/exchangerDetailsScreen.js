import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import MyHeader from "../Components/myHeader";
import { Card, Header, Icon } from "react-native-elements";
import db from "../Config";
import firebase from "firebase";
import { Value } from "react-native-reanimated";

export default class ExchangerDetailsScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      recieverId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      itemName: this.props.navigation.getParam("details")["item_name"],
      reasonForRequest: this.props.navigation.getParam("details")[
        "reason_for_request"
      ],
      recieverRequestDocId: "",
      recieverName: "",
      recieverContact: "",
      recieverAdress: "",
      userName: "",
    };
  }

  getUserDetails = (userId) => {
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

  getRecieverDetails = () => {
    db.collection("users")
      .where("userName", "==", this.state.recieverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            recieverName: data.first_name,
            recieverContact: data.mobile_number,
            recieverAddress: data.address,
          });
        });
      });
    db.collection("requested_items")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            recieverRequestDocId: doc.id,
          });
        });
      });
  };

  updateItemStatus = () => {
    db.collection("all_exchanges").add({
      item_name: this.state.itemName,
      request_id: this.state.requestId,
      requested_by: this.state.recieverName,
      exchanger_id: this.state.userId,
      request_status: "Person Interested for Barter",
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + " has shown interest in Exchanging Items";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.recieverId,
      exchanger_id: this.state.userId,
      request_id: this.state.requestId,
      item_name: this.state.itemName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getRecieverDetails();
    this.getUserDetails(this.state.userId);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#696969"
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            }
            centerComponent={{
              text: "Exchange Items",
              style: { color: "#90A5A9", fontSize: 15, fontWeight: "bold" },
            }}
            backgroundColor="#eaf8fe"
          />
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"Item Information"} titleStyle={{ fontSize: 15 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name : {this.state.itemName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason : {this.state.reasonForRequest}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"Exchanger Information"} titleStyle={{ fontSize: 15 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.recieverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.recieverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.recieverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.recieverId !== this.state.userId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateItemStatus();
                this.addNotification();
                
                this.props.navigation.navigate("MyBarters");
              }}
            >
              <Text>I want to Exchange</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 80,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "orange",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
