import { useState } from "react";
import { useStore } from "../store"
import { CommitInfo, FileInfo } from "../utils/types"
import { get_commit_files, git_push_commit, git_remove_unpushed_commit, get_unpushed_commits, get_pushed_commits } from "../utils/utils";
import { Button } from "./index";

interface props{
    commit: CommitInfo
    isLast: boolean
}

export default function UnpushedCommitItem({ commit, isLast }: props){
    const { setUnpushedCommits, setPushedCommits } = useStore();
    const [active, setActive] = useState<boolean>(false);
    const [files, setFiles] = useState<FileInfo[]>([]);

    const hanldeClick = () => { 
        setActive(!active);
        if (!active) return;
        async function load(){
            const commit_files = await get_commit_files(commit.hash);
            setFiles(commit_files);
        }
        load();
    }

    const HandlePush = async () => {
        console.log("hash:", commit.hash);
        await git_push_commit(commit.hash);
        const unpushed_commits = await get_unpushed_commits();
        const pushed_commits = await get_pushed_commits();
        setUnpushedCommits(unpushed_commits);
        setPushedCommits(pushed_commits);
    }
    const HandleRemove = async () => {
        await git_remove_unpushed_commit(commit.hash);
        const unpushed_commits = await get_unpushed_commits();
        setUnpushedCommits(unpushed_commits);
    }

    return(
        <div onClick={hanldeClick} className={`w-full bg-bg-overlay rounded-md flex flex-col overflow-hidden ${active ? "max-h-96" : "max-h-20"} gap-2 p-3 text-text-primary text-sm border-2 border-border transition-all duration-100 hover:bg-border cursor-pointer`}>
            <div className="h-full flex flex-row justify-between">
                <div className="h-full flex flex-col gap-1">
                    <h1 className="text-text-primary text-md">{commit.message}</h1>
                    <p className="text-text-secondary text-sm">{commit.hash}</p>
                    <p className="text-text-muted text-sx">{commit.author} - {commit.time}</p>
                </div>
                {
                    isLast && (
                        <div className="flex flex-row gap-2">
                            <Button value={"<-"} onClick={HandleRemove} className="bg-danger border-danger" />
                            <Button value={"->"} onClick={HandlePush} className="bg-success border-success" />
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