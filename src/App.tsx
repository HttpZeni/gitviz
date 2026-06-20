import { get_pushed_commits, get_branches, get_unpushed_commits, get_entrys } from "./components/utils/utils";
import { useStore } from "./components/store";
import { useEffect } from "react";
import TopBar from "./components/topbar";
import Base from "./components/base";
import Bottom from "./components/bottom";

function App() {
  const { repoPath, setUnpushedCommits, setPushedCommits, setBranches, setStageFiles, statusMessage, setStatusMessage, selectedBranch, setSelectedBranch } = useStore();  

  useEffect(() => {
    if (!statusMessage || !statusMessage.destroyAuto) return;
    const timeout = setTimeout(() => setStatusMessage({message: "", destroyAuto: false}), 3000);
    return () => clearTimeout(timeout);
  }, [statusMessage])

  useEffect(() => {
    if (!repoPath) return;
    setStatusMessage({message: "Loading everything..", destroyAuto: false});
    async function load() {
      const branches = await get_branches();
      setBranches(branches);

      const staged_files = await get_entrys();
      const unpushedCommits = await get_unpushed_commits();
      const pushed_commits = await get_pushed_commits();
      setSelectedBranch(0); 
      setUnpushedCommits(unpushedCommits);
      setPushedCommits(pushed_commits);
      setStageFiles(staged_files);
    }
    load();
    setStatusMessage({ message: "Loaded everything!", destroyAuto: true });
  }, [repoPath]);

  useEffect(() => { 
    if (!repoPath) return;
    setStatusMessage({ message: "Updating everything!", destroyAuto: false });
    async function load() {
      const staged_files = await get_entrys();
      const unpushedCommits = await get_unpushed_commits();
      const pushed_commits = await get_pushed_commits();
      setUnpushedCommits(unpushedCommits);
      setPushedCommits(pushed_commits);
      setStageFiles(staged_files);
    }
    load();
    setStatusMessage({ message: "Updated everything!", destroyAuto: true });
  }, [selectedBranch])

  return (
    <div className="bg-bg-base w-screen h-screen flex flex-col">
      <div className="w-full h-16">
        <TopBar />
      </div>
      <div className="w-full h-full overflow-y-scroll">
        <Base/>
      </div>
      <div className="w-full h-96 mb-4">
        <Bottom/>
      </div>
      <div className="fixed font-mono-bold bg-bg-elevated bottom-0 w-full h-5 text-text-muted text-xs px-3 items-center tracking-widest transition-all duration-150">
        {statusMessage.message}
      </div>
    </div>
  );
}

export default App;
