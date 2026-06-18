import LeftSideBar from "./components/leftsidebar";
import MiddlePart from "./components/middlepart";
import RightSideBar from "./components/rightsidebar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export interface FileInfo {
  path: string,
  status: string,
  is_ignored: boolean,
  is_staged: boolean,
}

export interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  time: number;
}

function App() {
  const [userName, setUsername] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [commits, setCommit] = useState<CommitInfo[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<CommitInfo>();
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [repoPath, setRepoPath] = useState<string>("");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [unpushedCommits, setUnpushedCommits] = useState<CommitInfo[]>([]);
  const repoName = repoPath.split("/").at(-1);

  useEffect(() => {
    async function load() {
      const branches = await invoke<string[]>("get_branches", { path: repoPath });
      const initialBranch = branches[selectedBranch] ?? branches[0];
      const commits = await invoke<CommitInfo[]>("get_pushed_commits", { path: repoPath, branch: initialBranch });
      const unpushedCommits = await invoke<CommitInfo[]>("get_unpushed_commits", { path: repoPath, branch: initialBranch });
      setUnpushedCommits(unpushedCommits);
      setCommit(commits);
      setSelectedCommit(commits[0]);
      setBranches(branches);
      console.log(branches);
    }
    load();
  }, [repoPath]);

  return (
    <div className="bg-bg-base w-screen h-screen flex flex-row overflow-hidden">
      <div className="w-96 shrink-0 h-full">
        <LeftSideBar userName={userName} userToken={token} setToken={setToken} setUsername={setUsername} setUnpushedCommits={setUnpushedCommits} repoName={repoName} branches={branches} setCommit={setCommit} repoPath={repoPath} setRepoPath={setRepoPath} setSelectedBranch={setSelectedBranch} selectedBranch={selectedBranch} />
      </div>
      <div className="w-full h-full">
        <MiddlePart branch={branches[selectedBranch]} setUnpushedCommits={setUnpushedCommits} setCommits={setCommit} commits={commits} setSelectedCommit={setSelectedCommit} repoPath={repoPath} unpushedCommits={unpushedCommits} token={token} userName={userName}/>
      </div>
      <div className="w-96 shrink-0 h-full">
        <RightSideBar selectedCommit={selectedCommit} repoPath={repoPath} files={files} setFiles={setFiles} setUnpushedCommits={setUnpushedCommits} currentBranch={branches[selectedBranch]} />
      </div>
    </div>
  );
}

export default App;
