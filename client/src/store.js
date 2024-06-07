import { configureStore } from '@reduxjs/toolkit'
import recipesReducer from './reducers/recipesSlice'
import usersReducer from './reducers/usersSlice'

export default configureStore({
  reducer: {
    recipes: recipesReducer,
    users: usersReducer,
  },
})