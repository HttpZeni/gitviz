import { Button, DropDown } from "./sub_components"
import { setNewRepoPath, get_repo_name } from "./utils/utils";
import { useStore } from "./store"
import { useEffect, useState } from "react";

export default function TopBar(){
    const { branches, unpushedCommits, pushedCommits, stagedFiles, setSelectedBranch } = useStore();
    const [selected, setSelect] = useState<number | string>(0);

    const handleRepoClick = async () => {
        await setNewRepoPath();
    }

    useEffect(() => { 
        setSelectedBranch(Number(selected));
    }, [selected])

    useEffect(() => {
        setSelect(0);
    }, [branches])

    return(
        <div className="w-full h-full bg-bg-surface p-2 flex flex-row gap-5 items-center justify-between">
            <div className="w-1/3 h-full flex flex-row gap-3 justify-center items-start self-start ">
                <Button value={get_repo_name() != "" ? get_repo_name() : "Repo path"} width={7} height={3} fontSize={12} onClick={() => handleRepoClick()} className="min-w-7 bg-transparent hover:bg-border tracking-widest self-center" />
                <DropDown childs={branches.map((branch, i) => ({ key: i, value: branch }))} emptyText={`${branches.length > 0 ? `No other branches here than '${branches[0]}' :)` : "No branches are here :)"}`} label={branches.length > 0 ? branches[Number(selected)] : "Bracnhes"} width={7} height={3} fontSize={12} selected={selected} setSelected={setSelect} className="bg-transparent hover:bg-border tracking-widest self-center" />
                <div className="h-full w-full flex flex-row gap-3 items-center justify-center">
                    <p className="text-sm text-text-secondary self-center">Branches {'>'} {branches.length}</p>
                    <p className="text-sm text-text-secondary self-center">Unpushed Commits {'>'} {unpushedCommits.length}</p>
                    <p className="text-sm text-text-secondary self-center">Pushed Commits {'>'} {pushedCommits.length}</p>
                    <p className="text-sm text-text-secondary self-center">Staged Files {'>'} {stagedFiles.length}</p>
                    <p className="text-sm text-text-secondary self-center">Staged Files Added {'>'} {stagedFiles.filter(f => f.is_staged).length}</p>
                </div>
            </div>
        </div>
    )
}