import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    auction(id: ID!): Auction
    auctions: [Auction!]!
  }
  extend type Mutation {
    createAuction(
      sellerID: ID!
      title: String!
      description: String
      startTime: String!
      items: [itemInput]
    ): Auction
    joinAuction(auctionID: ID!, bidderID: ID!): Auction
    #TODO: Create resolver
    leaveAuction(auctionID: ID!, removeBidderID: ID!): Auction
  }
  type Auction {
    id: ID!
    seller: User!
    bidders: [User!]!
    title: String!
    description: String!
    items: [Item!]!
    startTime: String!
    createdAt: String!
    updatedAt: String!
  }

  input itemInput {
    itemTitle: String!
    itemDescription: String
    itemPrice: Int
    itemDuration: Int
  }
`;
