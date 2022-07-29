import { InMemoryApplicationRepository } from "./in-memory-repository";
import { FetchedApplicationRepository } from "./fetched-repository";
import { Contribution } from "../contributions/repository";

export type HasContributorAppliedToContributionParams = {
  contributionId: Contribution["id"];
  contributorId: number;
};
export interface ApplicationRepository {
  hasContributorAppliedToContribution(params: HasContributorAppliedToContributionParams): Promise<boolean>;
}

export const applicationRepository: ApplicationRepository =
  process.env.NODE_ENV === "test" ? new InMemoryApplicationRepository() : new FetchedApplicationRepository();
