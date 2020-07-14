import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query{
  allAuthors {
    name,
    bookCount,
    born
}
} 
`
const  BOOK_DETAILS = gql`
fragment BookDetails on Book{
  title
  published
  author{
    name
  }
  genres
} 
`
export const ALL_BOOKS = gql`
query  {
  allBooks {
   ...BookDetails
  }
}
${BOOK_DETAILS}
`
export const CREATE_BOOK = gql`
mutation createBook(
  $title: String!, 
  $published: Int!,
  $author: String!,
  $genres: [String!]!){
addBook(
  title: $title,
  published: $published,
  author: $author,
  genres: $genres
){
  title,
  published,
  author{
    name
  }
  genres
}
}
`
export const EDIT_AUTHOR = gql`
mutation editAuthor( 
  $name:String!
  $setBornTo:Int){
editAuthor(
      name: $name,
     setBornTo: $setBornTo
    ){
      name,
      born
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, 
    $password: String!)
     {
    login(username: $username, 
      password: $password
      ) 
       {
      value
    }
  }
`
export const ME = gql`
query{
  me {
      username
      favoriteGenre
  }
}
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`