import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  isToggle: true,
  selectedItem: "dashboard",
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    sideBartoggle: (state) => {
      state.isToggle = !state.isToggle;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
});

export const { increment, decrement, sideBartoggle,setSelectedItem } = mainSlice.actions;
export default mainSlice.reducer;