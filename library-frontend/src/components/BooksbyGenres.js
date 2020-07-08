
import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { gql } from '@apollo/client'

const GET_BOOKS_BY_GENRE = gql`
  query filterByGenres {
    filterByGenres {
      title
      author{
          name
      }
      published
      genres
    }
  }
`
const BooksbyGenres = () => {
    const result = useQuery(GET_BOOKS_BY_GENRE)
    const [books, setBooks] = useState(null)

    useEffect(() => {
        if (result.data) {
            setBooks(result.data.filterByGenres)
        }
    })

    if (books) {
        return (
        <div>
            <h2>books</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                        {books.map((a) => (
                            <tr key={a.title}>
                                <td>{a.title}</td>
                                <td>{a.author.name}</td>
                                <td>{a.published}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
        )
    }

    return (
         <div>loading...</div>
    )
}

export default BooksbyGenres
