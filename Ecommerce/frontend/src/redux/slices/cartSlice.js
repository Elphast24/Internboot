import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartStart: (state) => {
      state.loading = true;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
    setCartItems: (state, action) => {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    }
  }
});

export const {
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems
} = cartSlice.actions;
export default cartSlice.reducer;