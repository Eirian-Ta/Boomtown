import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";


import { ApolloProvider } from "react-apollo";
import apolloClient from './apolloClient'

import { MuiThemeProvider, createMuiTheme  } from '@material-ui/core'


import Login from "./Login"
import Signup from "./Signup"
import Sidebar from './Sidebar'
import MyItems from './MyItems'
import Borrowing from './Borrowing'
import Library from './Library'
import AddItemForm from './AddItemForm'

import './App.css';

/*const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
  credentials: 'include'
});*/


const initialCSRFToken = localStorage.getItem('token')

const theme = createMuiTheme({})

const App = () => {

  const [csrfToken, setCSRFToken] = useState(initialCSRFToken);


    return (
      <ApolloProvider client={apolloClient}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <div>
          <h1>share. borrow.prosper</h1>

            { csrfToken == null && (
              <React.Fragment>
                <Route path="/" exact render={() => (
                  <Login setCSRFToken={setCSRFToken} />
                  )}/>
                <Route path="/Signup" component = {Signup}/>
              </React.Fragment>
              )}
            { csrfToken != null && (
              <React.Fragment>
                {/*<Route path="/" exact component = {Dashboard}/>*/}
                <Sidebar setCSRFToken={setCSRFToken}/>
                <Route path="/" exact component = {MyItems}/>
                <Route path="/borrowing" exact component = {Borrowing}/>
                <Route path="/library" exact component = {Library}/>

                <Route path="/additemform" exact component = {AddItemForm}/>

              </React.Fragment>
              )}
            

            
          </div>
        </Router>
        </MuiThemeProvider>
      </ApolloProvider>
    )

}




export default App;
