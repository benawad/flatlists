import React, { Component } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { List, ListItem } from "react-native-elements";
import { graphql, gql } from "react-apollo";

class App extends Component {
  state = {
    offset: 0,
    loading: false
  };

  fetchData = async () => {
    this.setState({ loading: true });
    this.props.data.fetchMore({
      variables: {
        limit: this.props.limit,
        offset: this.state.offset
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          someSuggestions: [
            ...previousResult.someSuggestions,
            ...fetchMoreResult.someSuggestions
          ]
        };
      }
    });
    this.setState({
      loading: false
    });
  };

  handleEnd = () => {
    this.setState(
      state => ({ offset: state.offset + this.props.limit }),
      () => this.fetchData()
    );
  };

  render() {
    const data = this.props.data.someSuggestions || [];
    return (
      <View>
        <List>
          <FlatList
            data={data}
            keyExtractor={({ id }) => id}
            onEndReached={() => this.handleEnd()}
            onEndReachedThreshold={0}
            ListFooterComponent={() =>
              this.state.loading
                ? null
                : <ActivityIndicator size="large" animating />}
            renderItem={({ item }) => <ListItem title={`${item.text}`} />}
          />
        </List>
      </View>
    );
  }
}

const getSuggestions = gql`
  query($limit: Int!, $offset: Int!) {
    someSuggestions(limit: $limit, offset: $offset) {
      id
      text
    }
  }
`;

export default graphql(getSuggestions)(App);
