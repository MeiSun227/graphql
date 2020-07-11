import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import Book from './Book'


const Books = (props) => {
  const books = useQuery(ALL_BOOKS)
  const [filteredBooks, setFilteredBooks] = useState(null)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    if (books.data) {
      setFilteredBooks(books.data.allBooks.map(book => {
        book.genres.forEach(genre => {
          if (!genres.includes(genre)) setGenres(genres.concat(genre))
        });
        return book;
      }))
    }
  }, [books.data, genres])

  if (!props.show) {
    return null
  }

  if (books.loading) {
    return <div>loading...</div>
  }

  const filterByGenre = (genre, allBooks) => {
      setFilteredBooks(allBooks.filter((book) => book.genres.includes(genre)))
  }

  const showAllBooks = (books) => {
    setFilteredBooks(books.data.allBooks)
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(book =>
            <Book key={book.title} book={book} />
          )}
        </tbody>
      </table>
      <h3>Genres</h3>
      {
        genres.map(genre => <button key={genre} onClick={() => filterByGenre(genre, books.data.allBooks)}>{genre}</button>)
      }
      <button onClick={() => showAllBooks(books)}>All books</button>
    </div>
  )
}

export default Books