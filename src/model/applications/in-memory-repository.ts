import { Contribution } from "../contributions/repository";
import { ApplicationRepository, HasContributorAppliedToContributionParams } from "./repository";

export class InMemoryApplicationRepository implements ApplicationRepository {
  private contributionsApplications: Record<Contribution["id"], Set<number>> = {
    "1": new Set([38]),
    "3": new Set([1]),
  };

  public async hasContributorAppliedToContribution({
    contributionId,
    contributorId,
  }: HasContributorAppliedToContributionParams) {
    return this.contributionsApplications[contributionId]?.has(contributorId);
  }
}
