import React from 'react'

import gql from "graphql-tag";
import { Query } from "react-apollo";

import ReturnButton from "./ReturnButton";

/*import Login from "./Login"*/



const Borrowing = () => {
  return (
    <div>
      <h1>Borrowing</h1>

      <Query
        query={gql`
          {
            viewer {
              borrowed{
                id
                title
                description
                owner {
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
 /*         console.log(data.viewer.items);*/


          if (data.viewer.borrowed !== null) {
            return data.viewer.borrowed.map(({id, title, description, owner, tags}) => {
            const new_tags = tags.map(({tagname}) => tagname).join(', ');
            return (    
            <div key={id}>
              <p> Item: {title} </p>
              <p> Description: {description} </p>
              <p> Owner: {owner.username} </p>
              <p> Tags: {new_tags} </p>
              <ReturnButton itemID={id}/>
              
            </div>
          )})}
        }}
      </Query>

  </div>
  )
}

export default Borrowing

