// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// export const fetchUsers = createAsyncThunk('users/users', async () => {
//     const res = await fetch('/api/users')
//     return res.json()
// })

// const usersSlice = createSlice({
//     name: 'users',
//     initialState: {
//         user: null,
//     },
//     reducers: {setUser: (state, action) => {
//         state.user = action.payload;
//     }},
// })

// export const {setUser} = usersSlice.actions;

// export default usersSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks for asynchronous actions
export const loginUser = createAsyncThunk('users/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to login');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const signUpUser = createAsyncThunk('users/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Signup failed');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchCurrentUser = createAsyncThunk('users/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/check_session');
    if (!response.ok) throw new Error('Failed to fetch current user');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUserProfile = createAsyncThunk('users/updateProfile', async (userData, { getState, rejectWithValue }) => {
  const { user } = getState().users;
  try {
    const response = await fetch(`/api/current_user/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const logoutUser = createAsyncThunk('users/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to logout');
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'succeeded';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
