/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthProviderEnum } from './AuthProviderEnum';
import type { UserSettingsSchema } from './UserSettingsSchema';
export type UserSchema = {
    id: (number | null);
    created_at: string;
    updated_at: string;
    email: string;
    first_name: string;
    last_name: (string | null);
    username: string;
    external_user_id: string;
    auth_provider: AuthProviderEnum;
    disabled: boolean;
    settings: (UserSettingsSchema | null);
};

