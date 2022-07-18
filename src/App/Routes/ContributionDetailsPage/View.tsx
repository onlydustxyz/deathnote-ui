import { FC } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import "github-markdown-css/github-markdown-dark.css";

import BackButton from "src/components/BackButton";
import { Contribution, ContributionStatusEnum } from "src/model/contributions/repository";
import logoPlaceholder from "src/assets/img/project-logo-placeholder.png";
import Button from "src/components/Button";
import StatusHeader from "./StatusHeader";
import MetadataList from "./MetadataList";

type Props = {
  apply: () => void;
  contribution?: Contribution;
};

const ContributionDetailsPage: FC<Props> = ({ apply, contribution }) => {
  if (!contribution) {
    return null;
  }

  const content = `# test h1 title\r\n## Test h2 title\r\n${contribution.description}`;

  const isApplicable = ContributionStatusEnum.OPEN === contribution.status && contribution.eligible !== false;

  return (
    <div className="relative mt-10 px-8 flex flex-col items-center max-w-screen-2xl w-full">
      <div className="flex flex-row max-w-[1410px] w-full justify-start">
        <BackButton />

        <div className="relative flex flex-col items-center px-12 max-w-screen-xl w-full">
          <StatusHeader contribution={contribution} />
        </div>
      </div>
      <div className="relative flex flex-col items-center px-12 max-w-screen-xl w-full">
        <div className="mt-8 mx-12 font-alfreda text-[52px] leading-[68px] capitalize text-center">
          {contribution.title}
        </div>
        <div className="mt-8 flex flex-col items-center">
          <Link to={`/projects/${contribution.project.id}`}>
            <img className="rounded-full" src={contribution.project.logo || logoPlaceholder} width={54} />
          </Link>
          <span className="mt-5 text-light-purple/66 text-[11px] leading-[14px] uppercase">Proposed by</span>
          <Link
            className="mt-2 font-medium text-white text-[28px] leading-[34px] capitalize"
            to={`/projects/${contribution.project.id}`}
          >
            {contribution.project.title}
          </Link>
        </div>
        <MetadataList contribution={contribution} className="mt-10 w-full" />
      </div>

      <div className="mb-32 flex flex-col items-center max-w-screen-xl px-20 w-full shadow-contribution-description">
        <div className="p-20 bg-mid-blue/30 backdrop-blur-[7px] w-full">
          <ReactMarkdown className="markdown-body" children={content} />
        </div>
      </div>
      <div className="fixed bottom-0 w-full h-[158px] pt-[48px] flex flex-col items-center justify-stretch bg-contribution-apply-gradient">
        <Button onClick={apply} disabled={!isApplicable}>
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ContributionDetailsPage;
