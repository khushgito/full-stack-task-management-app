import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        history: [],
    },
    reducers: {
        setOrderHistory: (state, action) => {
            state.history = action.payload;
        },
        clearOrderHistory: (state) => {
            state.history = [];
        },
    },
});

export const { setOrderHistory, clearOrderHistory } = orderSlice.actions;
export default orderSlice.reducer;
