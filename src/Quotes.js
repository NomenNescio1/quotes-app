import React, { useEffect, useState } from 'react';
import './App.css';

export const Quotes = () => {

  const [quote, setQuote] = useState({
    content: '',
    autor: '',
    image: ''
  });
  const [newQuote, setNewQuote] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://thesimpsonsquoteapi.glitch.me/quotes');
      const data = await response.json();
      setQuote({
        content: data[0].quote,
        autor: data[0].character,
        image: data[0].image
      })
    }

    fetchData();
  }, [newQuote])

  return (
    <div className="app">
      <h2>The Simpsons Quote Generator v2</h2>
      <h4>(Mostly Homer)</h4>
      <div className="container" style={{ backgroundImage: `url(${quote.image})`, backgroundRepeat: 'no-repeat', backgroundPosition: `right top` }}>
        <div className="quotes">
          {quote.content.length > 0 && (
            <div>
              <blockquote>
                <p>{quote.content}</p>
                <footer>— {quote.autor}</footer>
              </blockquote>
              <span className='new-quote' onClick={() => setNewQuote(!newQuote)}>Get new quote</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

