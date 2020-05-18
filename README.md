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
- context (ctx): Good for contextual data like containing the id of the user
- info: ...
