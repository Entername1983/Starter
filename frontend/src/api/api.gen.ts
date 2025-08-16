import { enhancedApi as api } from "./emptyApi";
export const addTagTypes = ["user", "utils"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      checkUserStatus: build.query<
        CheckUserStatusApiResponse,
        CheckUserStatusApiArg
      >({
        query: () => ({ url: `/user/auth/status/` }),
        providesTags: ["user", "user"],
      }),
      logoutUser: build.mutation<LogoutUserApiResponse, LogoutUserApiArg>({
        query: () => ({ url: `/user/auth/logout/`, method: "POST" }),
        invalidatesTags: ["user", "user"],
      }),
      signIn: build.mutation<SignInApiResponse, SignInApiArg>({
        query: (queryArg) => ({
          url: `/user/auth/sign_in/`,
          method: "POST",
          body: queryArg.internalSigninRequest,
        }),
        invalidatesTags: ["user", "user"],
      }),
      confirmEmail: build.mutation<ConfirmEmailApiResponse, ConfirmEmailApiArg>(
        {
          query: (queryArg) => ({
            url: `/user/auth/confirm-email/`,
            method: "POST",
            body: queryArg.confirmEmailRequest,
          }),
          invalidatesTags: ["user", "user"],
        },
      ),
      signInWithGoogle: build.query<
        SignInWithGoogleApiResponse,
        SignInWithGoogleApiArg
      >({
        query: () => ({ url: `/user/auth/google_sign_in/` }),
        providesTags: ["user", "user"],
      }),
      authCallback: build.query<AuthCallbackApiResponse, AuthCallbackApiArg>({
        query: (queryArg) => ({
          url: `/user/auth/callback`,
          params: {
            state: queryArg.state,
            code: queryArg.code,
            scope: queryArg.scope,
          },
        }),
        providesTags: ["user"],
      }),
      register: build.mutation<RegisterApiResponse, RegisterApiArg>({
        query: (queryArg) => ({
          url: `/user/auth/register`,
          method: "POST",
          body: queryArg.signUpRequest,
        }),
        invalidatesTags: ["user"],
      }),
      healthCheck: build.query<HealthCheckApiResponse, HealthCheckApiArg>({
        query: () => ({ url: `/utils/health` }),
        providesTags: ["utils"],
      }),
      readRoot: build.query<ReadRootApiResponse, ReadRootApiArg>({
        query: () => ({ url: `/` }),
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type CheckUserStatusApiResponse =
  /** status 200 Successful Response */ UserDataResponse;
export type CheckUserStatusApiArg = void;
export type LogoutUserApiResponse =
  /** status 200 Successful Response */ LogoutResponse;
export type LogoutUserApiArg = void;
export type SignInApiResponse = /** status 200 Successful Response */ any;
export type SignInApiArg = {
  internalSigninRequest: InternalSigninRequest;
};
export type ConfirmEmailApiResponse =
  /** status 200 Successful Response */ ConfirmEmailResponse;
export type ConfirmEmailApiArg = {
  confirmEmailRequest: ConfirmEmailRequest;
};
export type SignInWithGoogleApiResponse =
  /** status 200 Successful Response */ any;
export type SignInWithGoogleApiArg = void;
export type AuthCallbackApiResponse = /** status 200 Successful Response */ any;
export type AuthCallbackApiArg = {
  state: string;
  code: string;
  scope?: string | null;
};
export type RegisterApiResponse =
  /** status 200 Successful Response */ RegistrationResponse;
export type RegisterApiArg = {
  signUpRequest: SignUpRequest;
};
export type HealthCheckApiResponse =
  /** status 200 Successful Response */ HealthResponse;
export type HealthCheckApiArg = void;
export type ReadRootApiResponse = /** status 200 Successful Response */ any;
export type ReadRootApiArg = void;
export type AuthProviderEnum = "google" | "discord" | "microsoft" | "internal";
export type UserSettingsSchema = {
  id: number;
  userId: number;
  notificationsEnabled: boolean;
};
export type UserSchema = {
  id: number | null;
  createdAt: string;
  updatedAt: string;
  email: string;
  givenName: string;
  familyName: string | null;
  username: string;
  externalUserId: string | null;
  authProvider: AuthProviderEnum | null;
  disabled: boolean;
  settings?: UserSettingsSchema | null;
  pictureUrl: string | null;
};
export type UserDataResponse = {
  status: string;
  loggedIn: boolean;
  user: UserSchema;
  message: string | null;
};
export type LogoutResponse = {
  status: string;
  message: string;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type InternalSigninRequest = {
  username: string;
  password: string;
  originalPage: string;
};
export type ConfirmEmailResponse = {
  confirmed: boolean;
};
export type ConfirmEmailRequest = {
  token: string;
  email: string;
};
export type RegistrationResponse = {
  redirectUrl?: string;
  user: UserSchema;
};
export type SignUpRequest = {
  email: string;
  username: string;
  password?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  oAuthId?: string | null;
  authProvider: AuthProviderEnum;
  accessToken?: string | null;
  pictureUrl?: string | null;
  terms?: boolean;
  newsletter?: boolean;
  promoCode?: string | null;
  originalPage?: string | null;
  settings?: string | null;
};
export type HealthResponse = {
  status: string;
};
export const {
  useCheckUserStatusQuery,
  useLogoutUserMutation,
  useSignInMutation,
  useConfirmEmailMutation,
  useSignInWithGoogleQuery,
  useAuthCallbackQuery,
  useRegisterMutation,
  useHealthCheckQuery,
  useReadRootQuery,
} = injectedRtkApi;
