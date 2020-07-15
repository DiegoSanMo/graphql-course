import {
    GraphQLServer
} from 'graphql-yoga';
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
        id: 1,
        text: 'First Comment'
    },
    {
        id: 2,
        text: 'Second Comment'
    },
    {
        id: 3,
        text: 'Third Comment'
    },
    {
        id: 4,
        text: 'Fourth Comment'
    },
    {
        id: 5,
        text: 'Fifth Comment'
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

    type Comment {
        id: ID!
        text: String!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
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
        comments(){
            console.log("comments -> comments", comments)
            return comments
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            console.log("parent", parent)
            return users.find(user => user.id === parent.author)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            console.log("posts -> parent", parent)
            return posts.filter(post => {
                if (post.author === parent.id) {
                    console.log("posts -> post", post)
                }
                post.author === parent.id
            })
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