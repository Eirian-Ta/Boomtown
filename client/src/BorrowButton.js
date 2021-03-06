import React from 'react'
import gql from "graphql-tag";
import { Mutation } from "react-apollo";


const BORROW_ITEM = gql`
  mutation borrowItemMutation( $BorrowItemInput: BorrowItemInput!) {
    borrowItem(input: $BorrowItemInput) {
      id,
    title,
    owner {
      id
    }

      
    }
  }
`;

const BorrowButton = ({ itemID, borrowerID }) => {
  return (
    <div>

      

      <Mutation         
        mutation={BORROW_ITEM}
        onCompleted={(data) => {
            console.log(data);
             }}

         onError={(error) => {
          console.log(error);
         alert('Item has been borrowed')}}
          
          >
          
          {(borrowItem, { data }) => (
          
          <div>
          <form
            onSubmit={e => {
              console.log(data);
              e.preventDefault();
              borrowItem({ variables: {BorrowItemInput : { itemID: itemID} }});
              window.location="/Library";
            }}
          >
            <button type="submit">Borrow</button>
          </form>
        </div>
        )}
      </Mutation>
    </div>
    )
}


export default BorrowButton