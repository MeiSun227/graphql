
import React, { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import LibraryView from './components/LibraryView'
import { ALL_BOOKS, BOOK_ADDED } from './queries'


const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
 
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(b=> b.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }


  return (
    <>
      <div>
        {token === null
          ? <LoginForm setPage={setPage} token={token} setError={notify} setToken={setToken} show={page === 'login'} />
          : (
            <LibraryView setPage={setPage} logout={logout} page={page} token={token} />
          )}
        <Notify errorMessage={errorMessage} />
      </div>
      <Books token={token} show={page === 'books'} />
    </>

  )

}



export default App

