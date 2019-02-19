import React from 'react'
import { Link } from "react-router-dom";

import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@material-ui/core'

const LOG_IN = gql`
  mutation login($user: LoginInput!) {
    login(input: $user) {
      user {
        id
        username
      }
      csrfToken
    }
  }
`;



const Login = ({
  setCSRFToken,
}) => {
  return (
    <div>
      <h1>Welcome to Boomtown</h1>
      <h2>Log in page</h2>


      <Mutation 
        mutation={LOG_IN}
        onCompleted={(data) => {
          console.log('csrf token:', data.login.csrfToken)
          localStorage.setItem('token', data.login.csrfToken)
          setCSRFToken(data.login.csrfToken)
        }}

        onError={(error) => 
          alert('error')}
        >
        
        {(login, { data }) => (
          
          <div>


            <Formik
              initialValues={
                {
                  email: '',
                  password: '', 
                }
              }
      
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  login({variables: { user: values }})

                  setSubmitting(false);
                }, 500);
              }}

              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .required('E-mail is required!'),
                password: Yup.string()
                  .required('Password is required!'),
              })}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="email" style={{ display: 'block' }}>
                      Email
                    </label>
                    <input
                      id="email"
                      placeholder="Enter your email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.email && touched.email ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.email &&
                      touched.email && <div className="input-feedback">{errors.email}</div>}

                      <label htmlFor="password">
                        Password
                      </label>
                      <input 
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.password && touched.password ? 'text-input error' : 'text-input'
                      }
                    />

                    <Button
                      variant="contained"
                      type="button"
                      className="outline"
                      onClick={handleReset}
                      disabled={!dirty || isSubmitting}
                    >
                      Reset
                    </Button>
                    <Button variant="contained" type="submit" disabled={isSubmitting}>
                      Enter
                    </Button>                       
                  </form>
                );
              }}
            </Formik>
          </div>
        )}
      </Mutation>

      <Link to="/Signup"><button>Create an acount</button></Link>

    </div>
  )
 
}

export default Login