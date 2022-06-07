import { createSlice } from '@reduxjs/toolkit'

const initialState = { loggedIn: false }

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    login(state) {
        state.loggedIn = true
    },
  },
})

export const { login } = counterSlice.actions
export default counterSlice.reducer