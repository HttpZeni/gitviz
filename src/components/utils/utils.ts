import { FileInfo, CommitInfo } from "./types";
import { useStore } from "../store";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export function timeAgo(unixSeconds: number | undefined): string {
    if (unixSeconds == undefined) return "";
    const diff = Date.now() / 1000 - unixSeconds;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(unixSeconds * 1000).toLocaleDateString();
}

export const conventionalCommitsConfig: Record<string, { value: string; desc: string }> = {
    'FEAT': { value: "feat:", desc: "A new feature" },
    'FIX': { value: "fix:", desc: "Bugfix" },
    'CHORE': { value: "chore:", desc: "maintenance task" },
    'REFACTOR': { value: "refactor:", desc: "code restructure, no behavior change" },
    'DOCS': { value: "docs:", desc: "documentation only" },
    'STYLE': { value: "style:", desc: "formatting, no logic change" },
    'TEST': { value: "test:", desc: " adding or updating tests" },
    'PERF': { value: "perf:", desc: "performance improvement" },
    'NONE': { value: "", desc: ""}
}

export const stageConfig: Record<string, { bg: string; text: string; short: string; label: string }> = {
    "ADDED": { bg: "bg-success", text: "text-success", short: "A", label: "ADDED" },
    "MODIFIED": { bg: "bg-warning", text: "text-warning", short: "M", label: "MODIFIED" },
    "RENAMED": { bg: "bg-warning", text: "text-warning", short: "R", label: "RENAMED" },
    "DELETED": { bg: "bg-danger", text: "text-danger", short: "D", label: "DELETED" },
    "IGNORED": { bg: "bg-text-muted", text: "text-text-muted", short: "I", label: "IGNORED" },
    "UNTRACKED": { bg: "bg-text-muted", text: "text-text-muted", short: "U", label: "UNTRACKED" },
};

export const statusConfig: Record<string, { label: string; short: string; className: string }> = {
    STAGED: { short: "S", label: "STAGED", className: "bg-success/15 text-success" },
    UNTRACKED: { short: "U", label: "UNTRACKED", className: "bg-text-muted/15 text-text-muted" },
    MODIFIED: { short: "M", label: "MODIFIED", className: "bg-warning/15 text-warning" },
    DELETED: { short: "D", label: "DELETED", className: "bg-danger/15 text-danger" },
    IGNORED: { short: "I", label: "IGNORED", className: "bg-text-muted/15 text-text-muted" },
    UNKNOWN: { short: "?", label: "UNKNOWN", className: "bg-text-muted/15 text-text-muted" },
};

export const branchColors: Record<number, { dot: string; bar: string }> = {
    1: { dot: "bg-branch-1", bar: "bg-branch-1" },
    2: { dot: "bg-branch-2", bar: "bg-branch-2" },
    3: { dot: "bg-branch-3", bar: "bg-branch-3" },
    4: { dot: "bg-branch-4", bar: "bg-branch-4" },
    5: { dot: "bg-branch-5", bar: "bg-branch-5" },
    6: { dot: "bg-branch-6", bar: "bg-branch-6" },
};

export async function setNewRepoPath(){
    const path = await open({ directory: true, multiple: false });
    if (path) {
        useStore.getState().setRepoPath((path as string).replaceAll("\\", "/"));
    }
}

export function get_repo_name(): string{
    const {repoPath} = useStore.getState();
    const name = repoPath.split("/").at(-1);
    return name == undefined ? "" : name;
}

export function get_inital_branch(): string {
    const { branches, selectedBranch } = useStore.getState();
    return branches[selectedBranch] ?? branches[0];
}
export async function get_branches(): Promise<string[]>{
    const { repoPath } = useStore.getState();
    return await invoke<string[]>("get_branches", { path: repoPath });
}
export async function get_pushed_commits(): Promise<CommitInfo[]>{
    const { repoPath } = useStore.getState();
    return await invoke<CommitInfo[]>("get_pushed_commits", { path: repoPath, branch: get_inital_branch() });
}
export async function get_unpushed_commits(): Promise<CommitInfo[]>{
    const { repoPath } = useStore.getState();
    return await invoke<CommitInfo[]>("get_unpushed_commits", { path: repoPath, branch: get_inital_branch() });
}
export async function get_commits_with_branch(): Promise<CommitInfo[]>{
    const { repoPath, branches, selectedBranch } = useStore.getState();
    const currentBranch = branches[selectedBranch];
    return await invoke<CommitInfo[]>("get_commits_with_branch", { path: repoPath, branch: currentBranch });
}
export async function get_entrys(): Promise<FileInfo[]>{
    const { repoPath } = useStore.getState();
    return await invoke<FileInfo[]>("get_entrys", { path: repoPath });
}
export async function get_commit_files(hash: string): Promise<FileInfo[]>{
    const { repoPath } = useStore.getState();
    return await invoke<FileInfo[]>("get_commit_files", { path: repoPath, hash: hash });
}
export async function make_commit(commitMessage: string){
    const { repoPath } = useStore.getState();
    await invoke("make_commit", { path: repoPath, message: commitMessage });
}
export async function undo_pushed_commit(){
    const { repoPath, userName, token, branches, selectedBranch } = useStore.getState();
    const currentBranch = branches[selectedBranch];
    await invoke("undo_pushed_commit", { path: repoPath, branch: currentBranch, username: userName, token: token });
}
export async function git_add_stage(entryFile: FileInfo){
    const { repoPath } = useStore.getState();
    await invoke("git_add", { path: repoPath, filePath: entryFile.path });
}
export async function git_pull(){
    const { repoPath, userName, token } = useStore.getState();
    await invoke("git_pull", {path: repoPath, userName: userName, token: token})
}
export async function git_remove_stage(entryFile: FileInfo){
    const { repoPath } = useStore.getState();
    await invoke("git_remove", { path: repoPath, filePath: entryFile.path });
}
export async function git_push_commit(hash: string){
    const { repoPath, userName, token, branches, selectedBranch } = useStore.getState();
    const currentBranch = branches[selectedBranch];
    await invoke("git_push_commit", { path: repoPath, branch: currentBranch, username: userName, token: token, commitHash: hash })
}
export async function git_remove_unpushed_commit(hash: string){
    const { repoPath } = useStore.getState();
    await invoke("remove_unpushed_commit", { path: repoPath, hash: hash })
}
export async function git_add_all(){
    const { repoPath } = useStore.getState();
    await invoke("add_all", {path: repoPath});
}
export async function git_unstage_all(){
    const { repoPath } = useStore.getState();
    await invoke("unstage_all", {path: repoPath});
}