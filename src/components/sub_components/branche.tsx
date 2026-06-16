import { CommitInfo } from "../../App";
import { invoke } from "@tauri-apps/api/core";

const branchColors: Record<number, { dot: string; bar: string }> = {
    1: { dot: "bg-branch-1", bar: "bg-branch-1" },
    2: { dot: "bg-branch-2", bar: "bg-branch-2" },
    3: { dot: "bg-branch-3", bar: "bg-branch-3" },
    4: { dot: "bg-branch-4", bar: "bg-branch-4" },
    5: { dot: "bg-branch-5", bar: "bg-branch-5" },
    6: { dot: "bg-branch-6", bar: "bg-branch-6" },
};

export default function Branch({ branchName, index, isSelected, setSelectedBranch, setCommit, repoPath, setUnpushedCommits }: { branchName: String, index: number, isSelected: boolean, setSelectedBranch: React.Dispatch<React.SetStateAction<number>>, setCommit: React.Dispatch<React.SetStateAction<CommitInfo[]>>, repoPath: string, setUnpushedCommits: React.Dispatch<React.SetStateAction<CommitInfo[]>> }) {
    const colorKey = (index % 6) || 6;
    const { dot, bar } = branchColors[colorKey];

    const handleClick = () => {
        setSelectedBranch(index);
        async function load() {
            const commits = await invoke<CommitInfo[]>("get_commits_with_branch", { path: repoPath, branch: branchName });
            setCommit(commits);
            let unpushedCommits = await invoke<CommitInfo[]>("get_unpushed_commits", { path: repoPath, branch: branchName });
            setUnpushedCommits(unpushedCommits);
        }
        load();
    }

    return (
        <div onClick={handleClick}
            className={`w-full h-9 gap-3 flex flex-row items-center cursor-pointer rounded-sm transition-all duration-100
            ${isSelected ? "bg-bg-elevated pl-0" : "pl-2 hover:bg-bg-elevated"}`}>
            {isSelected && <div className={`h-full w-0.5 rounded-r-sm shrink-0 ${bar}`} />}
            <div className={`rounded-full w-2 h-2 shrink-0 ${dot}`} />
            <span className={`text-sm font-mono truncate ${isSelected ? "text-text-primary font-semibold" : "text-text-secondary"}`}>
                {branchName}
            </span>
        </div>
    );
}
