import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email_id: "",
  role: "",
  base64_image: "",
  user_id: "",
};

export const userslice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.name = action.payload.name;
      state.email_id = action.payload.email_id;
      state.role = action.payload.role;
      state.base64_image = action.payload.base64_image;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user_id = "";
      state.name = "";
      state.email_id = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout } = userslice.actions;

export default userslice.reducer;
