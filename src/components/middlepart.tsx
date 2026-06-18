import { CommitInfo } from "../App";
import CommitItem from "./sub_components/commititem";
import { useEffect, useState } from "react";
import { timeAgo } from "../utils";
import { FileInfo } from "../App";
import { invoke } from "@tauri-apps/api/core";
import EntryItem from "./sub_components/entryItem";
import UnpushedCommitItem from "./sub_components/unpushedcommititem";

enum views { HISTORY, STAGING }

export default function MiddlePart({ userName, token, branch, setCommits, commits, setSelectedCommit, repoPath, setUnpushedCommits, unpushedCommits }: { token: string, userName: string, branch: string, setCommits: React.Dispatch<React.SetStateAction<CommitInfo[]>>, commits: CommitInfo[], setSelectedCommit: React.Dispatch<React.SetStateAction<CommitInfo | undefined>>, repoPath: string, setUnpushedCommits: React.Dispatch<React.SetStateAction<CommitInfo[]>>, unpushedCommits: CommitInfo[] }) {
    const [selected, setSelected] = useState<string>("");
    const [selectedEntry, setSelectedEntry] = useState<FileInfo>();
    const [selectedView, setSelectedView] = useState<views>(views.HISTORY);
    const [stagingFile, setStagingFiles] = useState<FileInfo[]>([]);

    function handleClick(commit: CommitInfo) {
        async function load() {
            setSelected(commit.hash);
            setSelectedCommit(commit);
        }
        load();
    }

    function handleUnpushedCommitUpdate() {
        async function load() {
            let unpushedCommits = await invoke<CommitInfo[]>("get_unpushed_commits", { path: repoPath, branch: branch });
            setUnpushedCommits(unpushedCommits);
        }
        load();
    }

    async function loadEntries() {
        const files = await invoke<FileInfo[]>("get_entrys", { path: repoPath });
        setStagingFiles(files);
    }

    async function loadCommits() {
        const commits = await invoke<CommitInfo[]>("get_pushed_commits", { path: repoPath, branch: branch });
        setCommits(commits);
    }

    useEffect(() => {
        loadEntries()
    }, [repoPath])

    return (
        <div className="w-full h-full flex flex-col bg-bg-base">
            <div className="w-full h-16 bg-bg-surface">
                <div className="w-full h-full flex flex-row justify-start items-start shrink-0 px-3 border-b border-border">
                    <div onClick={() => setSelectedView(views.HISTORY)} className={`w-1/6 h-full flex flex-row gap-3 items-center justify-center ${selectedView === views.HISTORY ? "border-b-2" : "border-b-0"} border-accent text-md text-text-primary font-sans cursor-pointer`}>
                        History
                        <div className="rounded-full bg-accent px-3">{commits.length}</div>
                    </div>
                    <div onClick={() => setSelectedView(views.STAGING)} className={`w-1/6 h-full flex flex-row gap-3 items-center justify-center ${selectedView === views.STAGING ? "border-b-2" : "border-b-0"} border-accent text-md text-text-primary font-sans cursor-pointer`}>
                        Staging
                        <div className="rounded-full bg-accent px-3">{stagingFile.length}</div>
                    </div>
                </div>
            </div>
            {
                selectedView === views.HISTORY ? (
                    <div className="min-h-0 flex-1 p-3 flex flex-col gap-2 overflow-y-scroll">
                        {commits.length > 0 ? commits.map((commit, i) =>
                            <CommitItem key={i} repoPath={repoPath} branch={branch} userName={userName} token={token} onAction={() => { loadCommits(); handleUnpushedCommitUpdate(); }} hash={commit.hash} message={commit.message} author={commit.author} date={timeAgo(commit.time)} tags={[]} isSelected={selected === commit.hash} isFirst={i === 0} onClick={() => handleClick(commit)} />
                        ) : null}
                    </div>
                ) : (
                    <div className="min-h-0 flex-1 p-3 flex flex-col gap-2 overflow-y-scroll">
                        {stagingFile.length > 0 ? stagingFile.map((entry, i) =>
                            <EntryItem key={i} repoPath={repoPath} entryFile={entry} isSelected={selectedEntry === entry} onClick={() => setSelectedEntry(entry)} onAction={loadEntries} />
                        ) : null}
                    </div>
                )
            }
            <div className=" h-fit flex items-center justify-end p-3">
                <button
                    onClick={() => { selectedView === views.HISTORY ? loadCommits() : loadEntries() }}
                    className="w-40 py-2 border border-accent/30 bg-accent-subtle rounded-sm text-sm text-text-primary font-mono
                        cursor-pointer transition-all duration-100 hover:bg-accent hover:border-accent">
                    UPDATE
                </button>
            </div>
            {
                unpushedCommits.length > 0 ? (
                    <div className="w-full h-1/4 shrink-0 bg-bg-surface py-3 border-t border-border flex flex-col">
                        <div className="w-full h-8 flex flex-row justify-between gap-2 shrink-0 px-3">
                            <h2 className="text-sm text-text-secondary font-sans">UNPUSHED COMMITS</h2>
                            <h2 className="text-sm text-danger font-sans">{unpushedCommits.length} AHEAD</h2>
                        </div>
                        <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll px-3 pb-3">
                            {
                                unpushedCommits.map((commit, i) => (
                                    <UnpushedCommitItem key={i} onAction={handleUnpushedCommitUpdate} hash={commit.hash} message={commit.message} author={commit.author} date={timeAgo(commit.time)} tags={[]} isSelected={selected === commit.hash} isFirst={i === 0} isLast={i === unpushedCommits.length - 1} onClick={() => handleClick(commit)} repoPath={repoPath} branch={branch} userName={userName} token={token} />
                                ))
                            }
                        </div>
                        <div className="h-fit flex items-center justify-end p-3">
                            <button
                                onClick={() => handleUnpushedCommitUpdate()}
                                className="w-40 py-2 border border-accent/30 bg-accent-subtle rounded-sm text-sm text-text-primary font-mono
                        cursor-pointer transition-all duration-100 hover:bg-accent hover:border-accent">
                                UPDATE UNPUSHED COMMITS
                            </button>
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
}