import { Button } from "./sub_components"
import { setNewRepoPath, get_repo_name } from "./utils/utils";
import { useStore } from "./store"

export default function TopBar(){
    const {branches, unpushedCommits, pushedCommits, stagedFiles} = useStore();

    const handleRepoClick = async () => {
        await setNewRepoPath();
    }

    return(
        <div className="w-full h-full bg-bg-surface p-2 flex flex-row gap-5 items-center justify-between">
            <div className="flex flex-row gap-5 items-center justify-center">
                <Button value={get_repo_name()} width={7} height={3} fontSize={12} onClick={() => handleRepoClick()} className="bg-transparent hover:bg-border tracking-widest" />
                <p className="text-sm text-text-secondary">Branches {'>'} {branches.length}</p>
                <p className="text-sm text-text-secondary">Unpushed Commits {'>'} {unpushedCommits.length}</p>
                <p className="text-sm text-text-secondary">Pushed Commits {'>'} {pushedCommits.length}</p>
                <p className="text-sm text-text-secondary">Staged Files {'>'} {stagedFiles.length}</p>
                <p className="text-sm text-text-secondary">Staged Files Added {'>'} {stagedFiles.filter(f => f.is_staged).length}</p>
            </div>
        </div>
    )
}