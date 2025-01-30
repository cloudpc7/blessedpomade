import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSessionToken, setLoading, clearSessionToken, fetchCart } from "../utils/sessionSlice";
import SessionContext from '../SessionContext';
import axios from 'axios';
import LoadingSpinner from '../utils/LoadingSpinner';

const SessionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const sessionToken = useSelector((state) => state.session.sessionToken);
  const loading = useSelector((state) => state.session.loading);
  console.log(sessionToken);
  useEffect(() => {
    const fetchSession = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get('https://us-central1-blessedpomade.cloudfunctions.net/api/sessions', {
          headers: sessionToken ? { 'Session-Token': sessionToken } : {}
        });

        const newSessionToken = response.headers['session-token'];
        if (newSessionToken) {
          dispatch(setSessionToken(newSessionToken));
        } else if (response.data.status === "valid") {
          dispatch(setSessionToken(sessionToken)); // Keep current token if valid
        } else {
          console.error('Session invalid or not found');
          dispatch(clearSessionToken()); // Clear session if it's invalid
        }

        // Fetch cart if we have a valid session
        if (sessionToken || newSessionToken) {
          dispatch(fetchCart());
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        dispatch(clearSessionToken()); // Clear session on error
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchSession();
  }, [dispatch, sessionToken]);

  // Here you could add periodic checks if needed, but for simplicity, we'll skip it

  return (
    <SessionContext.Provider value={{ sessionToken }}>
      {loading ? <LoadingSpinner /> : null}
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;