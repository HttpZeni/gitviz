import { CommitInfo } from "../App";
import CommitItem from "./sub_components/commititem";
import { useEffect, useState } from "react";
import { timeAgo } from "../utils";
import { FileInfo } from "../App";
import { invoke } from "@tauri-apps/api/core";
import EntryItem from "./sub_components/entryItem";

enum views {HISTORY, STAGING}

export default function MiddlePart({ commits, setSelectedCommit, repoPath, unpushedCommits }: { commits: CommitInfo[], setSelectedCommit: React.Dispatch<React.SetStateAction<CommitInfo | undefined>>, repoPath: string, unpushedCommits: CommitInfo[]}) {
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

    useEffect(() => {
        loadEntries()
    }, [repoPath]) 
 
    return (
        <div className="w-full h-full flex flex-col bg-bg-surface">
                <div className="w-fit h-16 flex flex-row justify-center items-center shrink-0 gap-2 pt-3">
                    <button onClick={() => setSelectedView(views.HISTORY)} className={`px-2 py-1 w-full h-fit ${selectedView === views.HISTORY ? "bg-bg-base" : "bg-bg-overlay"} rounded-sm text-md text-text-primary font-mono cursor-pointer`}>History</button>
                    <button onClick={() => setSelectedView(views.STAGING)} className={`px-2 py-1 w-full h-fit ${selectedView === views.STAGING ? "bg-bg-base" : "bg-bg-overlay"} border-border-subtle rounded-sm text-md text-text-primary font-mono cursor-pointer`}>Staging</button>
                </div>
                <div className="w-full h-12 shrink-0">
                    <div className="w-full h-full flex items-center justify-between bg-bg-base rounded-sm px-3">
                        <h2 className="text-md text-text-secondary font-mono font-semibold">{selectedView === views.HISTORY ? "COMMITS" : "ENTRYS"}</h2>
                        <h2 className="text-md text-text-secondary font-mono font-semibold">{selectedView === views.HISTORY ? commits.length : stagingFile.length} SHOWN</h2>
                    </div>
                </div>
            {
                selectedView === views.HISTORY ? (
                    <div className="min-h-0 flex-1 pt-3">
                        <div className="w-full h-full bg-bg-base rounded-sm overflow-y-scroll p-3 flex flex-col gap-2">
                            {commits.length > 0 ? commits.map((commit, i) =>
                                <CommitItem key={i} hash={commit.hash} message={commit.message} author={commit.author} date={timeAgo(commit.time)} tags={[]} isSelected={selected === commit.hash} isFirst={i === 0} onClick={() => handleClick(commit)} />
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div className="min-h-0 flex-1 pt-3">
                        <div className="w-full h-full bg-bg-base rounded-sm overflow-y-scroll p-3 flex flex-col gap-2">
                            {stagingFile.length > 0 ? stagingFile.map((entry, i) =>
                                <EntryItem key={i} repoPath={repoPath} entryFile={entry} isSelected={selectedEntry === entry} onClick={() => setSelectedEntry(entry)} onAction={loadEntries} />
                            ) : null}
                        </div>
                    </div>
                )
            }
            {
                unpushedCommits.length > 0 ? (
                    <div className="w-full h-1/3 shrink-0 bg-bg-surface py-3">
                        <div className="w-full h-full shrink-0 bg-bg-base rounded-sm overflow-hidden">
                            <div className="w-full h-16 flex flex-col gap-2 shrink-0 p-3">
                                <div className="w-full h-full flex items-center justify-between bg-bg-base rounded-sm p-3">
                                    <h2 className="text-md text-text-secondary font-mono font-semibold">UNPUSHED COMMITS</h2>
                                    <h2 className="text-md text-text-secondary font-mono font-semibold">{unpushedCommits.length} SHOWN</h2>
                                </div>
                            </div>
                            <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll px-3 pb-3">
                                {
                                    unpushedCommits.map((commit, i) => (
                                        <CommitItem key={i} hash={commit.hash} message={commit.message} author={commit.author} date={timeAgo(commit.time)} tags={[]} isSelected={selected === commit.hash} isFirst={i === 0} onClick={() => handleClick(commit)} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
}