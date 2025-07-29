import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addItemToCart: (state, action) => {
      state.push(action.payload);
    },
    removeItemFromCart: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { addItemToCart, removeItemFromCart } = cartSlice.actions;
export default cartSlice.reducer;
