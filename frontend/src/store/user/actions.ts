import { UserService, type UserDataResponse } from '@client'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (): Promise<UserDataResponse> => {
    const result = await UserService.checkUserStatus()
    return result
  }
)
