import { CommitInfo } from "../../App";
import { invoke } from "@tauri-apps/api/core";

export default function Branch({ branchName, index, isSelected, setSelectedBranch, setCommit, repoPath }: { branchName: String, index: number, isSelected: boolean, setSelectedBranch: React.Dispatch<React.SetStateAction<number>>, setCommit: React.Dispatch<React.SetStateAction<CommitInfo[]>>, repoPath: string }) {
    const color = `branch-${(index % 6) || 6}`;

    const handleClick = () => {
        setSelectedBranch(index);
        async function load(){
            const commits = await invoke<CommitInfo[]>("get_commits_with_branch", { path: repoPath, branch: branchName });
            setCommit(commits);
        }
        load();
    }

    return (
        <div onClick={handleClick}
            className={`w-full h-10 flex items-center justify-center cursor-pointer
        ${isSelected ? `bg-${color}` : `bg-${color}/15`} rounded-sm transition-all duration-100
        hover:bg-${color}/80 hover:text-text-primary hover:scale-[102%]
        text-sm ${isSelected ? "text-text-primary" : "text-text-secondary"} font-sans font-semibold`}>
            {branchName}
        </div>
    )
}