import React, { useState } from 'react'
import { ME } from '../queries'
import { ALL_BOOKS  } from '../queries'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import Book from './Book'


const Recommendation = (props) => {
    const user = useQuery(ME)
    const books = useQuery(ALL_BOOKS)
    const [displayBooks, setDisplayBooks]=useState(null)

    useEffect(()=>{
     if (books.data && user.data) {
        console.log("koira")
        setDisplayBooks(books.data.allBooks.filter(b => b.genres.includes(user.data.me.favoriteGenre)))
     }
 },[books.data,user.data])

    if (!props.show) return null;
    if (user.loading) return <div>loading ...</div>;

   
    return (
        <>
            <h4>Books from my favoutite genre<strong> {user.data.me.favoriteGenre}</strong></h4>
            <table>
                <thead>
                    <tr>
                        <th>title</th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                </thead>
                <tbody>
                {displayBooks.map(book =>
            <Book book={book} />
          )}
                            
                        
                </tbody>
            </table>
        </>
    )
}
export default Recommendation