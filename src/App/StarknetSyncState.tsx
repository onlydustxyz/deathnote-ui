import { FC, PropsWithChildren, ReactElement, useEffect, useTransition } from "react";
import { Abi } from "starknet";
import { useConnectors, useContract, useStarknet, useStarknetBlock } from "@starknet-react/core";

import config from "src/config";
import profileRegistryAbi from "src/abis/profileRegistry.json";
import { useSetRecoilState } from "recoil";
import { accountAtom, blockNumberAtom, profileRegistryContractAtom, providerAtom } from "src/state";

const StarknetSyncState: FC<PropsWithChildren> = ({ children }) => {
  const setAccount = useSetRecoilState(accountAtom);
  const setProvider = useSetRecoilState(providerAtom);
  const setProfileRegistryContract = useSetRecoilState(profileRegistryContractAtom);
  const setBlockNumber = useSetRecoilState(blockNumberAtom);
  const { data: blockData } = useStarknetBlock();
  const [, startTransition] = useTransition();

  const { account: accountAddress, library: provider } = useStarknet();

  const { contract: profileRegistryContract } = useContract({
    abi: profileRegistryAbi as Abi,
    address: config.REGISTRY_CONTRACT_ADDRESS,
  });

  const { connectors } = useConnectors();

  useEffect(() => {
    if (blockData) {
      startTransition(() => {
        setBlockNumber(blockData.block_number.toString());
      });
    }
  }, [blockData]);

  useEffect(() => {
    startTransition(() => {
      setProfileRegistryContract(profileRegistryContract);
    });
  }, [profileRegistryContract]);

  useEffect(() => {
    startTransition(() => {
      setProvider(provider);
    });
  }, [provider]);

  useEffect(() => {
    (async () => {
      for (const connector of connectors) {
        const account = await connector.account();
        if (account?.address === accountAddress) {
          startTransition(() => {
            setAccount(account);
          });
          return;
        }
      }
      startTransition(() => {
        setAccount(undefined);
      });
    })();
  }, [accountAddress, connectors]);

  return children as ReactElement;
};

export default StarknetSyncState;
