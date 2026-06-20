import { CommitItem, Button, StageFile } from "./sub_components"
import { useStore } from "./store";
import { useEffect, useState } from "react";
import { get_entrys, git_unstage_all, git_add_all, get_commit_files } from "./utils/utils";

export default function Base(){
    const { pushedCommits, stagedFiles, setStageFiles, commitFileCache, setCommitFileCache, setStatusMessage } = useStore();
    const [selected, setSelected] = useState<number>(0);

    useEffect(() => {
        const pending = pushedCommits.filter(c => !commitFileCache[c.hash]);
        if (pending.length === 0) return;
        setStatusMessage("Loading commits..");
        Promise.all(pending.map(commit =>
            get_commit_files(commit.hash).then(files => setCommitFileCache(commit.hash, files))
        )).then(() => setStatusMessage("Loaded commits!"));
    }, [pushedCommits])

    function handleClick (index: number) {
        setSelected(index);
    }

    const selectAll = async () => {
        setStatusMessage("Selecting all staged file..");
        await git_add_all();
        const staged_files = await get_entrys();
        setStageFiles(staged_files);
        setStatusMessage("Staged all files!");
    }

    const deselectAll = async () => {
        setStatusMessage("Deselecting all files..");
        await git_unstage_all();
        const staged_files = await get_entrys();
        setStageFiles(staged_files);
        setStatusMessage("Deselected all files!");
    }

    return(
        <div className="w-full h-full bg-bg-base px-2">
            <div className="h-16 w-full flex flex-row gap-3 items-center justify-start">
                <Button onClick={() => handleClick(0)} value="Pushed Commits" width={7} height={3} className={`${selected === 0 ? "bg-border" : "bg-transparent"} hover:bg-border`} />
                <Button onClick={() => handleClick(1)} value="Staged Files" width={7} height={3} className={`${selected === 1 ? "bg-border" : "bg-transparent"} hover:bg-border`} />
                {
                    selected === 1 && (
                        <>
                            <Button onClick={selectAll} value="Select All" width={7} height={3} className={`"bg-border bg-border hover:bg-transparent`} />
                            <Button onClick={deselectAll} value="Deselect All" width={7} height={3} className={`"bg-border" bg-border hover:bg-transparent`} />
                        </>
                    )
                }
            </div>
            <div className="w-full flex flex-col gap-2 pb-2">
                {
                    selected === 0 ? (
                        pushedCommits.map((commit, i) => (
                            <CommitItem key={i} commit={commit} isFirst={i === 0} />
                        ))
                    ) : (
                        stagedFiles.map((file, i) => (
                            <StageFile key={i} file={file} />
                        ))
                    )
                } 
            </div>
        </div>
    )
}
