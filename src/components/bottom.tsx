import { useState } from "react";
import { useStore } from "./store"
import { UnpushedCommitItem, Button, DropDown } from "./sub_components";
import { git_push_commit, make_commit, get_unpushed_commits, get_pushed_commits, conventionalCommitsConfig, git_pull, get_entrys } from "./utils/utils";
import { conventionalCommits } from "./utils/types";

export default function Bottom(){
    const {unpushedCommits, setUnpushedCommits, selectedUnpushedCommit, setPushedCommits, setStatusMessage, setError, setStageFiles} = useStore();
    const [commitMessage, setCommitMessage] = useState<string>("");
    const [selectedConCommit, setConCommit] = useState<number | string>("NONE");

    const HandleCommit = async() => {
        setStatusMessage({ message: "Making commit..", destroyAuto: false});
        try{
            await make_commit(`${selectedConCommit !== "NONE" ? `${conventionalCommitsConfig[conventionalCommits[selectedConCommit as number]].value} ` : ""}${commitMessage}`);
            const unpushed_commits = await get_unpushed_commits();
            setUnpushedCommits(unpushed_commits);
            setCommitMessage("");
            setStatusMessage({ message: "Made commit!", destroyAuto: true });
        }
        catch(error){
            setError({ error: String(error) });
            setStatusMessage({ message: "Commit failed!", destroyAuto: true });
        }
    }
    const HandlePush = async () => {
        setStatusMessage({ message: "Pushing commit > " + selectedUnpushedCommit, destroyAuto: false });
        try{
            await git_push_commit(selectedUnpushedCommit);
            const unpushed_commits = await get_unpushed_commits();
            const pushed_commits = await get_pushed_commits();
            setUnpushedCommits(unpushed_commits);
            setPushedCommits(pushed_commits);
            setStatusMessage({ message: "Pushed commit > " + selectedUnpushedCommit, destroyAuto: true });
        }
        catch(error){
            setError({ error: String(error) });
            setStatusMessage({ message: "Push failed!", destroyAuto: true });
        }
    }
    const HandlePull = async () => {
        setStatusMessage({ message: "Pulling.. ", destroyAuto: false });
        try{
            await git_pull();
            const unpushed_commits = await get_unpushed_commits();
            const pushed_commits = await get_pushed_commits();
            const stage_files = await get_entrys();
            setUnpushedCommits(unpushed_commits);
            setPushedCommits(pushed_commits);
            setStageFiles(stage_files);
            setStatusMessage({ message: "Pulled! ", destroyAuto: true });
        }
        catch(error){
            setError({ error: String(error)});
            setStatusMessage({ message: "Failed Pulling! ", destroyAuto: true });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommitMessage(e.target.value);
    }

    return (
        <div className="w-full h-full bg-bg-elevated border-t-2 shrink-0 border-border flex flex-row pb-1">
            <div className="w-2/12 shrink-0 h-full border-border flex flex-col p-3 gap-2">
                <p className="text-text-secondary">Commit | Push All | Pull</p>
                <div className="w-full flex flex-row gap-3 items-center">
                    <DropDown width={9} height={3} emptyText="Nothing here :)" down={false} childs={conventionalCommits.map((conventionalCommit, i) => ({ key: i, value: conventionalCommit }))} label={conventionalCommits[selectedConCommit as number]} selected={selectedConCommit} setSelected={setConCommit} />
                    <p className="text-text-primary">{'>'}</p><p className="text-text-primary">{conventionalCommitsConfig[conventionalCommits[selectedConCommit as number]]?.desc}</p>
                </div>
                <textarea
                    onChange={handleChange}
                    placeholder="Commit message here :)"
                    className="z-0 outline-none w-full flex-1 resize-none bg-bg-surface border border-border text-text-primary placeholder:text-text-muted rounded-lg p-3 text-lg"
                />
                <div className="w-full flex flex-row gap-2">
                    <Button onClick={HandleCommit} value={"Commit"} width={10} height={3} fontSize={14} className="tracking-wide w-full bg-border hover:bg-transparent" />
                    <Button onClick={HandlePush} value={"Push All"} width={8} height={3} fontSize={14} className="tracking-wide bg-border hover:bg-transparent" />
                    <Button onClick={HandlePull} value={"Pull"} width={6} height={3} fontSize={14} className="tracking-wide bg-border hover:bg-transparent" />
                </div>
            </div>
            <div className="w-full h-full rounded-bl-xl border-b border-l border-border bg-bg-surface flex flex-col gap-2 p-3 overflow-y-scroll">
                <p className="text-text-secondary">Unpushed Commits</p>
                <div>
                    {
                        unpushedCommits.length > 0 ? (
                            <div className="w-full flex flex-col gap-2">
                                {
                                    unpushedCommits.map((commit, i) => (
                                        <UnpushedCommitItem key={i} commit={commit} isLast={i === unpushedCommits.length-1}/>
                                    ))
                                }
                            </div>
                        ) : (
                            <p className="text-text-primary">No unpushed commits :)</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}