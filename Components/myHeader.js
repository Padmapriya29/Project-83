import React from "react";
import { Header } from "react-native-elements";

const MyHeader = (props) => {
  return (
    <Header
      centerComponent={{
        text: props.title,
        style: { fontSize: 20, color: "#fff", fontWeight: "bold" },
      }}
      backgroundColor="#ff6787"
    />
  );
};

export default MyHeader;
