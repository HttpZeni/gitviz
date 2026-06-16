import LeftSideBar from "./components/leftsidebar";
import MiddlePart from "./components/middlepart";
import RightSideBar from "./components/rightsidebar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export interface FileInfo {
  path: string,
  status: string,
}

export interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  time: number;
}

function App() {
  const [commits, setCommit] = useState<CommitInfo[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<CommitInfo>();
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(1);
  const [repoPath, setRepoPath] = useState<string>("C:/Coding/Rust/zet");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const repoName = repoPath.split("/").at(-1);

  useEffect(() => {
    async function load() {
      const commits = await invoke<CommitInfo[]>("get_commits", { path: repoPath });
      const branches = await invoke<string[]>("get_branches", { path: repoPath })
      setCommit(commits);
      setSelectedCommit(commits[0]);
      setBranches(branches);
      console.log(branches);
    }
    load();
  }, [repoPath]);

  return (
    <div className="bg-bg-base w-screen h-screen flex flex-row">
      <div className="w-96 shrink-0 h-full">
        <LeftSideBar repoName={repoName} branches={branches} setCommit={setCommit} repoPath={repoPath} setRepoPath={setRepoPath} setSelectedBranch={setSelectedBranch} selectedBranch={selectedBranch}/>
      </div>
      <div className="w-full h-full">
        <MiddlePart commits={commits} setSelectedCommit={setSelectedCommit} repoPath={repoPath}/>
      </div>
      <div className="w-96 shrink-0 h-full">
        <RightSideBar selectedCommit={selectedCommit} repoPath={repoPath} files={files} setFiles={setFiles}/>
      </div>
    </div>
  );
}

export default App;
