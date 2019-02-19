import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";

/*import Login from "./Login"*/



const MyItems = () => {
  return (
    <div>
      <h1>My Items</h1>

      <Link to="/AddItemForm"><button>Add an item</button></Link>

      <Query
        query={gql`
          {
            viewer {
              items{
                id
                title
                description
                borrower {
                  username
                }
                tags {
                  tagname
                }
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
          console.log(data.viewer);
          console.log(data.viewer.items);


          return data.viewer.items.map(({id, title, description, borrower, tags}) => {
            const new_tags = tags.map(({tagname}) => tagname).join(', ');
            console.log(new_tags);
            return (    
            <div key={id}>
              <p> Item: {title} </p>
              <p> Description: {description != null ? description : 'None'} </p>
              <p> Borrower: {borrower != null ? borrower.username : 'None'} </p>
              <p> Tags: {new_tags !="" ? new_tags : 'None'} </p>
            </div>
          )})
        }}
      </Query>


      
    </div>
  )
}

export default MyItems