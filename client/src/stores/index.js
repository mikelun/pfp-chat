import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginReducer';


export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
  // Temporary disable serialize check for redux as we store MediaStream in ComputerStore.
  // https://stackoverflow.com/a/63244831
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
