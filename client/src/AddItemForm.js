import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Formik } from 'formik';
import * as Yup from 'yup';

import Select from 'react-select';

import MySelect from './MySelect'





const ADD_ITEM = gql`
  mutation addItemMutation($item: NewItemInput!) {
    addItem(input: $item) {
      title
      description
      tags {
        id
        tagname
      }
    }
  }
`;




const AddItemForm = () => {
  return (
    <div>
      <h1>Add an Item</h1>


      <Mutation         
        mutation={ADD_ITEM}
        onCompleted={(data) => {
            console.log(data);
          }}

         onError={(error) => 
         alert('error')}
          >
        {(addItem, { loading, error, data }) => {
          if (loading) return <p>Loading...</p>
          if (error) {
            console.log(error);
            return <p>This errored</p>
          }

          return (
          
            <Formik
              initialValues={
                {
                  title:'',
                  description: '',
                  tagIDs: [], 
                }
              }
              onSubmit={(values) => {
                const payload = {
                  title:values.title,
                  description: values.description,
                  tagIDs: values.tags.map(t=>t.value)
                }
/*                console.log(values);
                console.log(payload);*/
                addItem({
                  variables: {
                    item: payload
                  }
                })

              }}
              validationSchema={Yup.object().shape({
                title: Yup.string()
                  .required('Required'),
                description: Yup.string(),
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
                  setFieldValue,
                  setFieldTouched
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="title">
                      Title
                    </label>
                    <input 
                      id="title"
                      placeholder="Enter the title for your item"
                      type="text"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.title && touched.title ? 'text-input error' : 'text-input'
                      }
                    />
                    <label htmlFor="description" style={{ display: 'block' }}>
                      Description
                    </label>
                    <input
                      id="description"
                      placeholder="Describe your item"
                      type="text"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.description && touched.description ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.description &&
                      touched.description && <div className="input-feedback">{errors.description}</div>}

                      <MySelect
                        value={values.tags}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        error={errors.tags}
                        touched={touched.tags}
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
                      Create Item
                    </button>                       
                  </form>
                )
              }}
            </Formik>
        )}}
      </Mutation>
  </div>
  )
}

export default AddItemForm

