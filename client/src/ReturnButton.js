import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import gql from "graphql-tag";
import { ApolloProvider, Mutation } from "react-apollo";

import { MuiThemeProvider, createMuiTheme, Button } from '@material-ui/core'


const RETURN_ITEM = gql`
  mutation returnItemMutation($ItemID: ID!) {
    returnItem(input: $ItemID) {
      title
      description
      tags {
        id
        tagname
      }
    }
  }
`;

const ReturnButton = ({itemID}) => {
  return (
    <div>

      

      <Mutation         
        mutation={RETURN_ITEM}
        onCompleted={(data) => {
            console.log(data);
          }}

         onError={(error) => 
         alert('Item has been returned')}
          >
          
          {(returnItem, { data }) => (
          
          <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              returnItem({ variables: { ItemID: itemID } });
              itemID = "";
              window.location="/Borrowing";
            }}
          >
            <button type="submit">Return</button>
          </form>
        </div>
        )}
      </Mutation>
    </div>
    )
}


export default ReturnButton