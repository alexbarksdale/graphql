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
# TypeORM
- By default TypeORM infers the type based on the Typescript type.
```ts
- This column is inferred as type String aka VARCHAR in the database
@Column()
title: string;
```

- `@Entity` - Creates a table or document depending on the database type
- `@PrimaryGeneratedColumn` - marks the table generated as the primary column and auto increments the value 

# TypeGraphQL
- `@ObjectType()` - Marks a class as a `type` known to GraphQL
- `@Field()` - Create a `type` known to GraphQL

# Variables in GraphQL
```graphql
mutation Login($email: String!, $password:String!){
  login(email: $email, password: $password)
}
```
