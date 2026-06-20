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
        setStatusMessage({message: "Loading commits..", destroyAuto: false});
        Promise.all(pending.map(commit =>
            get_commit_files(commit.hash).then(files => setCommitFileCache(commit.hash, files))
        )).then(() => setStatusMessage({ message: "Loaded commits!", destroyAuto: true }));
    }, [pushedCommits])

    function handleClick (index: number) {
        setSelected(index);
    }

    const selectAll = async () => {
        setStatusMessage({ message: "Selecting all staged file..", destroyAuto: false });
        await git_add_all();
        const staged_files = await get_entrys();
        setStageFiles(staged_files);
        setStatusMessage({ message: "Staged all files!", destroyAuto: true });
    }

    const deselectAll = async () => {
        setStatusMessage({ message: "Deselecting all files..", destroyAuto: false });
        await git_unstage_all();
        const staged_files = await get_entrys();
        setStageFiles(staged_files);
        setStatusMessage({ message: "Deselected all files!", destroyAuto: true });
    }

    const update = async () => {
        setStatusMessage({ message: "Updating staged file..", destroyAuto: false });
        const staged_files = await get_entrys();
        setStageFiles(staged_files);
        setStatusMessage({ message: "Updated staged files!", destroyAuto: true });
    }

    return(
        <div className="w-full h-full bg-bg-base px-2">
            <div className="h-16 w-full flex flex-row gap-3 items-center justify-start">
                <Button onClick={() => handleClick(0)} value="Pushed Commits" width={7} height={3} className={`${selected === 0 ? "bg-border" : "bg-transparent"} hover:bg-border`} />
                <Button onClick={() => handleClick(1)} value="Staged Files" width={7} height={3} className={`${selected === 1 ? "bg-border" : "bg-transparent"} hover:bg-border`} />
                {
                    selected === 1 && (
                        <div className="w-full flex flex-row gap-5 items-center justify-between">
                            <div className="flex flex-row gap-3">
                                <Button onClick={selectAll} value="Select All" width={7} height={3} className={`"bg-border bg-border hover:bg-transparent`} />
                                <Button onClick={deselectAll} value="Deselect All" width={7} height={3} className={`"bg-border" bg-border hover:bg-transparent`} />
                            </div>
                            <Button onClick={update} value="Update" width={7} height={3} className={`"bg-border" bg-transparent hover:bg-border`} />
                        </div>
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
