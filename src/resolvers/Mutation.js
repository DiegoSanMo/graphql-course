const { uuid } = require('uuidv4');
 
const Mutation = {
    createUser(parent, args, { db }, info){
      const emailTaken = db.users.some(user => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email taken.')
      }

      const user = {
        id: uuid(),
        ...args.data
      }

      db.users.push(user);
      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.userId)
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      const deletedUsers = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter(post => {
        const match = post.author === args.userId;
        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id)
        }
        return !match
      })
      db.comments = db.comments.filter(comment => comment.author !== args.userId)
      return deletedUsers[0];

    },
    updateUser(parent, args, { db }, info){
      const {id, data } = args
      const user =  db.users.find(user => user.id === id)
     
      if(!user) throw new Error('User not found');

      if(typeof user.email === 'string'){
        const emailTaken = db.users.some(us => us.email === data.email);
        
        
        if(emailTaken) throw new Error('Email taken')

        user.email = data.email
      }
      if(data.name){
        if(typeof user.name === 'string'){
          user.name = data.name;
        }
      }

      if(typeof user.age !== 'undefined'){
        user.age = data.age;
      }
      return user;
    },
    createPost(parent, args, { db, pubsub }, info) {
      const userExist = db.users.some(user => user.id === args.post.author)
      if (!userExist) {
        throw new Error('User not found')
      }
      const post = {
        id: uuid(),
        ...args.post
      }
      db.posts.push(post);
      if(args.post.published){
        pubsub.publish('post', { 
          post: {
            mutation: 'CREATED',
            data: post
          }
         })
      }
      return post;
    },
    deletePost(parent, args, { db, pubsub }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.postId);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const [post] = db.posts.splice(postIndex, 1);
      db.comments = db.comments.filter(comment => comment.post !== args.postId)
      if(post.published){
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: post
          }

        })
      }
      return post;
    },
    updatePost(parent, args, { db, pubsub }, info){
      let {id, data} = {...args};
      const post = db.posts.find(post => post.id === id);
      const originalPost = {...post}
      
      
      if(!post){
        throw new Error('Post not found')
      }
      if(typeof data.title === 'string'){
        post.title = data.title
      }
      if(typeof data.body === 'string'){
        post.body = data.body;
      }
      if(typeof data.published === 'boolean'){
        post.published = data.published;
        if(originalPost.published && !post.published){
          //delete
          pubsub.publish('post', {
            post: {
              mutation: 'DELETED',
              data: originalPost
            }
          })
        } else if(!originalPost.published && post.published){
        //created
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
        }
      } else if(post.published) {
        //updated
        pubsub.publish('post', {
          post: {
            mutation: 'UPDATED',
            data: post
          }
        })
      }
      return post;
      
    },
    createComment(parent, args, { db, pubsub }, info){
      const existUser = db.users.some(user => user.id === args.comment.author);
      const existPost = db.posts.some(post => post.id === args.comment.post && post.published);

      if (!existUser || !existPost) {
        throw new Error('Unable to find user and post');
      }

      const comment = {
        id: uuid(),
        ...args.comment
      }

      db.comments.push(comment);
      pubsub.publish(`comment ${args.comment.post}`, {
        comment:{
          mutation: 'CREATED',
          data: comment
        }})
      return comment;
    },
    deleteComment(parent, args, { db, pubsub }, info){
      const commentIndex = db.comments.findIndex(comment => comment.id === args.commentId);
      if (commentIndex === -1) {
        throw new Error('Comment not found')
      }
      const [deletedComment] = db.comments.splice(commentIndex, 1);
      console.log(deletedComment)
      pubsub.publish(`comment ${deletedComment.post}`, {
        comment: {
          mutation: 'DELETED',
          data: deletedComment
        }
      })
      return deletedComment
    },
    updateComment(parent, args, { db, pubsub }, info){
      let {id, data} = {...args};
      
      const comment = db.comments.find( comment => comment.id === id)
      console.log(comment)

      if(!comment){
        throw new Error('Comment not found')
      }
      if(typeof data.text === 'string'){
        comment.text = data.text
      }
      
      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: 'UPDATED',
          data: comment
        }
      })
      return comment;


    }
 }

 export { Mutation as default}