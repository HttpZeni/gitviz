import { CommitInfo } from "../App";
import CommitItem from "./sub_components/commititem";
import { useEffect, useState } from "react";
import { timeAgo } from "../utils";
import { FileInfo } from "../App";
import { invoke } from "@tauri-apps/api/core";
import EntryItem from "./sub_components/entryItem";

enum views {HISTORY, STAGING}

export default function MiddlePart({ commits, setSelectedCommit, repoPath,  }: { commits: CommitInfo[], setSelectedCommit: React.Dispatch<React.SetStateAction<CommitInfo | undefined>>, repoPath: string}) {
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


    useEffect(() => {
        async function load() {
            const files = await invoke<FileInfo[]>("get_entrys", { path: repoPath });
            console.log("Entrys: " + files);
            setStagingFiles(files);
        }
        load();
    }, [repoPath]) 

    return (
        <div className="w-full h-full flex flex-col bg-bg-base">
            <div className="w-fit h-16 flex flex-row justify-center items-center shrink-0 gap-2 px-3">
                <button onClick={() => setSelectedView(views.HISTORY)} className={`px-2 w-full h-fit ${selectedView === views.HISTORY ? "bg-bg-surface/50" : "bg-bg-overlay"} border border-border-subtle rounded-sm text-md text-text-primary font-mono cursor-pointer`}>History</button>
                <button onClick={() => setSelectedView(views.STAGING)} className={`px-2 w-full h-fit ${selectedView === views.STAGING ? "bg-bg-surface/50" : "bg-bg-overlay"} border border-border-subtle rounded-sm text-md text-text-primary font-mono cursor-pointer`}>Staging</button>
            </div>
            <div className="w-full h-16 shrink-0 px-3">
                <div className="w-full h-full flex items-center justify-between bg-bg-elevated rounded-sm px-3">
                    <h2 className="text-md text-text-secondary font-mono font-semibold">COMMITS</h2>
                    <h2 className="text-md text-text-secondary font-mono font-semibold">{commits.length} SHOWN</h2>
                </div>
            </div>

            {
                selectedView === views.HISTORY ? (
                    <div className="h-full w-full flex flex-col gap-2 overflow-y-scroll p-3">
                        {commits.length > 0 ? commits.map((commit, i) =>
                            <CommitItem hash={commit.hash} message={commit.message} author={commit.author} date={timeAgo(commit.time)} tags={[]} isSelected={selected === commit.hash} isFirst={i === 0} onClick={() => handleClick(commit)} />
                        ) : null}
                    </div>
                ) : (
                    <div className="h-full w-full flex flex-col gap-2 overflow-y-scroll p-3">
                        {stagingFile.length > 0 ? stagingFile.map((entry, i) =>
                            <EntryItem key={i} entryFile={entry} isSelected={selectedEntry === entry} onClick={() => setSelectedEntry(entry)}/>
                        ) : null}
                    </div>
                )
            }
        </div>
    );
}