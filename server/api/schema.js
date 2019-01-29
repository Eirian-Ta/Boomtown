const { gql } = require('apollo-server-express');

module.exports = gql`
  # scalar Upload

  # scalar Date

  type Item {
    id: ID!
    title: String!
    description: String
    owner: User!
    borrower: User
    tags: [Tag!]!
  }

  type User {
    id: ID!
    username: String!
    items: [Item]
    borrowed: [Item]
  }

  type Tag {
    id: ID!
    tagname: String!
  }



  input NewItemInput {
    title: String!
    imageURL: String
    description: String!
    ownerID: ID!
    borrowerID: ID
    tagIDs: [ID!] 
  }

  type Query {
    user(id: ID!): User
    viewer: User
    items(filter: ID): [Item]
    tags: [Tag]
  }

  type Mutation {
    addItem(input: NewItemInput!):Item!
  }
`;
