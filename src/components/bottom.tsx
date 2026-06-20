import { useState } from "react";
import { useStore } from "./store"
import { UnpushedCommitItem, Button } from "./sub_components";
import { git_push_commit, make_commit, get_unpushed_commits, get_pushed_commits } from "./utils/utils";

export default function Bottom(){
    const {unpushedCommits, setUnpushedCommits, selectedUnpushedCommit, setPushedCommits, setStatusMessage} = useStore();
    const [commitMessage, setCommitMessage] = useState<string>("");

    const HandleCommit = async() => {
        setStatusMessage({ message: "Making commit..", destroyAuto: false});
        await make_commit(commitMessage);
        const unpushed_commits = await get_unpushed_commits();
        setUnpushedCommits(unpushed_commits);
        setCommitMessage("");
        setStatusMessage({ message: "Made commit!", destroyAuto: true });
    }
    const HandlePush = async () => {
        setStatusMessage({ message: "Pushing commit > " + selectedUnpushedCommit, destroyAuto: false });
        await git_push_commit(selectedUnpushedCommit);
        const unpushed_commits = await get_unpushed_commits();
        const pushed_commits = await get_pushed_commits();
        setUnpushedCommits(unpushed_commits);
        setPushedCommits(pushed_commits);
        setStatusMessage({ message: "Pushed commit > " + selectedUnpushedCommit, destroyAuto: true });
    }
    const HandlePull = async () => {

    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommitMessage(e.target.value);
    }

    return (
        <div className="w-full h-full bg-bg-elevated border-t-2 shrink-0 border-border flex flex-row pb-1">
            <div className="w-2/12 shrink-0 h-full border-border flex flex-col p-3 gap-2">
                <p className="text-text-secondary">Commit | Push All | Pull</p>
                <textarea
                    onChange={handleChange}
                    placeholder="Commit message here :)"
                    className="outline-none w-full flex-1 resize-none bg-bg-surface border border-border text-text-primary placeholder:text-text-muted rounded-lg p-3 text-lg"
                />
                <div className="w-full flex flex-row gap-2">
                    <Button onClick={HandleCommit} value={"Commit"} width={10} height={3} fontSize={14} className="tracking-wide w-full bg-border hover:bg-transparent" />
                    <Button onClick={HandlePush} value={"Push All"} width={8} height={3} fontSize={14} className="tracking-wide bg-border hover:bg-transparent" />
                    <Button onClick={HandlePull} value={"Pull"} width={6} height={3} fontSize={14} className="tracking-wide bg-border hover:bg-transparent" />
                </div>
            </div>
            <div className="w-full h-full rounded-bl-xl border-b-2 border-l-2 border-border bg-bg-surface flex flex-col gap-2 p-3 overflow-y-scroll">
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