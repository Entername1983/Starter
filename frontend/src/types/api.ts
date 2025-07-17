/**
 * API Types and Interfaces
 *
 * This file defines TypeScript types for API responses and requests
 * to replace 'any' types throughout the application.
 */

export interface IUser {
  id: string
  email: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}
export interface ISelectedUIPreset {
  id: string
  name: string
  [key: string]: unknown
}
export interface ISelectedColorPalette {
  id: string
  name: string
  colors: Record<string, string>
  [key: string]: unknown
}
export interface ISelectedFontSettings {
  id: string
  name: string
  [key: string]: unknown
}

export interface ISelectedSpacingSettings {
  id: string
  name: string
  [key: string]: unknown
}
export interface ISelectedBorderStyle {
  id: string
  name: string
  [key: string]: unknown
}

export interface IDesignConfig {
  selectedUIPreset?: ISelectedUIPreset
  selectedColorPalette?: ISelectedColorPalette
  selectedFontSettings?: ISelectedFontSettings
  selectedSpacingSettings?: ISelectedSpacingSettings
  selectedBorderStyle?: ISelectedBorderStyle
  customColors?: Record<string, string>
  [key: string]: unknown
}

export interface IDesign {
  id: string
  name: string
  description?: string
  config: IDesignConfig
  preset_type: string
  is_public: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface ICreateDesignRequest {
  name: string
  description?: string
  config: IDesignConfig
  preset_type: string
  is_public?: boolean
}

export interface IUpdateDesignRequest {
  name?: string
  description?: string
  config?: IDesignConfig
  is_public?: boolean
}

export interface IAuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface IGoogleAuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: IUser
}

export interface ILoginRequest {
  email: string
  password: string
}

export interface IRegisterRequest {
  email: string
  password: string
  full_name: string
}

export interface IApiError {
  detail: string
  status_code: number
}

export interface IDesignersCountResponse {
  designers_count: number
}

export interface IApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Type guards for runtime type checking
export function isUser(obj: unknown): obj is IUser {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as IUser).id === 'string' &&
    typeof (obj as IUser).email === 'string' &&
    typeof (obj as IUser).full_name === 'string'
  )
}

export function isDesign(obj: unknown): obj is IDesign {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as IDesign).id === 'string' &&
    typeof (obj as IDesign).name === 'string' &&
    typeof (obj as IDesign).preset_type === 'string' &&
    typeof (obj as IDesign).config === 'object'
  )
}

export function isApiError(obj: unknown): obj is IApiError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as IApiError).detail === 'string' &&
    typeof (obj as IApiError).status_code === 'number'
  )
}
