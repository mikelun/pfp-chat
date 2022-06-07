import { createSlice } from '@reduxjs/toolkit'
import { getAuthUserID, getUserFirebase, initializeFirebase } from '../logic/firebase'
import { getUserMoralis, intializeMoralis } from '../logic/moralis'

const initialState = {
  initialized: false,
  loggedIn: false,
  address: null,
  firebaseUser: -1,
  moralisUser: -1,
};

const counterSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateFirebaseUser(state, action) {
      state.firebaseUser = action.payload;
    },
    updateMoralisUser(state, action) {
      state.moralisUser = action.payload;
    }
  },
})

export const { updateFirebaseUser, updateMoralisUser } = counterSlice.actions
export default counterSlice.reducer