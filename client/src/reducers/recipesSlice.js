import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/recipes');
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateRecipe = createAsyncThunk('recipes/updateRecipe', async (updatedRecipe, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/recipes/${updatedRecipe.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRecipe),
    });
    if (!response.ok) throw new Error('Failed to update recipe');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteRecipe = createAsyncThunk('recipes/deleteRecipe', async (recipeId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/recipes/${recipeId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete recipe');
    return recipeId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.recipes = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.map(recipe => (
          recipe.id === action.payload.id ? action.payload : recipe
        ));
        state.status = 'succeeded';
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
        state.status = 'succeeded';
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default recipesSlice.reducer;
