import React from 'react'

const Book = (props) => {
    return (
        <tr key={props.book.id}>
              <td>{props.book.title}</td>
              <td>{props.book.author.name}</td>
              <td>{props.book.published}</td>
            </tr>
    )
}

export default Book;