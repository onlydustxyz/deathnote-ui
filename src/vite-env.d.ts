/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEATHNOTE_GITHUB_CLIENT_ID: string;
  readonly DEATHNOTE_GITHUB_REDIRECT_URI: string;
  readonly DEATHNOTE_DATA_API_HOSTNAME: string;
  readonly DEATHNOTE_SIGNUP_API_HOSTNAME: string;
  readonly DEATHNOTE_REGISTRY_CONTRACT_ADDRESS: string;

  readonly DEATHNOTE_STARKNET_NETWORK: "mainnet-alpha" | "goerli-alpha" | "localhost";
  readonly DEATHNOTE_STARKNET_HOSTNAME: string;

  readonly DEATHNOTE_TYPEFORM_APPLY_URL: string;
  readonly DEATHNOTE_TYPEFORM_SUBMIT_URL: string;
  readonly DEATHNOTE_SENTRY_DSN: string;
  readonly DEATHNOTE_SENTRY_ENVIRONMENT: string;
  readonly DEATHNOTE_SENTRY_RELEASE: string;
  readonly DEATHNOTE_SENTRY_TRACES_SAMPLE_RATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace NodeJS {
    interface Global {
      import: {
        meta: ImportMeta;
      };
    }
  }
}
