import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import { List, ListItem } from "react-native-elements";

export default class App extends Component {
  state = {
    data: []
  };

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const response = await fetch("https://randomuser.me/api?results=10");
    const json = await response.json();
    this.setState({ data: json.results });
  };

  render() {
    return (
      <View>
        <List>
          <FlatList
            data={this.state.data}
            keyExtractor={(x, i) => i}
            renderItem={({ item }) =>
              <ListItem
                roundAvatar
                avatar={{ uri: item.picture.thumbnail }}
                title={`${item.name.first} ${item.name.last}`}
              />}
          />
        </List>
      </View>
    );
  }
}
