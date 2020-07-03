
import React, { useState } from 'react'
import {useApolloClient } from '@apollo/client'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import LibraryView from './components/LibraryView'


const Notify = ({ errorMessage }) => {
  if ( !errorMessage ) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify =(message)=>{
    setErrorMessage(message)
    setTimeout(()=>{
      setErrorMessage(null)},5000)
    }


  return (
    <>
      <div>
        {token === null
          ? <LoginForm setPage={setPage} token={token} setError ={notify} setToken={setToken} show={page === 'login'} />
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

