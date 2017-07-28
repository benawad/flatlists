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
          someSuggestions2: [
            ...previousResult.someSuggestions2,
            ...fetchMoreResult.someSuggestions2
          ]
        };
      }
    });
    this.setState({
      loading: false
    });
  };

  handleEnd = () => {
    const { someSuggestions2, loading } = this.props.data;
    if (
      !loading &&
      this.state.cursor != someSuggestions2[someSuggestions2.length - 1].id
    ) {
      this.setState(
        state => ({ cursor: someSuggestions2[someSuggestions2.length - 1].id }),
        () => this.fetchData()
      );
    }
  };

  render() {
    const data = this.props.data.someSuggestions2 || [];
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

const getSuggestions2 = gql`
  query($limit: Int!, $cursor: Int) {
    someSuggestions2(limit: $limit, cursor: $cursor) {
      id
      text
    }
  }
`;

export default graphql(getSuggestions2)(App);
