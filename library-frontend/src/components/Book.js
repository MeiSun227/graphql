import React from 'react'

const Book = (props) => {
    return (
        <tr >
            <td>{props.book.title}</td>
            <td>{props.book.author.name}</td>
            <td>{props.book.published}</td>
        </tr>
    )
}

export default Book;