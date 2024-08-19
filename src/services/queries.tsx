import { gql } from '@apollo/client';

// Queries
export const GET_USERS = gql`
  query {
    users {
      id
      name
      email
      cpf
    }
  }
`;

export const GET_ACCOUNTS = gql`
  query {
    accounts {
      id
      owner {
        id
      }
      ownerName
      balance
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query {
    transactions(
      accountId: "string",
      filter: {
        startDate: "string",
        endDate: "string",
        type: "string"
      }
    ) {
      id
      date
      to {
        id
        ownerName
      }
      from {
        id
        ownerName
      }
    }
  }
`;

// Mutations
export const CREATE_USER = gql`
  mutation {
    createUser(
      name: "string",
      email: "string",
      password: "password",
      cpf: "string"
    ) {
      id
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation {
    createAccount(
      ownerId: "string",
    ) {
      id
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation {
    createTransaction(
      from: "string",
      to: "string",
      amount: 0.00
    ) {
      id
      from {
        ownerName
      }
      to {
        ownerName
      }
    }
  }
`;
