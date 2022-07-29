import config from "src/config";

import { ApplicationRepository, HasContributorAppliedToContributionParams } from "./repository";

export class FetchedApplicationRepository implements ApplicationRepository {
  public async hasContributorAppliedToContribution({
    contributionId,
    contributorId,
  }: HasContributorAppliedToContributionParams): Promise<boolean> {
    const endpointUrl = new URL(`${config.DATA_API_HOSTNAME}/contributions/${contributionId}/applications`);
    endpointUrl.searchParams.set("contributorId", contributorId.toString(10));

    const response = await fetch(endpointUrl.toString());

    return response.status === 200;
  }
}
