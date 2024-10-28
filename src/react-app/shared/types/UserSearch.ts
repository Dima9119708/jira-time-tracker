export type User = {
    accountId: string;
    accountType: string;
    active: boolean;
    avatarUrls: {
        "16x16": string;
        "24x24": string;
        "32x32": string;
        "48x48": string;
    };
    displayName: string;
    key: string;
    name: string;
    self: string;
};
