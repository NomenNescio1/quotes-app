import React, { useEffect, useState } from 'react'

export const useFetchQuote = () => {
  const [quote, setQuote] = useState([])
  const [author, setAuthor] = useState([])
  const [index, setIndex] = useState(Math.floor((Math.random() * 225) + 0))

  useEffect(() => {
    fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
        .then(response => response.json())
        .then(data => {
          setQuote(data.quotes.map(e=>{
            return e.quote;
          }));
          setAuthor(data.quotes.map(e=>{
            return e.author;
          }));
        })
        .catch(error => console.error(error)); 
  }, []);
  return(
    <div className="container">
      <div className="quotes">
      <blockquote>
        <p>{quote[index]}</p>
        <footer>— {author[index]}</footer>
      </blockquote>        
      <button onClick={()=>{setIndex(Math.floor((Math.random() * 225) + 0))}}>Get new quote</button>
      </div>      
    </div>
  )   
}
