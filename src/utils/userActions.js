import { createAction } from '@reduxjs/toolkit';

// Action to set the user in the store
export const setUser = createAction('user/setUser');

// Action to sign out the user (clear user state)
export const signOut = createAction('user/signOut');

// Action to set an error in the store related to authentication
export const setAuthError = createAction('user/setAuthError');