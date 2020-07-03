import React from 'react'
import Authors from './Authors'
import NewBook from './NewBook'

const LibraryView = ({setPage, logout, page, token}) => {
    return (
        <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => logout()}>logout</button>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <NewBook show={page === 'add'} />
            <Authors token={token} show={page === 'authors'} />
        </>
    )
}

export default LibraryView