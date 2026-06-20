export enum views { HISTORY, STAGING }
export enum commitStages { MODIFIED, NEW, RENAMED, DELETED, IGNORED, UNTRACKED }

export interface FileInfo {
    path: string,
    status: string,
    is_ignored: boolean,
    is_staged: boolean,
}

export interface CommitInfo {
    hash: string;
    message: string;
    author: string;
    time: number;
}

export interface StatusMessage {
    message: string;
    destroyAuto: boolean;
}