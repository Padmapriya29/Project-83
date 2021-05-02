import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import HomeScreen from "../Screens/homeScreen";
import ExchangeScreen from "../Screens/exchangeScreen";

export const AppTabNavigator = createBottomTabNavigator({
  DonateThings: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/Home.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Home"
    },
  },
  Exchange: { screen: ExchangeScreen,
    navigationOptions: {
        tabBarIcon: (
          <Image
            source={require("../assets/Exchange.png")}
            style={{ width: 20, height: 20 }}
          />
        ),
        tabBarLabel: "Exchange"
      },
},

});
