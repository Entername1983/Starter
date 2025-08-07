import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { UserSchema } from '@/api/api.gen'

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
      state.user = action.payload
    },
  },
})
export default userSlice.reducer

export const { setUser } = userSlice.actions
