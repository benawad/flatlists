import React, { Component } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { List, ListItem } from "react-native-elements";
import { graphql, gql } from "react-apollo";

class App extends Component {
  state = {
    cursor: 0,
    loading: false
  };

  fetchData = async () => {
    this.setState({ loading: true });
    console.log("fetching");
    console.log(this.state.cursor);
    await this.props.data.fetchMore({
      variables: {
        limit: this.props.limit,
        cursor: this.state.cursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          searchSuggestions: [
            ...previousResult.searchSuggestions,
            ...fetchMoreResult.searchSuggestions
          ]
        };
      }
    });
    this.setState({
      loading: false
    });
  };

  handleEnd = () => {
    const { searchSuggestions, loading } = this.props.data;
    if (
      !loading &&
      this.state.cursor != searchSuggestions[searchSuggestions.length - 1].id
    ) {
      this.setState(
        state => ({
          cursor: searchSuggestions[searchSuggestions.length - 1].id
        }),
        () => this.fetchData()
      );
    }
  };

  render() {
    const data = this.props.data.searchSuggestions || [];
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

const searchSuggestions = gql`
  query($query: String!, $limit: Int!, $cursor: Int) {
    searchSuggestions(query: $query, limit: $limit, cursor: $cursor) {
      id
      text
    }
  }
`;

export default graphql(searchSuggestions)(App);
