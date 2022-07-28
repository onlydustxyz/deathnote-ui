import { useParams } from "react-router-dom";
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE, useSetRecoilState } from "recoil";
import ContributionDetailsPage from "./View";
import {
  accountAtom,
  contributionQuery,
  displayRegisterModalAtom,
  hasContributorAppliedToContributionSelector,
  isGithubRegisteredSelector,
  userContributorIdSelector,
  userGithubHandleSelector,
} from "src/state";
import { FC, useCallback } from "react";
import config from "src/config";

type PageParams = {
  contributionId: string;
};
const ContributionDetailsPageContainer: FC = () => {
  const { contributionId } = useParams<PageParams>();
  const contribution = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(contributionQuery(contributionId));
  const contributorId = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(userContributorIdSelector);
  const account = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(accountAtom);
  const isGithubRegistered = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(isGithubRegisteredSelector);
  const userGithubHandle = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(userGithubHandleSelector);
  const setDisplayRegisterModal = useSetRecoilState(displayRegisterModalAtom);
  const hasAppliedToContribution = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(
    hasContributorAppliedToContributionSelector(contributionId)
  );

  const buildTypeformParams = () => {
    const typeformParams = new URLSearchParams();
    account?.address && typeformParams.set("wallet", account.address);
    userGithubHandle && typeformParams.set("github", userGithubHandle.toString(10));
    contribution?.github_link && typeformParams.set("githubissue", contribution.github_link);
    contributorId && typeformParams.set("contributorid", contributorId.toString(10));

    return typeformParams.toString();
  };

  const apply = useCallback(() => {
    if (!isGithubRegistered) {
      setDisplayRegisterModal(true);
      return;
    }

    const applyUrl = `${config.TYPEFORM_APPLY_URL}#${buildTypeformParams()}`;

    window.open(applyUrl, "_blank");
  }, [contributionId, isGithubRegistered]);

  const submit = useCallback(() => {
    const submitUrl = `${config.TYPEFORM_SUBMIT_URL}#${buildTypeformParams()}`;

    window.open(submitUrl, "_blank");
  }, [contributionId, isGithubRegistered]);

  if (!contribution) {
    return null;
  }

  return (
    <ContributionDetailsPage
      contribution={contribution}
      apply={apply}
      submit={submit}
      contributorId={contributorId}
      hasAppliedToContribution={hasAppliedToContribution}
    />
  );
};

export default ContributionDetailsPageContainer;
