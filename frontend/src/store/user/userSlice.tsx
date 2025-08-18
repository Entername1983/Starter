import type { UserSchema } from '@api/api.gen'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface IUserState {
  user: UserSchema | null
}
const initialState: IUserState = {
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserSchema | null>) {
      console.log('entered setuser', action)
      state.user = action.payload
    },
  },
})
export default userSlice.reducer

export const { setUser } = userSlice.actions
