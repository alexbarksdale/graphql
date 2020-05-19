# Reading GraphQL Types
- When a type ends with `!` it means it will always return that type.
- If it doesn't contain `!` it can return something like null
- `users: [User!]!`
    - users will always return an array([]!) always containing a user(User!) == [User!]!

# GraphQL Types (Scalar Types)
- String
- Boolean
- Int
- Float
- ID

# Type Definitions
- Nothing more than a regular schema

# Resolvers
- These are functions that run when a query for something

### Resolver Arguments
They are as follows in the exact order 
- There are `4` arguments that get passed to all resolver functions
- object: useful when working with relational data. e.g a user having many posts 
- args: Contains the operation arguments supplied (like a regular func)
- context (ctx): Useful when you want to share information across your GraphQL
- info: ...

# Input Type
- You can only have scalar values within a input type 
```js
input CreateUserInput {
    name: String!
    email: String!
    age: Int
}
```
# Context
- Useful when you want to share information across your GraphQL resolvers
```js
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db,
    },
});
```
