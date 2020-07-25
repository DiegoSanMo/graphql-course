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
  }
];

const db = {
  users,
  posts,
  comments
}

export { db as default };