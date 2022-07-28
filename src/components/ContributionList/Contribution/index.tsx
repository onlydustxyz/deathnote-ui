import { FC } from "react";
import cn from "classnames";

import Difficulty from "src/icons/Difficulty";
import Technology from "src/icons/Technology";
import { Contribution as ContributionType, ContributionStatusEnum } from "src/model/contributions/repository";
import ContributionStatus from "../../ContributionStatus";

type Props = { contribution: ContributionType };

const Contribution: FC<Props> = ({ contribution }) => {
  const cardClassName =
    contribution.status !== ContributionStatusEnum.OPEN
      ? "bg-mid-blue/15 hover:bg-mid-blue/40"
      : "bg-mid-blue/30 hover:bg-mid-blue/40";

  const cardContentClassName = contribution.status !== ContributionStatusEnum.OPEN ? "opacity-50" : "";

  return (
    <div
      className={cn(
        "group h-[424px] backdrop-blur-[7px] shadow-2xl shadow-black hover:translate-y-[-14px] hover:rotate-[-1deg]",
        cardClassName
      )}
    >
      <div className={cn("h-full flex flex-col", cardContentClassName)}>
        <div className="h-[72px] grid grid-cols-2 items-center uppercase mx-8">
          <ContributionStatus status={contribution.status} gated={contribution.eligible === false} applied={false} />
        </div>
        <div className="grow flex flex-col justify-center mb-8">
          <h2 className="font-alfreda text-3xl leading-[42px] text-center px-8 line-clamp-4">{contribution.title}</h2>
        </div>

        <div className="flex flex-col items-center mb-4">
          <span className="text-light-purple/66 uppercase text-[10px] tracking-widest	">Project</span>
          <span>{contribution.project.title}</span>
        </div>
        <div className="relative h-[80px] grid grid-cols-2 items-center text-center text-xl bg-mid-blue/20 group-hover:bg-mid-blue/40">
          <div className="flex flex-col items-center">
            <Difficulty size={18} className="fill-light-blue" />
            <div className="capitalize mt-2.5 font-medium">{contribution.metadata.difficulty || "-"}</div>
          </div>
          <div className="flex flex-col items-center">
            <Technology size={18} className="fill-light-blue" />
            <div className="capitalize mt-2.5 font-medium">{contribution.metadata.technology || "-"}</div>
          </div>
          {renderDivider()}
        </div>
      </div>
    </div>
  );

  function renderDivider() {
    return (
      <svg
        width="2"
        height="44"
        viewBox="0 0 2 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-[50%]"
      >
        <path d="M1 0L1 44" stroke="#EBDDFF" strokeOpacity="0.33" strokeLinejoin="round" strokeDasharray="1 4" />
      </svg>
    );
  }
};

export default Contribution;
