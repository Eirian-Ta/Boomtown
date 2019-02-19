import React from 'react'

import gql from "graphql-tag";
import { Query } from "react-apollo";

import Select from 'react-select';


const MySelect = ({ 
  onChange, 
  onBlur,
  options,
  value,
  error,
  touched,
  handleChange,
  handleBlur,
}) =>  {
  handleChange = value => {
    // this is going to call setFieldValue and manually update values.topcis
    onChange('tags', value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    onBlur('tags', true);
  };

    return (

      <Query
        query={gql`
          {
            tags {
              id
              tagname
            }
          }
        `}>
        
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>
          if (error) {
            console.log(error);
            return <p>This errored</p>
          }
          const options = data.tags.reduce((acc, currentValue) => {
            acc.push({value: currentValue.id, label: currentValue.tagname});
            return acc;
          }, [])

          return (

            <div style={{ margin: '1rem 0' }}>
              <label htmlFor="tags">Tags (select at least 1) </label>
              <Select
                id="tags"
                options={options}
                isMulti
                onChange={handleChange}
                onBlur={handleBlur}
                value={value}
              /> 
              {error &&
                touched && (
                  <div style={{ color: 'red', marginTop: '.5rem' }}>{error}</div>
                )}
            </div>    

          )

          }}
      </Query>



    );
  }


export default MySelect