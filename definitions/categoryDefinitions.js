import { gql } from "apollo-server-hapi";

// Схемы для работы с категориями.
export const categoryDefinitions = gql`
  type Category {
    _id: ID
    name: String
    parent: String
    link: String
    description: String
    sort: Int
    active: Boolean
    image: String
  }
  type Query {
    getCategories(
      parent: String
      page: Int
      count: Int
      sortBy: String
      order: Int
    ): [Category]
    getCategoriesCount(parent: String): Int!
    getCategory(id: ID!): Category
  }
  type Mutation {
    removeCategory(_id: ID!): Boolean!
    saveCategory(
      _id: ID
      name: String
      parent: String
      link: String
      description: String
      sort: Int
      active: Boolean
      image: String
    ): Boolean!
  }
`;
