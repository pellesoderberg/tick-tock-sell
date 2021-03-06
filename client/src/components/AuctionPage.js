import React, { Component } from 'react';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation, Subscription } from 'react-apollo';
import { Button, Row, Col } from 'reactstrap';
import { authenticationService } from '../services/authentication.service';
import Countdown from './Countdown';
import Loader from './Loader';

const GET_AUCTION = gql`
  query GetAuction($id: ID!) {
    auction(id: $id) {
      id
      title
      description
      startTime
      duration
      auctionStarted
      auctionFinished
      items {
        id
        title
        description
        price
        highestBid {
          amount
          bidder {
            id
            name
          }
        }
      }
    }
  }
`;

const PUT_BID = gql`
  mutation putBid($itemID: ID!, $bidderID: ID!, $amount: Int!) {
    putBid(itemID: $itemID, bidderID: $bidderID, amount: $amount) {
      item {
        title
      }
    }
  }
`;

const BID_SUBSCRIPTION = gql`
  subscription {
    bidAdded {
      id
      amount
    }
  }
`;

class AuctionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: authenticationService.currentUserValue
    };
  }

  changeStyle(bidder, currentUser) {
    if (bidder == null) {
    } else {
      if (bidder.bidder.id === currentUser) {
        return {
          color: 'green'
        };
      } else {
        return {
          color: 'red'
        };
      }
    }
  }

  render() {
    const { user } = this.state;
    const auctionID = this.props.match.params.id;
    return (
      <Query query={GET_AUCTION} variables={{ id: auctionID }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <Loader />;
          if (error) return `Error! ${error.message}`;
          var finish = new Date(parseInt(data.auction.startTime));
          finish.setSeconds(finish.getSeconds() + data.auction.duration);
          return (
            <div>
              <div>
                <Subscription
                  subscription={BID_SUBSCRIPTION}
                  onSubscriptionData={() => {
                    refetch();
                  }}
                />
              </div>
              <div className='App'>
                <div className='container'>
                  <div className='panel panel-default'>
                    <Row className='panel-heading'>
                      <Col xs='autos'>
                        <h3 className='panel-title'>{data.auction.title}</h3>
                        <h5 className='panel-title'>
                          {data.auction.description}
                        </h5>
                      </Col>
                      <Col xs='auto' style={{ marginLeft: 'auto' }}>
                        <h2>
                          {!data.auction.auctionStarted ? (
                            <div>
                              Tid kvar till auktion:
                              <Countdown
                                date={new Date(
                                  parseInt(data.auction.startTime)
                                ).toISOString()}
                                refetch={() => refetch()}
                              />
                            </div>
                          ) : !data.auction.auctionFinished ? (
                            <div>
                              Tid kvar på auktion:
                              <Countdown
                                date={finish.toISOString()}
                                refetch={() => refetch()}
                              />
                            </div>
                          ) : (
                            'Auktion avslutad'
                          )}
                        </h2>
                      </Col>
                    </Row>
                    <div className='panel-body'>
                      <table className='table table-stripe'>
                        <thead>
                          <tr>
                            <th>Titel</th>
                            <th>Beskrivning</th>
                            <th>Utgångspris</th>
                            <th>Högsta bud</th>
                            <th>Senaste Budgivare</th>
                            <th />
                            <th />
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          {data.auction.items.map((item, index) => {
                            return (
                              <Mutation mutation={PUT_BID} key={item.id}>
                                {(PutBid, { loading, error }) => (
                                  <tr key={index}>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price}</td>
                                    <td
                                      style={this.changeStyle(
                                        item.highestBid,
                                        user ? user.user.id : null
                                      )}
                                    >
                                      {item.highestBid
                                        ? item.highestBid.amount
                                        : 'Inget bud har lagts'}
                                    </td>
                                    <td
                                      style={this.changeStyle(
                                        item.highestBid,
                                        user ? user.user.id : null
                                      )}
                                    >
                                      {item.highestBid
                                        ? item.highestBid.bidder.name
                                        : 'Inget bud har lagts'}
                                    </td>
                                    <td>
                                      <Button
                                        color='success'
                                        disabled={
                                          data.auction.auctionFinished ||
                                          !data.auction.auctionStarted ||
                                          !user
                                        }
                                        onClick={() =>
                                          PutBid({
                                            variables: {
                                              itemID: item.id,
                                              bidderID: user.user.id,
                                              amount: item.highestBid
                                                ? item.highestBid.amount + 5
                                                : item.price + 5
                                            }
                                          }).then(() => refetch())
                                        }
                                      >
                                        + 5 KR
                                      </Button>
                                    </td>
                                    <td>
                                      <Button
                                        color='primary'
                                        disabled={
                                          data.auction.auctionFinished ||
                                          !data.auction.auctionStarted ||
                                          !user
                                        }
                                        onClick={() =>
                                          PutBid({
                                            variables: {
                                              itemID: item.id,
                                              bidderID: user.user.id,
                                              amount: item.highestBid
                                                ? item.highestBid.amount + 10
                                                : item.price + 10
                                            }
                                          }).then(() => refetch())
                                        }
                                      >
                                        + 10 KR
                                      </Button>
                                    </td>
                                    <td>
                                      <Button
                                        color='danger'
                                        disabled={
                                          data.auction.auctionFinished ||
                                          !data.auction.auctionStarted ||
                                          !user
                                        }
                                        onClick={() =>
                                          PutBid({
                                            variables: {
                                              itemID: item.id,
                                              bidderID: user.user.id,
                                              amount: item.highestBid
                                                ? item.highestBid.amount + 20
                                                : item.price + 20
                                            }
                                          }).then(() => refetch())
                                        }
                                      >
                                        + 20 KR
                                      </Button>
                                      <div>
                                        {loading && <p>Loading...</p>}
                                        {error && (
                                          <p>Error :( Please try again</p>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </Mutation>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {loading && <p>Loading...</p>}
              {error && <p>Error :( Please try again</p>}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default AuctionPage;
