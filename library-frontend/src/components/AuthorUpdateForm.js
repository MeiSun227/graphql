import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'


const AuthorForm = () => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')
    const [editAuthor] = useMutation(EDIT_AUTHOR, { refetchQueries: [{ query: ALL_AUTHORS }] })


    const submit = (event) => {
        event.preventDefault()
        editAuthor({ variables: {name, setBornTo: +born }})
        setName('')
        setBorn('')
    }

    return (
        <div>
            <h2>change number</h2>

            <form onSubmit={submit}>
                <div>
                    name
    <input value={name} onChange={({ target }) => setName(target.value)} />
                </div>
                <div>
                    born <input
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type='submit'>update author</button>
            </form>
        </div>
    )
}

export default AuthorForm