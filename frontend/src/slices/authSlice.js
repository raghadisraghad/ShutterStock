import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.userInfo = user;
      state.token = token;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      localStorage.setItem('token', JSON.stringify(state.token));
      localStorage.setItem('theme', 'light');
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('theme');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;