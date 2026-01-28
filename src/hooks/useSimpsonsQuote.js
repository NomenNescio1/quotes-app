import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'https://thesimpsonsapi.com/api/characters';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const buildQuoteObject = (character) => ({
  content: getRandomItem(character.phrases),
  author: character.name,
  image: character.portrait_path || ''
});

export const useSimpsonsQuote = () => {
  const [quote, setQuote] = useState({
    quote: null,
    loading: false,
    error: null
  });
  
  const abortControllerRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const cacheRef = useRef(null);

  const fetchQuoteWithRetry = useCallback(async (retryCount = 0) => {
    // If cache exists, just select from it
    if (cacheRef.current) {
      setQuote({
        quote: buildQuoteObject(getRandomItem(cacheRef.current)),
        loading: false,
        error: null
      });
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    setQuote(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(API_URL, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { results } = await response.json();

      if (!results || results.length === 0) {
        throw new Error('Invalid response format');
      }

      const validQuotes = results.filter(
        item => item.phrases && item.phrases.length > 0 && item.name
      );

      if (validQuotes.length === 0) {
        throw new Error('No valid quotes found');
      }

      // Cache the valid quotes
      cacheRef.current = validQuotes;

      setQuote({
        quote: buildQuoteObject(getRandomItem(validQuotes)),
        loading: false,
        error: null
      });

    } catch (error) {
      // Don't retry if the request was aborted
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Failed to fetch quote:', error);

      if (retryCount < MAX_RETRIES) {
        // Schedule retry
        retryTimeoutRef.current = setTimeout(() => {
          fetchQuoteWithRetry(retryCount + 1);
        }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      } else {
        setQuote({
          quote: null,
          loading: false,
          error: `Failed to fetch quote after ${MAX_RETRIES} attempts: ${error.message}`
        });
      }
    }
  }, []);

  const refetch = useCallback(() => {
    fetchQuoteWithRetry(0);
  }, [fetchQuoteWithRetry]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchQuoteWithRetry(0);

    return cleanup;
  }, [fetchQuoteWithRetry, cleanup]);

  return {
    ...quote,
    refetch,
    cleanup
  };
};