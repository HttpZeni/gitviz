export enum views { HISTORY, STAGING }
export enum commitStages { MODIFIED, NEW, RENAMED, DELETED, IGNORED, UNTRACKED }
export const conventionalCommits: string[] = [
    'FEAT', 
    'FIX', 
    'CHORE', 
    'REFACTOR', 
    'DOCS', 
    'STYLE', 
    'TEST', 
    'PERF', 
    'NONE' 
]

export interface SettingsInfo{
    commitLimit: number
    commitCacheSize: number
    lazyLoading: boolean
}

export interface ErrorInfo{
    error: string,
    files?: FileInfo[],
}

export interface FileInfo {
    path: string,
    status: string,
    diffs: string[],
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