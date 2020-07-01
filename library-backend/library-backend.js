const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const config = require('./utils/config')
const jwt = require('jsonwebtoken')
const book = require('./models/book')


mongoose.set('useFindAndModify', false)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'


const typeDefs = gql`
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Author {
  name: String!
  bookCount: Int!
  born:Int
}
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}

type Query {
  bookCount:Int!
  authorCount: Int!
  allBooks(author:String,genres:String):[Book!]
  allAuthors:[Author!]
  me: User
}

type Mutation {
  addBook(
      title: String!
      published: Int
      author: String!
      genres: [String!]!
  ) : Book
  editAuthor(
    name:String!
    setBornTo:Int
  ): Author 
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({})

      if (args.author && args.genres)
        return books.filter(book => book.author === args.author && book.genres.includes(args.genres));

      if (args.genres)
        return books.filter(book => book.genres.includes(args.genres));

      if (args.author)
        return books.filter(book => book.author === args.author);

      else
        return books
    },

    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map(author => {
        return {
          name: author.name,
          born: author.born,
          bookCount: Book.collection.countDocuments({ author: { $eq: author.id } })
        }
      })
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {

      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = await new Author({ name: args.author });
        await author.save();
      }
      const book = new Book({ ...args, author })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      let author = await Author.findOne({ name: args.name });
      if (!author) {
        throw new UserInputError("Author not found!")
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError("Please type in year, 1xxx")
      }
      return author
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secred') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
