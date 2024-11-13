import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
 image :string | null;
  email: string;
  name: string;
  id: string;
}

interface UserState {
  user: UserData | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false
};

const authSlice = createSlice({
  name: "auth", 
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    },
   setUser: (state, action: PayloadAction<UserData>) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  }
});

export const { login, logout,setUser } = authSlice.actions;
export default authSlice.reducer;
