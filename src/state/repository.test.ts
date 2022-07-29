import { afterEach, describe, it, expect, vi } from "vitest";
import { RecoilRoot, snapshot_UNSTABLE, useRecoilValue } from "recoil";
import { renderHook } from "@testing-library/react-hooks";
import { contributionQuery, contributionsQuery, hasContributorAppliedToContributionSelector } from "./repository";
import { contributionRepository } from "src/model/contributions/repository";
import { profileRegistryContractAtom } from "./profileRegistryContract";
import { AccountInterface, Contract } from "starknet";
import { accountAtom } from "./starknet";

describe("The recoil state", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("when querying contributions", () => {
    it("uses the repository list function", async () => {
      const listSpy = vi.spyOn(contributionRepository, "list");

      const { result, waitForValueToChange } = renderHook(() => useRecoilValue(contributionsQuery), {
        wrapper: RecoilRoot,
      });

      expect(result.current).to.be.undefined;

      await waitForValueToChange(() => result.current);

      expect(listSpy).toHaveBeenCalled();
      expect(result.current).to.have.length(1);
    });
  });

  describe("when querying a single contribution", () => {
    it("uses the contributions cache", async () => {
      // TODO: make this test not depend on the previous one by clearing the recoil cache
      const listSpy = vi.spyOn(contributionRepository, "list");

      const existingId = "1";
      const { result } = renderHook(() => useRecoilValue(contributionQuery(existingId)), {
        wrapper: RecoilRoot,
      });

      // One can argue that this test also checks the cache ¯\_(ツ)_/¯
      expect(listSpy).not.toHaveBeenCalled();
      expect(result.current?.id).to.equal(existingId);
    });
  });

  describe("when querying a contribution application", () => {
    it("should match with an applicant", async () => {
      const contractMock = new Contract([], "0x00");

      const contractCallMock = vi.fn(() =>
        Promise.resolve([
          {
            contributor_id: { low: "0x26", high: "0x0" },
          },
        ])
      );

      contractMock.call = contractCallMock;

      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(profileRegistryContractAtom, contractMock);
        set(accountAtom, { address: "0x123456789" } as AccountInterface);
      });

      const result = snapshot.getLoadable(hasContributorAppliedToContributionSelector("1"));

      const res = (await result.contents) as Promise<boolean>;

      expect(contractCallMock).toHaveBeenCalledWith("get_user_information", ["0x123456789"]);
      expect(res).toBeTruthy();
    });

    it("should not match with a non applicant", async () => {
      const contractMock = new Contract([], "0x00");

      const contractCallMock = vi.fn(() =>
        Promise.resolve([
          {
            contributor_id: { low: "0x24", high: "0x0" },
          },
        ])
      );

      contractMock.call = contractCallMock;

      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(profileRegistryContractAtom, contractMock);
        set(accountAtom, { address: "0x123456789" } as AccountInterface);
      });

      const result = snapshot.getLoadable(hasContributorAppliedToContributionSelector("1"));

      const res = (await result.contents) as Promise<boolean>;

      expect(contractCallMock).toHaveBeenCalledWith("get_user_information", ["0x123456789"]);
      expect(res).toBeFalsy();
    });

    it("should not match when no contributor", async () => {
      const contractMock = new Contract([], "0x00");

      const contractCallMock = vi.fn(() => Promise.reject(new Error("contract.call error")));
      console.warn = vi.fn();

      contractMock.call = contractCallMock;

      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(profileRegistryContractAtom, contractMock);
        set(accountAtom, { address: "0x123456789" } as AccountInterface);
      });

      const result = snapshot.getLoadable(hasContributorAppliedToContributionSelector("1"));

      const res = (await result.contents) as Promise<boolean>;

      expect(console.warn).toHaveBeenCalledWith(new Error("contract.call error"));
      expect(contractCallMock).toHaveBeenCalledWith("get_user_information", ["0x123456789"]);
      expect(res).toBeFalsy();
    });
  });
});
