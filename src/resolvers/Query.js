const Query = {

  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    const isTitleMatch = db.posts.filter(post => post.title.toLowerCase().includes(args.query.toLowerCase()))
    const isBodyMatch = db.posts.filter(post => post.body.toLowerCase().includes(args.query.toLowerCase()))
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
  comments() {
    return db.comments
  }

}

export {Query as default}