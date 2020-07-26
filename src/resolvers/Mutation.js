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
    createPost(parent, args, { db }, info) {
      const userExist = db.users.some(user => user.id === args.post.author)
      if (!userExist) {
        throw new Error('User not found')
      }
      const post = {
        id: uuid(),
        ...args.post
      }
      db.posts.push(post);
      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.postId);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const postDeleted = db.posts.splice(postIndex, 1);
      db.comments = db.comments.filter(comment => comment.post !== args.postId)

      return postDeleted[0];
    },
    createComment(parent, args, { db }, info) {
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
      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(comment => comment.id === args.commentId);
      if (commentIndex === -1) {
        throw new Error('Comment not found')
      }
      const deletedComment = db.comments.splice(commentIndex, 1);
      return deletedComment[0]
    }
 }

 export { Mutation as default}