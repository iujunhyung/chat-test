export const enum AuthType {
  None = 'None',
  AAD = 'AzureAd',
}

export interface AuthConfig {
  authType: AuthType;
  aadAuthority: string;
  aadClientId: string;
  aadApiScope: string;
}