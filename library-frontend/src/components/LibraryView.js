import React from 'react'
import Authors from './Authors'
import NewBook from './NewBook'
import Recommendation from './Recommendation'
import BooksbyGenres from './BooksbyGenres'



const LibraryView = ({setPage, logout, page, token}) => {
    return (
        <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => logout()}>logout</button>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('recommendation')}>Recommendation</button>
            <button onClick={() => setPage('booksbygenres')}>GqlRecommendation</button>
            <NewBook token={token} show={page === 'add'} />
            <Authors token={token} show={page === 'authors'} />
            <Recommendation  show={page==='recommendation'}/>   
            < BooksbyGenres show={page==='booksbygenres'} token={token} />  
        </>
    )
}

export default LibraryView