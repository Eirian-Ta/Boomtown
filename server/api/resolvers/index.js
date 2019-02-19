/**
 *  @TODO: Handling Server Errors
 *
 *  Once you've completed your pg-resource.js methods and handled errors
 *  use the ApolloError constructor to capture and return errors from your resolvers.
 *
 *  Throwing ApolloErrors from your resolvers is a nice pattern to follow and
 *  will help you easily debug problems in your resolving functions.
 *
 *  It will also help you control th error output of your resource methods and use error
 *  messages on the client! (More on that later).
 *
 *  The user resolver has been completed as an example of what you'll need to do.
 *  Finish of the rest of the resolvers when you're ready.
 */
const { ApolloError } = require('apollo-server-express');

// @TODO: Uncomment these lines later when we add auth
 const jwt = require("jsonwebtoken")
const authMutations = require("./auth")
const authenticate = require("../authenticate")
// -------------------------------
const { UploadScalar, DateScalar } = require('../custom-types');

module.exports = (app) => {
  return {
    // Upload: UploadScalar,
    // Date: DateScalar,

    Query: {
      async viewer(parent, args, context) {
        /**
         * @TODO: Authentication - Server
         *
         *  If you're here, you have successfully completed the sign-up and login resolvers
         *  and have added the JWT from the HTTP cookie to your resolver's context.
         *
         *  The viewer is what we're calling the current user signed into your application.
         *  When the user signed in with their username and password, an JWT was created with
         *  the user's information cryptographically encoded inside.
         *
         *  To provide information about the user's session to the app, decode and return
         *  the token's stored user here. If there is no token, the user has signed out,
         *  in which case you'll return null
         */

         const userID = authenticate(app, context.req)
         // const userID = 1

         const user = await context.pgResource.getUserById(userID)

        return user;
      },
      async user(parent, { id }, { pgResource, req }, info) {
        authenticate(app, req)
        try {
          const user = await pgResource.getUserById(id);
          return user;
        } catch (e) {
          throw new ApolloError(e);
        }
      },
      async items(parent, { filter }, { pgResource, req }, info) {
        authenticate(app, req)
        try {
          const items = await pgResource.getItems(filter);
          return items;
        } catch(e) {
          throw new ApolloError(e);
        }
      },

      async tags(parent, {}, { pgResource, req }, info) {
        authenticate(app, req)
        try {
          const tags = await pgResource.getTags();
          return tags;
        } catch(e) {
          throw new ApolloError(e);
        }
      }
    },


    User: {
      async items(user, {}, { pgResource }, info) {
        try {
          const items = await pgResource.getItemsForUser(user.id);
          return items;
        } catch(e) {
          throw new ApolloError(e);
        }
      },

      async borrowed(user, {}, { pgResource }, info) {
        try {
          const items = await pgResource.getBorrowedItemsForUser(user.id);
          return items;
        } catch(e) {
          throw new ApolloError(e);
        }
      }
    },

    Item: {
      async owner(item, {}, { pgResource }, info) {
        try {
          const owner = await pgResource.getUserById(item.ownerid);
          return owner;
        } catch(e) {
          throw new ApolloError(e);
        }
      },

      async tags(tag, {}, { pgResource }, info) {
        try {
          const tags = await pgResource.getTagsForItem(tag.id);
          return tags;
        } catch(e) {
          throw new ApolloError(e);
        }
      },

      async borrower(item, {}, { pgResource }, info) {
        try {
          const borrower = await pgResource.getUserById(item.borrowerid);
          return borrower;
        } catch(e) {
          throw new ApolloError(e);
        }
      },

    },

    Mutation: {
       ...authMutations(app),
      // -------------------------------

      async addItem(parent, args, { pgResource, req }, info) {
        args.input.ownerID = authenticate(app, req)
        const newItem = await pgResource.saveNewItem(
          args.input
        );
        return newItem;
      },

        async returnItem(parent, args, { pgResource, req }, info) {
          console.log(args.input)
          args.input.ownerID = authenticate(app, req)
          console.log(args.input)
          const newItem = await pgResource.resetBorrowerIDforReturnItem(
          args.input
        );
        return newItem;
      },

        async borrowItem(parent, args, { pgResource, req }, info) {
          // args.input = {    
          //   itemID: 2
          //   borrowerID: 3
          // }console.log(args.input)

          args.input.borrowerID = authenticate(app, req)
          console.log(args.input)
          const newItem = await pgResource.setBorrowerIDforItem(
          args.input
        );
        return newItem;
      },
    }
  };
};
