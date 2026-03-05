export interface ResoniteRecord {
  id: string;
  ownerId: string;
  assetUri?: string;
  globalVersion: number;
  localVersion: number;
  lastModifyingUserId?: string;
  lastModifyingMachineId?: string;
  name: string;
  description?: string;
  recordType: RecordType;
  ownerName?: string;
  tags?: string[];
  path?: string;
  thumbnailUri?: string;
  isPublic: boolean;
  isForPatrons: boolean;
  isListed: boolean;
  isDeleted: boolean;
  lastModificationTime: string;
  creationTime: string;
  firstPublishTime?: string;
  visits: number;
  rating: number;
  randomOrder: number;
  submissions?: Submission[];
  neosDBmanifest?: NeosDBAsset[];
}

export type RecordType = "world" | "object" | "directory" | "link" | "texture" | "audio";

export interface Submission {
  id: string;
  ownerId: string;
  targetRecordId: string;
  submissionTime: string;
  submittedById: string;
  featuredByUserId?: string;
  featuredTimestamp?: string;
}

export interface NeosDBAsset {
  hash: string;
  bytes: number;
}

export interface RecordDirectory {
  path: string;
  name: string;
  records: ResoniteRecord[];
  subdirectories: string[];
}
