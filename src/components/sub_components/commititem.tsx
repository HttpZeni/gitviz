export default function CommitItem({ hash, message, author, date, tags, isSelected, isFirst, onClick, }: { hash: string; message: string; author: string; date: string; tags: string[]; isSelected: boolean; isFirst: boolean; onClick: () => void; }) {
    return (
        <div
            onClick={onClick}
            className={`w-full flex flex-row gap-3 px-3 py-3 cursor-pointer border-b border-border-subtle transition-all duration-100 
            ${isSelected ? "bg-bg-elevated" : "hover:bg-bg-surface"}`} >
            <div className="flex flex-col items-center shrink-0 pt-1">
                <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${isFirst ? "border-accent bg-accent/30" : "border-border bg-transparent"}`} />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
                {tags.length > 0 && (
                    <div className="flex flex-row gap-1.5 flex-wrap">
                        {tags.map((tag) => (
                            <span key={tag} 
                            className={`text-[10px] px-1.5 py-0.5 rounded-sm font-mono font-semibold
                                    ${tag === "HEAD" ? "bg-accent-subtle text-accent" : "bg-bg-overlay text-text-secondary"}`} >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <p className={`text-sm font-sans truncate ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                    {message}
                </p>

                <p className="text-xs font-mono text-text-muted">
                    {hash} - {author} - {date}
                </p>
            </div>
        </div>
    );
}
