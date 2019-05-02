import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';

const ADD_AUCTION = gql`
  mutation createAuction(
    $sellerID: ID!
    $title: String!
    $description: String!
    $startTime: String!
  ) {
    createAuction(
      sellerID: $sellerID
      title: $title
      description: $description
      startTime: $startTime
    ) {
      id
    }
  }
`;
class Create extends Component {
  render() {
    let title, description, startTime;
    return (
      <Mutation
        mutation={ADD_AUCTION}
        onCompleted={() => this.props.history.push('/')}
      >
        {(createAuction, { loading, error } ) => (
          <div className='container'>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                <h3 className='panel-title'>ADD AUCTION</h3>
              </div>
              <div className='panel-body'>
                <h4>
                  <Link to='/' className='btn btn-primary'>
                    Auction List
                  </Link>
                </h4>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    createAuction(
                      {
                        variables: {
                          sellerID: '5ccabaf90ae5a1153a0f5e14',
                          title: title.value,
                          description: description.value,
                          startTime: startTime.value
                        }
                      }                    
                    );
                    title.value = '';
                    description.value = '';
                    startTime.value = '';
                  }}
                >
                  <div className='form-group'>
                    <label htmlFor='title'>Title:</label>
                    <input
                      type='text'
                      className='form-control'
                      name='title'
                      ref={node => {
                        title = node;
                      }}
                      placeholder='Title'
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='description'>Description:</label>
                    <textarea
                      className='form-control'
                      name='description'
                      ref={node => {
                        description = node;
                      }}
                      placeholder='Description'
                      cols='80'
                      rows='3'
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='start_time'>Start TIME</label>
                    <input
                      type='text'
                      className='form-control'
                      name='start_time'
                      ref={node => {
                        startTime = node;
                      }}
                      placeholder='Start time'
                    />
                  </div>
                 
                  <button type='submit' className='btn btn-success'>
                    Submit
                  </button>
                </form>
                {loading && <p>Loading...</p>}
                {error && <p>Error :( Please try again</p>}
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Create;
