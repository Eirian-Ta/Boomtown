const jwt = require("jsonwebtoken")

const authenticate = (app, req) =>{
  const cookieName = app.get('JWT_COOKIE_NAME')
  const secret = app.get('JWT_SECRET')

  const jwtCookie = req.cookies[cookieName]
  const { userID, csrfToken } = jwt.verify(jwtCookie, secret)

  const headerCSRFToken = req.get('authorization').replace('Bearer ', '')
  const isValidCSRF = csrfToken === headerCSRFToken

  if(!isValidCSRF){
    throw new Error('Unauthorized')
  }
  console.log('returned user id ', userID)
  return userID
}

module.exports = authenticate