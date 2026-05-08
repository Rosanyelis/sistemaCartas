export type User = {
    id: number;
    name: string;
    email: string;
    /** URL absoluta o null */
    avatar?: string | null;
    avatar_url?: string | null;
    direction?: string | null;
    zip_code?: string | null;
    phone?: string | null;
    role?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
