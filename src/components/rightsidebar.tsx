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

    const handleCommitButton = () => {
        if (!selectedCommit?.hash) return;
        async function load() {
            await invoke("make_commit", { path: repoPath, message: commitMessage });
            let unpushedCommits = await invoke<CommitInfo[]>("get_unpushed_commits", { path: repoPath, branch: currentBranch });
            setUnpushedCommits(unpushedCommits);
            setCommitMessage("");
        }
        load();
    }

    useEffect(() => {
        async function load() {
            const files = await invoke<FileInfo[]>("get_commit_files", { path: repoPath, hash: selectedCommit?.hash });
            setFiles(files);
        }
        load();
    }, [selectedCommit])

    return (
        <div className="w-full h-full bg-bg-surface flex flex-col overflow-hidden border-l border-border">

            <div className="shrink-0 flex flex-col gap-2 p-4 border-b border-border">
                <p className="text-[10px] font-mono tracking-widest text-text-muted uppercase">selected commit</p>
                <p className="text-base font-sans font-semibold text-text-primary leading-snug line-clamp-2">
                    {selectedCommit?.message ?? "—"}
                </p>
                <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-mono text-text-muted">
                        <span className="text-accent">{selectedCommit?.hash.slice(0, 7)}</span>
                    </p>
                    <p className="text-xs font-mono text-text-muted">
                        {selectedCommit?.author} · {timeAgo(selectedCommit?.time)}
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-1">
                <p className="text-[10px] font-mono tracking-widest text-text-muted uppercase mb-2">changed files</p>
                {files.map((file, i) =>
                    <Commit key={i} stage={GetCommitStage(file.status)} dir={file.path} />
                )}
            </div>

            <div className="shrink-0 flex flex-col gap-2 p-3 border-t border-border">
                <p className="text-[10px] font-mono tracking-widest text-text-muted uppercase">stage &amp; commit</p>
                <textarea
                    placeholder="commit message…"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full h-20 p-2.5 resize-none outline-none border border-border focus:border-accent
                    bg-bg-base rounded-sm text-text-primary font-mono text-sm
                    placeholder:text-text-muted transition-colors duration-100" />
                <button
                    onClick={handleCommitButton}
                    className="w-full py-2 border border-accent/30 bg-accent-subtle rounded-sm text-sm text-text-primary font-mono
                    cursor-pointer transition-all duration-100 hover:bg-accent hover:border-accent">
                    COMMIT STAGED
                </button>
            </div>
        </div>
    );
}
