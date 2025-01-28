import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSessionToken, clearSessionToken, setLoading } from "../utils/sessionSlice";
import SessionContext from '../SessionContext';
import axios from 'axios';
import LoadingSpinner from '../utils/LoadingSpinner';
const SessionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const sessionToken = useSelector((state) => state.session.sessionToken);
  const [session, setSession] = useState(null);
  const [sessionCreationCount, setSessionCreationCount] = useState(0);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const loading = useSelector((state) => state.session.loading);

  useEffect(() => {

    if (!hasCheckedSession) {
      const manageSession = async () => {
        let currentToken = localStorage.getItem('sessionToken') || sessionToken;

        if (!currentToken) {
          try {
            const response = await axios.get('/session', {
              timeout: 10000
            });
            currentToken = response.headers['session-token'];
            if (currentToken) {
              dispatch(setSessionToken(currentToken));
              localStorage.setItem('sessionToken', currentToken);
              setSession({ token: currentToken });
              setSessionCreationCount(prevCount => {
                return prevCount + 1;
              });
            }
          } catch (error) {
            console.error('Failed to fetch new session:', error);
            if (error.response && error.response.status === 401) {
              dispatch(clearSessionToken());
              localStorage.removeItem('sessionToken');
            }
          }
        } else {
          // Validate existing session
          try {
            const response = await axios.get('/session', {
              headers: { 'session-token': currentToken },
              timeout: 20000,
            });
            
            if (response.data.status === "expired") {
              dispatch(clearSessionToken());
              localStorage.removeItem('sessionToken');
            } else {
              setSession({ token: currentToken, status: response.data.status });
            }
          } catch (error) {
            console.error('Failed to validate session:', error);
            dispatch(clearSessionToken());
            localStorage.removeItem('sessionToken');
          }
        }
        setHasCheckedSession(true); // Mark session check as done
      };

      manageSession();
    }
  }, [dispatch, sessionToken]); // Keep sessionToken in dependency array 

  const contextValue = {
    sessionToken,
    session
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {
        loading ? <LoadingSpinner /> : null
      }
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;