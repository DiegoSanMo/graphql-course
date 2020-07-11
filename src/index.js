import {
    GraphQLServer
} from 'graphql-yoga';
//Definitions

const typeDefs = `
    type Query {
        user: User!
        post: Post!
    }

    type Post {
        id: ID!,
        title: String!
        description: String!
    }
    type User {
        name: String!
        age: Int!
        nationality: String!
    }
`

const resolvers = {
    Query: {
        user() {
            return {
                name: 'Diego',
                age: 24,
                nationality: 'MExican'
            }
        },
        post(){
            return {
                id: '1231',
                title: 'First title post',
                description: 'This is my first description'
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The app is running')
});