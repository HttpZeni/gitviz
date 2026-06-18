import { invoke } from "@tauri-apps/api/core";

export default function UnpushedCommitItem({ repoPath, branch, userName, token, hash, message, author, date, tags, isSelected, isFirst, onClick, isLast = false, onAction }: 
    { hash: string; message: string; author: string; date: string; tags: string[]; isSelected: boolean; isFirst: boolean; isLast?: boolean; onClick: () => void; repoPath: string; branch: string; userName: string; token: string; onAction: () => void }) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        async function load(){
            await invoke("git_push_commit", { path: repoPath, branch: branch, username: userName, token: token, commitHash: hash })
            onAction();
        }
        load();
    }
    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        async function load() {
            await invoke("remove_unpushed_commit", { path: repoPath, hash: hash })
            onAction();
        }
        load();
    }
    
    return (
        <div
            onClick={onClick}
            className={`w-full flex flex-row gap-3 px-3 py-2 cursor-pointer transition-all duration-100 rounded-sm
            ${isSelected ? "bg-bg-elevated" : "hover:bg-bg-elevated"}`}>

            <div className="flex flex-col items-center shrink-0 pt-1">
                <div className={`w-2.5 h-2.5 rounded-full border-2 shrink-0
                    ${isFirst ? "border-accent bg-accent/30" : "border-border bg-transparent"}`} />
                {!isLast && <div className="w-px flex-1 bg-border mt-1 min-h-3" />}
            </div>

            <div className="flex flex-col gap-0.5 min-w-0 pb-1">
                {tags.length > 0 && (
                    <div className="flex flex-row gap-1.5 flex-wrap mb-0.5">
                        {tags.map((tag) => (
                            <span key={tag}
                                className={`text-[10px] px-1.5 py-0.5 rounded-sm font-mono font-semibold
                                    ${tag === "HEAD" ? "bg-accent-subtle text-accent" : "bg-bg-overlay text-text-secondary"}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <p className={`text-sm font-sans truncate ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                    {message}
                </p>

                <p className="text-xs font-mono text-text-muted">
                    <span className="text-accent/70">{hash.slice(0, 7)}</span>
                    {" · "}{author}{" · "}{date}
                </p>
            </div>
            {
                isLast && (
                    <div className="w-full flex flex-row gap-2 items-center justify-end">
                        <button onClick={handleRemoveClick} className="bg-danger border border-danger rounded py-1 px-2 transition-all duration-100 cursor-pointer font-semibold font-mono hover:bg-transparent hover:text-text-primary">{`<`}-</button>
                        <button onClick={handleClick} className="bg-accent border border-accent rounded py-1 px-2 transition-all duration-100 cursor-pointer font-semibold font-mono hover:bg-transparent hover:text-text-primary">-{`>`}</button>
                    </div>
                )
            }
        </div>
    );
}
