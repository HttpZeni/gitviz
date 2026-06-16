import Branch from "./sub_components/branche";
import { CommitInfo } from "../App";
import { open } from "@tauri-apps/plugin-dialog";

export default function LeftSideBar({ repoName, branches, setCommit, repoPath, setRepoPath, setSelectedBranch, selectedBranch, setUnpushedCommits }: { repoName: string | undefined, branches: string[], setCommit: React.Dispatch<React.SetStateAction<CommitInfo[]>>, repoPath: string, setRepoPath: React.Dispatch<React.SetStateAction<string>>, setSelectedBranch: React.Dispatch<React.SetStateAction<number>>, selectedBranch: number, setUnpushedCommits: React.Dispatch<React.SetStateAction<CommitInfo[]>> }){
    const handleClick = () => {
        async function load(){
            const path = await open({ directory: true, multiple: false });
            if (path) {
                setRepoPath((path as string).replaceAll("\\", "/"));
            }
        }
        load();
    }

    return(
        <div className="w-full h-full bg-bg-surface flex flex-col">
            <div className="w-full h-fit flex flex-col gap-2 p-3">
                <h2 className="text-md text-text-secondary font-mono font-semibold">REPOSITORY</h2>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl text-text-primary font-sans font-bold">{repoName != undefined ? `${repoName}` : "None"}</h1>
                    <button className="w-2/6 h-full bg-accent rounded-sm text-md text-text-primary font-mono font-semibold cursor-pointer" onClick={handleClick}>Change Repo</button>
                </div>
            </div>
            <div className="w-full h-full flex flex-col gap-3 p-3">
                <h2 className="mt-3 text-md text-text-secondary font-mono font-semibold">BRANCHES</h2>
                {branches.map((branch, i) => (
                    <Branch key={i} branchName={branch.toString()} index={i} isSelected={selectedBranch === i} setSelectedBranch={setSelectedBranch} setCommit={setCommit} repoPath={repoPath} setUnpushedCommits={setUnpushedCommits}/>
                ))}
            </div>
            <div className="w-full h-48 flex items-end justify-center p-3">
                <button className="w-full h-2/6 bg-accent rounded-sm text-md text-text-primary font-mono font-semibold cursor-pointer">Push</button>
            </div>
        </div>
    );
}