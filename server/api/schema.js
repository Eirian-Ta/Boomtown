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
    email: String!
    password: String!
    bio: String
  }

  type Tag {
    id: ID!
    tagname: String!
  }



  input NewItemInput {
    title: String!
    description: String!
    borrowerID: ID
    tagIDs: [ID!] 
  }


  input NewUserInput {
    username: String!
    email: String!
    password: String!
    bio: String

  }

  input LoginInput {
    email: String!
    password: String!
  }

  
  input BorrowItemInput {
    itemID: ID!
  }

  type LoginResponse {
    csrfToken: String!
    user: User!
  }

  type Query {
    user(id: ID!): User
    viewer: User
    items(filter: ID): [Item]
    tags: [Tag]
  }

  type Mutation {
    addItem(input: NewItemInput!):Item!
    signup(input: NewUserInput!): LoginResponse!
    login(input: LoginInput!): LoginResponse!
    returnItem(input: ID!): Item!
    borrowItem(input: BorrowItemInput!): Item!
  }
`;
