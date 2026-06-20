import { useState } from "react";
import { CommitInfo } from "../utils/types"
import { get_commit_files, get_pushed_commits, undo_pushed_commit } from "../utils/utils";
import { Button } from "./index";
import { useStore } from "../store";

interface props{
    commit: CommitInfo
    isFirst: boolean
}

export default function CommitItem({ commit, isFirst }: props){
    const { setPushedCommits, setSelectedUnpushedCommit, commitFileCache, setCommitFileCache } = useStore();
    const [active, setActive] = useState<boolean>(false);
    const files = commitFileCache[commit.hash] ?? [];

    const handleClick = () => {
        setActive(!active);
        setSelectedUnpushedCommit(commit.hash);
        if (active || commitFileCache[commit.hash]) return;
        async function load() {
            const commit_files = await get_commit_files(commit.hash);
            setCommitFileCache(commit.hash, commit_files);
        }
        load();
    }

    const HandleRemove = async() => {
        await undo_pushed_commit();
        const pushed_commits = await get_pushed_commits();
        setPushedCommits(pushed_commits);
    }

    return(
        <div onClick={handleClick} className={`w-full bg-bg-overlay rounded-md flex flex-col overflow-hidden ${active ? "max-h-96" : "max-h-20"} gap-2 p-3 text-text-primary text-sm border-2 border-border transition-all ${!active ? "duration-0" : "duration-150"} hover:bg-border cursor-pointer`}>
            <div className="h-full flex flex-row justify-between">
                <div className="h-full flex flex-col gap-1">
                    <h1 className="text-text-primary text-md">{commit.message}</h1>
                    <p className="text-text-secondary text-sm">{commit.hash}</p>
                    <p className="text-text-muted text-sx">{commit.author} - {commit.time}</p>
                </div>
                {
                    isFirst && (
                        <div className="flex flex-row gap-2">
                            <Button value={"<-"} onClick={HandleRemove} className="bg-danger border-danger" />
                        </div>
                    )
                }
            </div>
            {
                active && files.length > 0 && (
                    <div className="w-full flex flex-col gap-2">
                        {files.map((file, i) => (
                            <div key={i} className="text-text-primary">
                                -{'>\t'}{file.path}
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}