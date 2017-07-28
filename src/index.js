import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  createNetworkInterface
} from "react-apollo";

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: "http://localhost:3000/graphql"
  })
});

import App from "./App";

export default () =>
  <ApolloProvider client={client}>
    <App limit={15} offset={0} />
  </ApolloProvider>;
