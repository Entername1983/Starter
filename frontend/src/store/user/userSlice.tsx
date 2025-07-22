import type { UserSchema } from '@client'
import { createSlice } from '@reduxjs/toolkit'

import { fetchUser } from './actions'
export interface IUserState {
  user: UserSchema | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string
}
const initialState: IUserState = {
  user: null,
  status: 'idle',
  error: '',
}

interface IUserPayload {
  payload: UserSchema
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: IUserPayload) => {
      state.user = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload.error
      })
  },
})
export default userSlice.reducer
