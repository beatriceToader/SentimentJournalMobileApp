/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateJournalEntry = /* GraphQL */ `
  subscription OnCreateJournalEntry(
    $filter: ModelSubscriptionJournalEntryFilterInput
  ) {
    onCreateJournalEntry(filter: $filter) {
      id
      text
      sentiment
      confidence
      createdAt
      username
      updatedAt
      __typename
    }
  }
`;
export const onUpdateJournalEntry = /* GraphQL */ `
  subscription OnUpdateJournalEntry(
    $filter: ModelSubscriptionJournalEntryFilterInput
  ) {
    onUpdateJournalEntry(filter: $filter) {
      id
      text
      sentiment
      confidence
      createdAt
      username
      updatedAt
      __typename
    }
  }
`;
export const onDeleteJournalEntry = /* GraphQL */ `
  subscription OnDeleteJournalEntry(
    $filter: ModelSubscriptionJournalEntryFilterInput
  ) {
    onDeleteJournalEntry(filter: $filter) {
      id
      text
      sentiment
      confidence
      createdAt
      username
      updatedAt
      __typename
    }
  }
`;
