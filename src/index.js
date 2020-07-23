import {
    GraphQLServer
} from 'graphql-yoga';

const {
    uuid
} = require('uuidv4');
//Definitions

const users = [{
        id: '11',
        name: 'Diego',
        email: "diego@hotmail.com",
        age: 24

    },
    {
        id: '12',
        name: 'Iram',
        email: "iram@hotmail.com",
        age: 23

    },
    {
        id: '13',
        name: 'Joel',
        email: "joel@hotmail.com",
        age: 20
    },
    {
        id: '14',
        name: 'Livier',
        email: "livier@hotmail.com",
        age: 59
    },
    {
        id: '15',
        name: 'Balto',
        email: "balto@hotmail.com",
        age: 8
    }
];

const posts = [{
        id: "1",
        title: "El principito",
        body: "One of the best books",
        published: true,
        author: '11'
    },
    {
        id: "2",
        title: "Narnia",
        body: "Narnia",
        published: true,
        author: '11'
    },
    {
        id: "3",
        title: "Cayyondi",
        body: "The life of my dog",
        published: false,
        author: '13'
    },
    {
        id: "4",
        title: "The fantastic four",
        body: "Ggg izi",
        published: false,
        author: '14'
    },
    {
        id: "5",
        title: "Eleanor and Park",
        body: "A romantic book",
        published: false,
        author: '15'
    }
];

const comments = [{
        id: 101,
        text: 'First Comment',
        author: '11',
        post: '1'
    },
    {
        id: 102,
        text: 'Second Comment',
        author: '12',
        post: '1'
    },
    {
        id: 103,
        text: 'Third Comment',
        author: '12',
        post: '1'
    },
    {
        id: 104,
        text: 'Fourth Comment',
        author: '13',
        post: '2'
    },
    {
        id: 105,
        text: 'Fifth Comment',
        author: '11',
        post: '3'
    },


];

const typeDefs = ` 
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        post: Post!
        user: User!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post:  Post!
    }
`

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }
            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            const isTitleMatch = posts.filter(post => post.title.toLowerCase().includes(args.query.toLowerCase()))
            const isBodyMatch = posts.filter(post => post.body.toLowerCase().includes(args.query.toLowerCase()))
            return isTitleMatch || isBodyMatch;
        },
        user() {
            return {
                id: '123',
                name: 'Diego',
                age: 24,
                email: 'diego@hotmail.com'
            }
        },
        post() {
            return {
                id: '1231',
                title: 'First title post',
                body: 'This is my first description',
                published: false
            }
        },
        // comments() {
        //     return comments
        // }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.email)
            if (emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuid(),
                name: args.name,
                email: args.email,
                age: args.age

            }

            users.push(user);
            return user;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id)
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