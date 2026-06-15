import { CommitInfo } from "../App";
import CommitItem from "./sub_components/commititem";
import { useState } from "react";
import { timeAgo } from "../utils";

export default function MiddlePart({ commits, setSelectedCommit }: { commits: CommitInfo[], setSelectedCommit: React.Dispatch<React.SetStateAction<CommitInfo | undefined>> }) {
    const [selected, setSelected] = useState<string>("");

    function handleClick(commit: CommitInfo) {
        async function load() {
            setSelected(commit.hash);
            setSelectedCommit(commit);
        }
        load();
    }

    return (
        <div className="w-full h-full bg-bg-base overflow-y-scroll">
            <div className="w-full h-fit flex justify-between px-3">
                <h2 className="mt-3 text-md text-text-secondary font-mono font-semibold">COMMITS</h2>
                <h2 className="mt-3 text-md text-text-secondary font-mono font-semibold">{commits.length} SHOWN</h2>
            </div>

            {commits.length > 0 ? commits.map((commit, i) =>
                <CommitItem hash={commit.hash} message={commit.message} author={commit.author} date={timeAgo(commit.time)} tags={[]} isSelected={selected === commit.hash} isFirst={i === 0} onClick={() => handleClick(commit)}/>
            ) : null} 
        </div>
    );
}