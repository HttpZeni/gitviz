import { useEffect, useState } from "react";
import { FileInfo, CommitInfo } from "../App";
import Commit from "./sub_components/commit";
import { commitStages } from "./sub_components/commit";
import { invoke } from "@tauri-apps/api/core";
import { timeAgo } from "../utils";


export default function RightSideBar({ selectedCommit, repoPath, files, setFiles, setUnpushedCommits, currentBranch }: { selectedCommit: CommitInfo | undefined, repoPath: string, files: FileInfo[], setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>, setUnpushedCommits: React.Dispatch<React.SetStateAction<CommitInfo[]>>, currentBranch: string }) {
    const [commitMessage, setCommitMessage] = useState<string>("");
    
    function GetCommitStage(status: string): commitStages {
        switch (status) {
            case "ADDED": return commitStages.NEW;
            case "DELETED": return commitStages.DELETED;
            case "RENAMED": return commitStages.RENAMED;
            case "MODIFIED": return commitStages.MODIFIED;
            case "IGNORED": return commitStages.IGNORED;
            default: return commitStages.UNTRACKED;
        }
    }

    function handleCommitInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setCommitMessage(e?.target.value);
    }
 
    const handleCommitButton = () => {
        if (!selectedCommit?.hash) return;
        async function load(){
            await invoke("make_commit", {path: repoPath, message: commitMessage});
            let unpushedCommits = await invoke<CommitInfo[]>("get_unpushed_commits", {path: repoPath, branch: currentBranch});
            setUnpushedCommits(unpushedCommits);
            setCommitMessage("");
        }
        load();
    }

    useEffect(() => {
        async function load() {
            const files = await invoke<FileInfo[]>("get_commit_files", { path: repoPath, hash: selectedCommit?.hash });
            console.log(files);
            setFiles(files);
        }
        load();
    }, [selectedCommit])

    return(
        <div className="w-full h-full bg-bg-surface flex flex-col overflow-x-hidden">
            <div className="w-full h-fit flex flex-col gap-2 p-3">
                <h2 className="text-md text-text-secondary font-mono font-semibold">COMMIT</h2>
                <h1 className="text-2xl text-text-primary font-sans">{selectedCommit?.message}</h1>
                <div>
                    <p className="text-sm text-text-muted font-mono font-semibold">{selectedCommit?.hash.slice(0, 7)}.. - {selectedCommit?.author}</p>
                    <p className="text-sm text-text-muted font-mono font-semibold">{timeAgo(selectedCommit?.time)}</p>
                </div>
            </div>
            <div className="w-full h-full flex flex-col gap-3 p-3 overflow-y-scroll">
                <h2 className="mt-3 text-md text-text-secondary font-mono font-semibold">CHANGED FILES</h2>
                {files.length > 0 ? files.map((file, i) => 
                    <Commit key={i} stage={GetCommitStage(file.status)} dir={file.path} />
                ) : null} 
            </div>
            <div className="w-full h-60 flex flex-col items-start justify-between p-3">
                <h2 className="mt-3 text-md text-text-secondary font-mono font-semibold">STAGE & COMMIT</h2>
                <div className="w-full h-2/3 flex flex-col gap-2 justify-between">
                    <input type="text" placeholder="Type your commit message here.." value={commitMessage} onChange={handleCommitInputChange}
                    className="w-full h-3/6 p-3 
                    outline-none border border-border
                    bg-bg-base rounded-sm text-text-primary font-mono font-semibold
                    placeholder:text-text-muted text-lg" />
                    <button onClick={handleCommitButton} className="w-full h-3/6 bg-accent-subtle rounded-sm text-md text-text-primary font-mono font-semibold cursor-pointer transition-all duration-100 hover:bg-accent">Commit Staged</button>
                </div>
            </div>
        </div>
    );
}