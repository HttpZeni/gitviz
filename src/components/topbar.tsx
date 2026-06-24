import { Button, DropDown, AreYouSure } from "./sub_components"
import { setNewRepoPath, get_repo_name, create_branch, delete_branch, get_branches } from "./utils/utils";
import { useStore } from "./store"
import { useEffect, useState } from "react";

export default function TopBar(){
    const { branches, unpushedCommits, pushedCommits, stagedFiles, setSelectedBranch, selectedBranch, setError, setStatusMessage, setBranches } = useStore();
    const [selected, setSelect] = useState<number | string>(0);
    const [newBranch, setNewBranch] = useState<string>("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        setNewBranch(e.target.value);
    }

    const handleRepoClick = async () => {
        await setNewRepoPath();
    }

    const handleBranchClick = async () => {
        setStatusMessage({message: "Creating new branch..", destroyAuto: false});
        try{
            await create_branch(newBranch);
            const new_branches = await get_branches();
            setBranches(new_branches);
            setNewBranch("");
            setStatusMessage({ message: "Created new branch!", destroyAuto: true });
        }
        catch(error){
            setError({ error: String(error) });
            setStatusMessage({ message: "Couldn't create new branch!", destroyAuto: true });
        }
    }

    const hanldeDeleteBranch = async () => {
        setStatusMessage({ message: `Deleting ${branches[selectedBranch]}..`, destroyAuto: false });
        
        try {
            await delete_branch(branches[selectedBranch]);
            const new_branches = await get_branches();
            setBranches(new_branches);
            setStatusMessage({ message: `Deletet ${branches[selectedBranch]}!`, destroyAuto: true });
        }
        catch (error) {
            setError({ error: String(error) });
            setStatusMessage({ message: `Couldn't delete branch: ${branches[selectedBranch]}!`, destroyAuto: true });
        }
    }

    useEffect(() => { 
        setSelectedBranch(Number(selected));
    }, [selected])

    useEffect(() => {
        setSelect(0);
    }, [branches])

    return(
        <div className="w-full h-full bg-bg-surface p-2 flex flex-row gap-5 items-center justify-between">
            <div className="w-1/3 h-full flex flex-row gap-3 items-start self-start ">
                <Button value={get_repo_name() != "" ? get_repo_name() : "Repo path"} width={7} height={3} fontSize={12} onClick={() => handleRepoClick()} className="min-w-7 bg-transparent hover:bg-border tracking-widest self-center" />
                <DropDown childs={[ ...branches.map((branch, i) => ({key: i, value: branch }))]} emptyText={`${branches.length > 0 ? `No other branches here than '${branches[0]}' :)` : "No branches are here :)"}`} label={branches.length > 0 ? branches[Number(selected)] : "Branches"} width={7} height={3} fontSize={12} selected={selected} setSelected={setSelect} className="bg-transparent hover:bg-border tracking-widest self-center" />
                <input type="text" value={newBranch} onChange={handleChange} onKeyDown={(e) => e.key === "Enter" && handleBranchClick()} placeholder="Branch name here :)" className="ml-5 outline-none border border-border rounded-md bg-bg-overlay transition-all duration-100 h-full px-2 text-text-primary text-md" />
                <Button value="Add Branch" width={7} height={3} fontSize={12} onClick={() => handleBranchClick()} className="min-w-7 bg-transparent hover:bg-border tracking-widest self-center" />
                <AreYouSure value={`Delete branch: ${branches[selectedBranch]} > `} onClick={hanldeDeleteBranch} trigger={<Button value="Delete Branch" width={7} height={3} fontSize={12} onClick={() => { }} className="min-w-7 bg-transparent hover:bg-border tracking-widest self-center" />}/>
            </div>
            <div className="h-full w-full flex flex-row gap-3 items-center justify-end px-3">
                <p className="text-sm text-text-secondary self-center">Branches {'>'} {branches.length}</p>
                <p className="text-sm text-text-secondary self-center">Unpushed Commits {'>'} {unpushedCommits.length}</p>
                <p className="text-sm text-text-secondary self-center">Pushed Commits {'>'} {pushedCommits.length}</p>
                <p className="text-sm text-text-secondary self-center">Staged Files {'>'} {stagedFiles.length}</p>
                <p className="text-sm text-text-secondary self-center">Staged Files Added {'>'} {stagedFiles.filter(f => f.is_staged).length}</p>
            </div>
        </div>
    )
}