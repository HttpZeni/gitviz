import { useState } from "react";
import { FileInfo } from "../../App";
import { invoke } from "@tauri-apps/api/core";

const statusConfig: Record<string, { label: string; className: string }> = {
    STAGED: { label: "S", className: "bg-success/15 text-success" },
    UNTRACKED: { label: "U", className: "bg-text-muted/15 text-text-muted" },
    MODIFIED: { label: "M", className: "bg-warning/15 text-warning" },
    DELETED: { label: "D", className: "bg-danger/15 text-danger" },
    IGNORED: { label: "I", className: "bg-text-muted/15 text-text-muted" },
    UNKNOWN: { label: "?", className: "bg-text-muted/15 text-text-muted" },
};

export default function EntryItem({
    entryFile, isSelected, onClick, repoPath, onAction
}: {
    entryFile: FileInfo, isSelected: boolean, onClick: () => void, repoPath: string, onAction: () => void
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [stagedOverride, setStagedOverride] = useState<boolean | null>(null);

    const isStaged = stagedOverride ?? entryFile.is_staged;
    const { label, className } = statusConfig[entryFile.status] ?? statusConfig["UNKNOWN"];

    const handleAddBtn = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLoading) return;
        setIsLoading(true);
        setStagedOverride(true);
        try {
            await invoke("git_add", { path: repoPath, filePath: entryFile.path });
            onAction();
        } catch (err) {
            setStagedOverride(null);
            console.error("git_add failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveBtn = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLoading) return;
        setIsLoading(true);
        setStagedOverride(false);
        try {
            await invoke("git_remove", { path: repoPath, filePath: entryFile.path });
            onAction();
        } catch (err) {
            setStagedOverride(null);
            console.error("git_remove failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            onClick={onClick}
            className={`w-full flex flex-row items-center gap-3 px-3 py-2 cursor-pointer border border-border rounded-sm transition-all duration-100
            ${isSelected ? "bg-bg-elevated" : "hover:bg-bg-elevated"}`}>
            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-sm shrink-0 ${className}`}>
                {label}
            </span>

            <p className={`text-sm font-mono truncate flex-1 ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                {entryFile.path}
            </p>

            {!entryFile.is_ignored && entryFile.status !== "DELETED" && (
                <button
                    onClick={isStaged ? handleRemoveBtn : handleAddBtn}
                    disabled={isLoading}
                    className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold rounded-sm text-sm cursor-pointer transition-all duration-100 disabled:opacity-50
                    ${isStaged
                            ? "bg-accent-subtle text-accent hover:bg-danger hover:text-text-primary"
                            : "bg-accent text-text-primary hover:bg-accent-hover"
                        }`}>
                    {isStaged ? "−" : "+"}
                </button>
            )}
        </div>
    );
}
