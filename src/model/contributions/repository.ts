import { InMemoryContributionRepository } from "./in-memory-repository";
import { FetchedContributionRepository } from "./fetched-repository";

export type Project = {
  id: string;
  title: string;
  description: string;
  logo?: string;
  openedContributionsAmount: number;
  github_link?: string;
  discord_link?: string;
  website_link?: string;
};

export type ContributionBase = {
  id: string;
  title: string;
  description: string;
  project: Project;
  github_link: string;
  eligible: boolean | null;
  gate: number;
  gateMissingCompletedContributions: number;
};

export enum ContributionStatusEnum {
  OPEN = "OPEN",
  ASSIGNED = "ASSIGNED",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
}

export enum ContributionContextEnum {
  ISOLATED = "isolated",
  COUPLED = "coupled",
  INTRICATED = "intricated",
}

export enum ContributionDifficultyEnum {
  EASY = "easy",
  INTERMEDIATE = "intermediate",
  HARD = "hard",
}

export enum ContributionDurationEnum {
  UNDER_A_DAY = "under a day",
  FEW_DAYS = "few days",
  WEEKS = "weeks",
}

export enum ContributionTypeEnum {
  BUG = "bug",
  BUILD = "build",
  DOCUMENTATION = "documentation",
  FEATURE = "feature",
  PRFOMANCE = "performance",
  REFACTOR = "refactor",
  TEST = "test",
}

export type Contribution = ContributionBase & ContributionStatusAndMetadata;

export type ContributionStatusAndMetadata = OpenStatus | AssignedStatus | CompletedStatus;
export type OpenContribution = Contribution & OpenStatus;
export type AssignedContribution = Contribution & AssignedStatus;
export type CompletedContribution = Contribution & CompletedStatus;

export type ContributionMetadata = {
  context?: ContributionContextEnum;
  difficulty?: ContributionDifficultyEnum;
  duration?: ContributionDurationEnum;
  technology?: string;
  type?: ContributionTypeEnum;
};

export type ContributionMetadataAssignee = {
  assignee: string;
  github_username?: string;
};

type OpenStatus = {
  status: ContributionStatusEnum.OPEN;
  metadata: ContributionMetadata;
};

type AssignedStatus = {
  status: ContributionStatusEnum.ASSIGNED;
  metadata: ContributionMetadata & ContributionMetadataAssignee;
};

type CompletedStatus = {
  status: ContributionStatusEnum.COMPLETED;
  metadata: ContributionMetadata & ContributionMetadataAssignee;
};

export type ListParams = {
  contributorId?: number;
};
export interface ContributionRepository {
  list(params?: ListParams): Promise<Contribution[]>;
}

export const contributionRepository: ContributionRepository =
  process.env.NODE_ENV === "test" ? new InMemoryContributionRepository() : new FetchedContributionRepository();
