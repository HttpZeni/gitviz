import { FileInfo } from "../../App";
import { invoke } from "@tauri-apps/api/core";

export default function EntryItem({ entryFile, isSelected, onClick, repoPath, onAction }: { entryFile: FileInfo, isSelected: boolean, onClick: () => void, repoPath: string, onAction: () => void }) {
    let color = "";

    switch (entryFile.status) {
        case "STAGED": color = "success"; break;
        case "UNTRACKED": color = "text-muted"; break;
        case "MODIFIED": color = "warning"; break;
        case "DELETED": color = "danger"; break;
        case "IGNORED": color = "text-secondary"; break;
        case "UNKNOWN": color = "text-muted"; break;
    }

    const handleAddBtn = async () => {
        await invoke("git_add", { path: repoPath, filePath: entryFile.path });
        onAction();
    }

    const handleRemoveBtn = async () => {
        await invoke("git_remove", { path: repoPath, filePath: entryFile.path });
        onAction();
    }

    return (
        <div
            onClick={onClick}
            className={`w-full flex flex-row gap-3 px-3 py-3 cursor-pointer border border-border transition-all duration-100 rounded-sm
            ${isSelected ? "bg-bg-surface" : "hover:bg-bg-surface"}`} >
            <div className="w-full flex flex-row items-center justify-between">
                <p className={`text-sm font-sans text-${color} w-16`}>
                    {entryFile.status}
                </p>
                <p className={`text-sm font-sans truncate flex-1 text-center ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                    {entryFile.path}
                </p>
                {!entryFile.is_ignored && entryFile.status != "DELETED" ?  (
                    <div className="flex flex-row gap-2">
                        {!entryFile.is_staged ? (
                            <button onClick={(e) => { e.stopPropagation(); handleAddBtn(); }} className="w-6 h-6 bg-accent flex items-center justify-center text-text-primary font-mono font-semibold rounded-sm cursor-pointer hover:bg-accent-hover">+</button>
                        ) : (
                            <button onClick={(e) => { e.stopPropagation(); handleRemoveBtn(); }} className="w-6 h-6 bg-accent-subtle flex items-center justify-center text-text-primary font-mono font-semibold rounded-sm cursor-pointer hover:bg-accent-hover">-</button>
                        )}
                    </div>
                ): null}
            </div>
        </div>
    );
}