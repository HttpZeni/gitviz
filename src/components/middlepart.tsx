import { CommitInfo } from "../App";
import CommitItem from "./sub_components/commititem";
import { useEffect, useState } from "react";
import { timeAgo } from "../utils";
import { FileInfo } from "../App";
import { invoke } from "@tauri-apps/api/core";
import EntryItem from "./sub_components/entryItem";

enum views { HISTORY, STAGING }

export default function MiddlePart({ setCommits, commits, setSelectedCommit, repoPath, unpushedCommits }: { setCommits: React.Dispatch<React.SetStateAction<CommitInfo[]>>, commits: CommitInfo[], setSelectedCommit: React.Dispatch<React.SetStateAction<CommitInfo | undefined>>, repoPath: string, unpushedCommits: CommitInfo[] }) {
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

    async function loadEntries() {
        const files = await invoke<FileInfo[]>("get_entrys", { path: repoPath });
        setStagingFiles(files);
    }

    async function loadCommits() {
        const commits = await invoke<CommitInfo[]>("get_commits", { path: repoPath });
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
                    <div className="min-h-0 flex-1 p-3 flex flex-col gap-2">
                        {commits.length > 0 ? commits.map((commit, i) =>
                            <CommitItem key={i} hash={commit.hash} message={commit.message} author={commit.author} date={timeAgo(commit.time)} tags={[]} isSelected={selected === commit.hash} isFirst={i === 0} onClick={() => handleClick(commit)} />
                        ) : null}
                    </div>
                ) : (
                    <div className="min-h-0 flex-1 p-3 flex flex-col gap-2">
                        {stagingFile.length > 0 ? stagingFile.map((entry, i) =>
                            <EntryItem key={i} repoPath={repoPath} entryFile={entry} isSelected={selectedEntry === entry} onClick={() => setSelectedEntry(entry)} onAction={loadEntries} />
                        ) : null}
                    </div>
                )
            }
            <div className="w-full h-fit flex items-center justify-end p-3">
                <button
                    onClick={() => { selectedView === views.HISTORY ? loadCommits() : loadEntries()}}
                    className="w-40 py-2 border border-accent/30 bg-accent-subtle rounded-sm text-sm text-text-primary font-mono
                        cursor-pointer transition-all duration-100 hover:bg-accent hover:border-accent">
                    UPDATE
                </button>
            </div>
            {
                unpushedCommits.length > 0 ? (
                    <div className="w-full h-1/4 shrink-0 bg-bg-surface py-3 border-t border-border">
                        <div className="w-full h-8 flex flex-row justify-between gap-2 shrink-0 px-3">
                            <h2 className="text-sm text-text-secondary font-sans">UNPUSHED COMMITS</h2>
                            <h2 className="text-sm text-danger font-sans">{unpushedCommits.length} AHEAD</h2>
                        </div>
                        <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll px-3 pb-3">
                            {
                                unpushedCommits.map((commit, i) => (
                                    <CommitItem key={i} hash={commit.hash} message={commit.message} author={commit.author} date={timeAgo(commit.time)} tags={[]} isSelected={selected === commit.hash} isFirst={i === 0} onClick={() => handleClick(commit)} />
                                ))
                            }
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
}