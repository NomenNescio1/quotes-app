import React, { useEffect } from 'react';
import { useSimpsonsQuote } from './hooks/useSimpsonsQuote';
import './App.css';

export default function Quotes() {
  const { quote, loading, error, refetch } = useSimpsonsQuote();
  const IMG_PATH = "https://cdn.thesimpsonsapi.com/500"

  // Set CSS variable for background image when quote changes
  useEffect(() => {
    if (quote?.image) {
      document.documentElement.style.setProperty('--quote-image', `url(${IMG_PATH}${quote.image})`);
    }
  }, [quote]);

  const handleNewQuote = () => {
    refetch();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNewQuote();
    }
  };

  return (
    <div className="app">
      <header>
        <h2>The Simpsons Quote Generator v2</h2>
      </header>
      
      <main>
        <div className="container quote-container">
          <div className="quotes">
            {loading && (
              <div className="loading-indicator" aria-live="polite">
                <span className="loading-spinner" aria-hidden="true"></span>
                Loading quote...
              </div>
            )}

            {error && (
              <div className="error-message" role="alert" aria-live="assertive">
                <span className="error-icon" aria-hidden="true">⚠️</span>
                {error}
              </div>
            )}

            {quote && !loading && !error && (
              <div className="quote-content">
                <blockquote>
                  <p>{quote.content}</p>
                  <footer>— {quote.author}</footer>
                </blockquote>
                
                <button
                  className="new-quote"
                  onClick={handleNewQuote}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  aria-label="Get a new Simpsons quote"
                  type="button"
                >
                  {loading ? 'Loading...' : 'Get new quote'}
                </button>
              </div>
            )}

            {!quote && !loading && !error && (
              <div className="empty-state">
                <p>No quote available</p>
                <button
                  className="new-quote"
                  onClick={handleNewQuote}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  aria-label="Try loading a Simpsons quote"
                  type="button"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

