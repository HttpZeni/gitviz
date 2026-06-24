import { create } from 'zustand'
import { CommitInfo, FileInfo, StatusMessage, ErrorInfo, SettingsInfo } from './utils/types'

interface AppState {
    repoPath: string
    userName: string
    token: string
    branches: string[]
    pushedCommits: CommitInfo[]
    unpushedCommits: CommitInfo[]
    selectedBranch: number
    selectedUnpushedCommit: string
    commitFileCache: Record<string, FileInfo[]>
    statusMessage: StatusMessage
    error: ErrorInfo
    selectedFile: FileInfo | null
    openSettings: boolean
    settingsInfos: SettingsInfo
    stagedFiles: FileInfo[]

    setRepoPath: (path: string) => void
    setUserName: (name: string) => void
    setToken: (token: string) => void
    setBranches: (branches: string[]) => void
    setPushedCommits: (commits: CommitInfo[]) => void
    setUnpushedCommits: (commits: CommitInfo[]) => void
    setSelectedBranch: (index: number) => void
    setSelectedUnpushedCommit: (hash: string) => void
    setCommitFileCache: (hash: string, file: FileInfo[]) => void
    setStatusMessage: (statusMessage: StatusMessage) => void
    setError: (error: ErrorInfo) => void
    setSelectedFile: (fileInfo: FileInfo | null) => void
    setOpenSettings: (bool: boolean) => void
    setSettingsInfos: (settingsInfo: SettingsInfo) => void
    setStageFiles: (files: FileInfo[]) => void
}

export const useStore = create<AppState>((set) => ({
    repoPath: "",
    userName: "",
    token: "",
    branches: [],
    pushedCommits: [],
    unpushedCommits: [],
    selectedBranch: 0,
    selectedUnpushedCommit: "",
    commitFileCache: {},
    statusMessage: { message: "", destroyAuto: false },
    error: { error: "", files: [] },
    selectedFile: null,
    openSettings: false,
    settingsInfos: { commitCacheSize: 50, commitLimit: 50, lazyLoading: false },
    stagedFiles: [],

    setRepoPath: (path) => set({ repoPath: path }),
    setUserName: (name) => set({ userName: name }),
    setToken: (token) => set({ token }),
    setBranches: (branches) => set({ branches }),
    setPushedCommits: (commits) => set({ pushedCommits: commits }),
    setUnpushedCommits: (commits) => set({ unpushedCommits: commits }),
    setSelectedBranch: (index) => set({ selectedBranch: index }),
    setSelectedUnpushedCommit: (hash) => { set({ selectedUnpushedCommit: hash}) },
    setCommitFileCache: (hash, files) => set(state => ({commitFileCache: {...state.commitFileCache, [hash]: files}})),
    setStatusMessage: (statusMessage: StatusMessage) => set({ statusMessage: {message: statusMessage.message, destroyAuto: statusMessage.destroyAuto}}),
    setError: (errorInfo: ErrorInfo) => set({ error: { error: errorInfo.error, files: errorInfo.files }}),
    setSelectedFile: (fileInfo: FileInfo | null) => set({ selectedFile: fileInfo  }),
    setOpenSettings: (bool: boolean) => set( {openSettings: bool} ),
    setSettingsInfos: ( settingsInfo: SettingsInfo ) => set({ settingsInfos: settingsInfo}),
    setStageFiles: (files) => set({ stagedFiles: files }),
}))