const posts = [
  {
    id: 1,
    imageURL:
      'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
    caption: 'Where flowers bloom, so does hope',
    timestamp: '2022-01-16T17:27:25.416937200',
    comments: [
      {
        user: {
          username: 'jennie',
          imageURL:
            'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
        },

        timestamp: '2022-01-17T17:27:25.416937200',
        content: 'So pretty!',
      },

      {
        user: {
          username: 'lera.ns',
          imageURL:
            'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
        },

        timestamp: '2022-01-17T10:27:25.416937200',
        content: 'Cutee!',
      },
    ],

    commentCount: 2,
    poster: {
      username: 'miyayeah',
      imageURL:
        'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
    },
  },

  {
    id: 2,
    imageURL:
      'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
    caption: 'Where flowers bloom, so does hope',
    timestamp: '2022-01-16T17:27:25.416937200',
    comments: [
      {
        user: {
          username: 'jennie',
          imageURL:
            'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
        },

        timestamp: '2022-01-17T17:27:25.416937200',
        content: 'So pretty!',
      },

      {
        user: {
          username: 'lera.ns',
          imageURL:
            'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
        },

        timestamp: '2022-01-17T10:27:25.416937200',
        content: 'Cutee!',
      },
    ],

    commentCount: 2,
    poster: {
      username: 'miyayeah',
      imageURL:
        'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
    },
  },

  {
    id: 3,
    imageURL:
      'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
    caption: 'Where flowers bloom, so does hope',
    timestamp: '2022-01-16T17:27:25.416937200',
    comments: [
      {
        user: {
          username: 'jennie',
          imageURL:
            'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
        },

        timestamp: '2022-01-17T17:27:25.416937200',
        content: 'So pretty!',
      },

      {
        user: {
          username: 'lera.ns',
          imageURL:
            'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
        },

        timestamp: '2022-01-17T10:27:25.416937200',
        content: 'Cutee!',
      },
    ],

    commentCount: 2,
    poster: {
      username: 'miyayeah',
      imageURL:
        'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
    },
  },
]

const users = [
  {
    imageURL:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGdpcmwlMjBwcm9maWxlfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    username: 'boca_00',
    mutualsCount: 5,
  },

  {
    imageURL:
      'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGdpcmwlMjBwcm9maWxlfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    username: 'jelenaa',
    mutualsCount: 10,
  },

  {
    imageURL:
      'https://images.unsplash.com/photo-1634316887741-93ff860c6854?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIwfHxnaXJsJTIwcHJvZmlsZXxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60',
    username: 'filipovics',
    mutualsCount: 25,
  },

  {
    imageURL:
      'https://images.unsplash.com/photo-1524117074681-31bd4de22ad3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTR8fGdpcmwlMjBwcm9maWxlfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    username: 'snezanaart',
    mutualsCount: 14,
  },
]

export { posts, users }
