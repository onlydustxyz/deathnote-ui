import { FC } from "react";
import cn from "classnames";

import { Contribution, ContributionStatusEnum } from "src/model/contributions/repository";
import AppliedBadge from "./AppliedBadge";
import AssignedBadge from "./AssignedBadge";
import CompletedBadge from "./CompletedBadge";
import GatedBadge from "./GatedBadge";
import OpenBadge from "./OpenBadge";

type Props = {
  gated: boolean;
  status: Contribution["status"];
  className?: string;
  applied: boolean;
};

const ContributionStatus: FC<Props> = ({ applied, className, gated, status }) => {
  const statusLabel = computeStatusLabel();

  const statusClassName = computeStatusClassName();

  return (
    <div className={cn(className, "flex flex-row items-center")}>
      {renderBadge()}
      <div className={cn("ml-2.5 text-xs", statusClassName)}>{statusLabel}</div>
    </div>
  );

  function renderBadge() {
    switch (status) {
      case ContributionStatusEnum.OPEN:
        return applied ? <AppliedBadge /> : gated ? <GatedBadge /> : <OpenBadge />;
      case ContributionStatusEnum.ASSIGNED:
        return <AssignedBadge />;
      case ContributionStatusEnum.COMPLETED:
        return <CompletedBadge />;
    }
  }

  function computeStatusLabel() {
    if (status === ContributionStatusEnum.OPEN) {
      if (applied) {
        return "APPLIED";
      }

      if (gated) {
        return "GATED";
      }
    }

    return status;
  }

  function computeStatusClassName() {
    return status === ContributionStatusEnum.OPEN && !gated ? "text-white" : "text-white/50";
  }
};

export default ContributionStatus;
