import Branch from "./sub_components/branche";
import { CommitInfo } from "../App";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export default function LeftSideBar({ userName, userToken, setUsername, setToken, repoName, branches, setCommit, repoPath, setRepoPath, setSelectedBranch, selectedBranch, setUnpushedCommits }: { userToken: string, userName: string, setToken: React.Dispatch<React.SetStateAction<string>>, setUsername: React.Dispatch<React.SetStateAction<string>>, repoName: string | undefined, branches: string[], setCommit: React.Dispatch<React.SetStateAction<CommitInfo[]>>, repoPath: string, setRepoPath: React.Dispatch<React.SetStateAction<string>>, setSelectedBranch: React.Dispatch<React.SetStateAction<number>>, selectedBranch: number, setUnpushedCommits: React.Dispatch<React.SetStateAction<CommitInfo[]>> }) {
    const handleClick = () => {
        async function load() {
            const path = await open({ directory: true, multiple: false });
            if (path) {
                setRepoPath((path as string).replaceAll("\\", "/"));
            }
        }
        load();
    }

    const handlePush = () => {
        async function load() {
            await invoke("git_push", { path: repoPath, branch: branches[selectedBranch], username: userName, token: userToken });
            const initialBranch = branches[selectedBranch] ?? branches[0];
            let unpushedCommits = await invoke<CommitInfo[]>("get_unpushed_commits", { path: repoPath, branch: initialBranch });
            setUnpushedCommits(unpushedCommits);
        }
        load();
    }

    function handleUsername(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e?.target.value);
    }
    function handleUserToken(e: React.ChangeEvent<HTMLInputElement>) {
        setToken(e?.target.value);
    }

    return (
        <div className="w-full h-full bg-bg-surface flex flex-col">
            <div className="w-full h-40 shrink-0 grow-0 flex flex-col justify-between p-3 border-r border-b border-border">
                <h2 className="text-md text-text-secondary font-mono">REPOSITORY</h2>
                <p className="text-3xl -mt-2 text-text-primary font-sans font-semibold"><span className="text-accent">/ </span>{repoName != undefined ? `${repoName}` : "None"}</p>
                <button className="w-full h-8 flex items-center justify-start mt-2 p-2 border border-accent transition-all duration-100 hover:border-accent-subtle rounded-sm text-sm text-text-secondary font-mono cursor-pointer" onClick={handleClick}>Change Repo {'>'} </button>
            </div>
            <div className="w-full h-full flex flex-col gap-2 p-3 border-r border-border">
                <h2 className="text-md text-text-secondary font-mono">branches</h2>
                {branches.map((branch, i) => (
                    <Branch key={i} branchName={branch.toString()} index={i} isSelected={selectedBranch === i} setSelectedBranch={setSelectedBranch} setCommit={setCommit} repoPath={repoPath} setUnpushedCommits={setUnpushedCommits} />
                ))}
            </div>
            <div className="w-full h-48 flex flex-col items-end justify-between gap-2 p-3 border-t border-r border-border">
                <h2 className="w-full flex items-center justify-start text-md text-text-secondary font-mono">push to remote</h2>
                <input type="text" placeholder="Github username.." value={userName} onChange={handleUsername}
                    className="w-full h-10 p-3 
                    outline-none border border-border
                    bg-bg-base rounded-sm text-text-primary font-mono
                    placeholder:text-text-muted text-lg" />
                <input type="password" placeholder="Github token.." value={userToken} onChange={handleUserToken}
                    className="w-full h-10 p-3 
                    outline-none border border-border
                    bg-bg-base rounded-sm text-text-primary font-mono
                    placeholder:text-text-muted text-lg" />
                <button onClick={handlePush} className="w-full h-10 bg-accent rounded-sm text-md text-text-mute font-mono cursor-pointer transition-all duration-100 hover:bg-accent-hover">Push All</button>
            </div>
        </div>
    );
}