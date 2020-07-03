import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'


const AuthorForm = (props) => {
    const existingAuthor = useQuery(ALL_AUTHORS)
    const [name, setName] = useState(existingAuthor)
    const [born, setBorn] = useState('')
    const [editAuthor] = useMutation(EDIT_AUTHOR, { refetchQueries: [{ query: ALL_AUTHORS }] })

    const submit = (event) => {
        event.preventDefault()
        editAuthor({ variables: { name, setBornTo: +born } })
        setName(existingAuthor)
        setBorn('')
    }

    return (
        <div>
            <h2>Set Birth Year</h2>

            <form onSubmit={submit}>
            <select onChange={({ target }) => setName(target.value)}>
                {existingAuthor.data.allAuthors.map(author => {
                            return (
                                <option key={author.name} value={author.name}>{author.name}</option>
                            )
                        })
                    }
                </select>
    
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