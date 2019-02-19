import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Formik } from 'formik';
import * as Yup from 'yup';


const SIGN_UP = gql`
  mutation signup($user: NewUserInput!) {
    signup(input: $user) {
      user {
        id
        username
      }
      csrfToken
    }
  }
`;

const Signup = ({
  setCSRFToken,
}) => (
  <div>
    <h1>Sign up page</h1>
    

    <Mutation         
      mutation={SIGN_UP}
      onCompleted={(data) => {
          console.log('csrf token:', data.signup.csrfToken)
          localStorage.setItem('token', data.csrfToken)
          setCSRFToken(data.signup.csrfToken)
        }}

       onError={(error) => 
       alert('error')}
        >
    

      {(signup, { data }) => (
        
        <div>


          <Formik
            initialValues={
              {
                username:'',
                email: '',
                password: '', 
              }
            }
    
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                signup({variables: { user: values }})
                setSubmitting(false);
              }, 500);
            }}

            validationSchema={Yup.object().shape({
              username: Yup.string()
                .min(3, 'Password has to be longer than 3 characters!')
                .max(25, 'Password has to be shorter than 25 characters!')
                .required('Required'),
              email: Yup.string()
                .email('E-mail is not valid!')
                .required('E-mail is required!'),
              password: Yup.string()
                .min(6, 'Password has to be longer than 6 characters!')  
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
                  <label htmlFor="username">
                    Username
                  </label>
                  <input 
                    id="username"
                    placeholder="Enter your username"
                    type="text"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.username && touched.username ? 'text-input error' : 'text-input'
                    }
                  />
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
                      type="text"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.password && touched.password ? 'text-input error' : 'text-input'
                    }
                  />

                  <button
                    type="button"
                    className="outline"
                    onClick={handleReset}
                    disabled={!dirty || isSubmitting}
                  >
                    Reset
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    Create account
                  </button>                       
                </form>
              );
            }}
          </Formik>
        </div>
      )}
    </Mutation>

    <Link to="/"><button>Log in to existing account</button></Link>
  </div>
);


                
export default Signup