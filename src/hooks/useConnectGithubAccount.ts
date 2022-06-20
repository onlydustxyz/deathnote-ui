import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import BN from "bn.js";

import config from "src/config";
import { toBN } from "starknet/dist/utils/number";

interface ConnectGithubAccountParams {
  address: string;
  code: string;
  hash: string;
  signature: string[];
}

interface GithubEndpointData {
  authorization_code: string;
  account_address: string;
  signed_data: {
    hash: string;
    signature: {
      r: string;
      s: string;
    };
  };
}

interface GithubEndpointReturn {
  data: any;
}

export function useConnectGithubAccount() {
  const [data, setData] = useState<GithubEndpointReturn>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const controller = new AbortController();

  const call = async ({ address, code, hash, signature }: ConnectGithubAccountParams) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await axios.post<GithubEndpointReturn, AxiosResponse<GithubEndpointReturn>, GithubEndpointData>(
        `${config.API_HOSTNAME}/registrations/github`,
        {
          authorization_code: code,
          account_address: toBN(address).toString(),
          signed_data: {
            hash: toBN(hash).toString(),
            signature: {
              r: toBN(signature[0]).toString(),
              s: toBN(signature[1]).toString(),
            },
          },
        },
        {
          signal: controller.signal,
        }
      );

      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error as Error);
      setIsLoading(false);
    }
  };
  // cancel the request
  return {
    call,
    abort: () => {
      controller.abort();
    },
    isLoading,
    data,
    error,
  };
}
