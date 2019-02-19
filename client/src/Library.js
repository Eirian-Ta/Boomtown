import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";

import BorrowButton from "./BorrowButton"

/*import Login from "./Login"*/



const Library = () => {
  return (
    <div>
      <h1>Library</h1>
      <p>Items available for borrowing</p>

      <Query
        query={gql`
          {
             viewer {
                id
              }            
              items{
             
                id
                title
                description
                owner {
                  id
                  username
                }
                borrower {
                  id
                }
                tags {
                  tagname
                }
            }
          }
        `}>
        
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) {
            console.log(error);
            return <p>Error</p>;
          }

          console.log(data);
          console.log(data.items);
 /*         console.log(data.viewer.items);*/


          return data.items.map(({id, title, description, owner, borrower, tags}) => {
            if (owner.id != data.viewer.id) {
              const new_tags = tags.map(({tagname}) => tagname).join(', ');

            return (    
            <div key={id}>
              <p> Item: {title} </p>
              <p> Description: {description} </p>
              <p> Owner: {owner.username} </p>
              <p> Tags: {new_tags} </p>
              <BorrowButton 
                itemID={id}
                borrowerID={data.viewer.id}
              />
            </div>
          )

            }
            })
        }}
      </Query>

  </div>
  )
}

export default Library