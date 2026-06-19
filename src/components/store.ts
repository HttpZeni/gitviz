import { create } from 'zustand'
import { CommitInfo, FileInfo } from './utils/types'

interface AppState {
    repoPath: string
    userName: string
    token: string
    branches: string[]
    pushedCommits: CommitInfo[]
    unpushedCommits: CommitInfo[]
    selectedBranch: number
    selectedUnpushedCommit: string
    stagedFiles: FileInfo[]

    setRepoPath: (path: string) => void
    setUserName: (name: string) => void
    setToken: (token: string) => void
    setBranches: (branches: string[]) => void
    setPushedCommits: (commits: CommitInfo[]) => void
    setUnpushedCommits: (commits: CommitInfo[]) => void
    setSelectedBranch: (index: number) => void
    setSelectedUnpushedCommit: (hash: string) => void
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
    stagedFiles: [],

    setRepoPath: (path) => set({ repoPath: path }),
    setUserName: (name) => set({ userName: name }),
    setToken: (token) => set({ token }),
    setBranches: (branches) => set({ branches }),
    setPushedCommits: (commits) => set({ pushedCommits: commits }),
    setUnpushedCommits: (commits) => set({ unpushedCommits: commits }),
    setSelectedBranch: (index) => set({ selectedBranch: index }),
    setSelectedUnpushedCommit: (hash) => { set({ selectedUnpushedCommit: hash}) },
    setStageFiles: (files) => set({ stagedFiles: files }),
}))