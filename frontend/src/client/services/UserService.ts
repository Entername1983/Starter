/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LogoutResponse } from '../models/LogoutResponse';
import type { UserDataResponse } from '../models/UserDataResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Check User Status
     * @returns UserDataResponse Successful Response
     * @throws ApiError
     */
    public static checkUserStatus(): CancelablePromise<UserDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/auth/status/',
        });
    }
    /**
     * Logout User
     * Logs out the user by clearing the session cookie.
     * @returns LogoutResponse Successful Response
     * @throws ApiError
     */
    public static logoutUser(): CancelablePromise<LogoutResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/auth/logout/',
        });
    }
    /**
     * Sign In With Google
     * @returns any Successful Response
     * @throws ApiError
     */
    public static signInWithGoogle(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/auth/google_sign_in/',
        });
    }
    /**
     * Auth Callback
     * @param state
     * @param code
     * @param scope
     * @returns any Successful Response
     * @throws ApiError
     */
    public static authCallback(
        state: string,
        code: string,
        scope?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/auth/callback',
            query: {
                'state': state,
                'code': code,
                'scope': scope,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
