const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Promise = require('bluebird');



function setCookie({ tokenName, token, res }) {
  /**
   *  @TODO: Authentication - Server
   *
   *  This helper function is responsible for attaching a cookie to the HTTP
   *  response. 'apollo-server-express' handles returning the response to the client.
   *  We added the 'req' object to the resolver context so we can use it to atttach the cookie.
   *  The 'req' object comes from express.
   *
   *  A secure cookie that can be used to store a user's session data has the following properties:
   *  1) It can't be accessed from JavaScript
   *  2) It will only be sent via https (but we'll have to disable this in development using NODE_ENV)
   *  3) A boomtown cookie should oly be valid for 2 hours.
   */
  // Refactor this method with the correct configuration values.
  res.cookie(tokenName, token, {
    // @TODO: Supply the correct configuration values for our cookie here
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
  // -------------------------------
}



function generateToken(user, secret, csrfToken) {
  const { id, email, username, bio } = user; // Omit the password from the token
  /**
   *  @TODO: Authentication - Server
   *
   *  This helper function is responsible for generating the JWT token.
   *  Here, we'll be taking a JSON object representing the user (the 'J' in JWT)
   *  and cryptographically 'signing' it using our app's 'secret'.
   *  The result is a cryptographic hash representing out JSON user
   *  which can be decoded using the app secret to retrieve the stateless session.
   */
  // Refactor this return statement to return the cryptographic hash (the Token)
  const payload ={ userID: id, csrfToken, exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60), }
  return jwt.sign(payload, secret);
  // -------------------------------
}

module.exports = (app) => {
  return {
    async signup(parent, args, context) {
      //try {
        /**
         * @TODO: Authentication - Server
         *
         * Storing passwords in your project's database requires some basic security
         * precautions. If someone gains access to your database, and passwords
         * are stored in 'clear-text' your users accounts immediately compromised.
         *
         * The solution is to create a cryptographic hash of the password provided,
         * and store that instead. The password can be decoded using the original password.
         */
        // @TODO: Use bcrypt to generate a cryptographic hash to conceal the user's password before storing it.
        const hashedPassword = await bcrypt.hash(args.input.password, 12)
        // -------------------------------

        /*console.log(args);*/
        console.log(args.input.password);
        /*console.log(hashedPassword);*/

        const user = await context.pgResource.createUser({
          username: args.input.username,
          email: args.input.email,
          password: hashedPassword
        });

      const csrfTokenBinary = await Promise.promisify(crypto.randomBytes)(32)
      const csrfToken = Buffer.from(csrfTokenBinary, 'binary').toString('base64')

      setCookie({
        tokenName: app.get('JWT_COOKIE_NAME'),
        token: generateToken(user, app.get('JWT_SECRET'), csrfToken),
        res: context.req.res
      });
      
      return {
        user,
        csrfToken  
      };
    },

    async login(parent, args, context) {
      const user = await context.pgResource.getUserAndPasswordForVerification(
        args.input.email
      );

      if(user == null) throw 'User was not found.';

      /**
       *  @TODO: Authentication - Server
       *
       *  To verify the user has provided the correct password, we'll use the provided password
       *  they submitted from the login form to decrypt the 'hashed' version stored in out database.
       */
      // Use bcrypt to compare the provided password to 'hashed' password stored in your database.

      
      const valid = await bcrypt.compare(args.input.password, user.password ); //database is return as an object and the names of the columns are keys


      // -------------------------------
      if (!valid) throw 'Incorrect user or email.';


      const csrfTokenBinary = await Promise.promisify(crypto.randomBytes)(32)
      const csrfToken = Buffer.from(csrfTokenBinary, 'binary').toString('base64')

      setCookie({
        tokenName: app.get('JWT_COOKIE_NAME'),
        token: generateToken(user, app.get('JWT_SECRET'), csrfToken),
        res: context.req.res
      });
      
      return {
        user,
        csrfToken  
      };
    },

/*    logout(parent, args, context) {
      context.req.res.clearCookie(app.get('JWT_COOKIE_NAME'));
      return true;
    }*/
  };
};






