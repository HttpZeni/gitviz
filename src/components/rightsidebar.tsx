import { useEffect } from "react";
import { FileInfo, CommitInfo } from "../App";
import Commit from "./sub_components/commit";
import { commitStages } from "./sub_components/commit";
import { invoke } from "@tauri-apps/api/core";
import { timeAgo } from "../utils";


export default function RightSideBar({ selectedCommit, repoPath, files, setFiles }: { selectedCommit: CommitInfo | undefined, repoPath: string, files: FileInfo[], setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>> }) {
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

    useEffect(() => {
        async function load() {
            const files = await invoke<FileInfo[]>("get_commit_files", { repoPath: repoPath, hash: selectedCommit?.hash });
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
                {files.length > 0 ? files.map(file => 
                    <Commit stage={GetCommitStage(file.status)} dir={file.path} />
                ) : null} 
            </div>
            <div className="w-full h-48 flex flex-col items-start justify-between p-3">
                <h2 className="mt-3 text-md text-text-secondary font-mono font-semibold">STAGE & COMMIT</h2>
                <button className="w-full h-2/6 bg-accent-subtle rounded-sm text-md text-text-primary font-mono font-semibold cursor-pointer">Commit Staged</button>
            </div>
        </div>
    );
}