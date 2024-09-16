import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  isLoggedIn:false,
  user: {},
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user=action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = {};
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
