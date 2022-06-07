import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authReducer';
import counterReducer from './counterReducer'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer
  },
  // Temporary disable serialize check for redux as we store MediaStream in ComputerStore.
  // https://stackoverflow.com/a/63244831
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
