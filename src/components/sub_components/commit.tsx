export enum commitStages { MODIFIED, NEW, RENAMED, DELETED, IGNORED, UNTRACKED }

const stageConfig: Record<commitStages, { bg: string; text: string; short: string; label: string }> = {
    [commitStages.NEW]: { bg: "bg-success", text: "text-success", short: "A", label: "ADDED" },
    [commitStages.MODIFIED]: { bg: "bg-warning", text: "text-warning", short: "M", label: "MODIFIED" },
    [commitStages.RENAMED]: { bg: "bg-warning", text: "text-warning", short: "R", label: "RENAMED" },
    [commitStages.DELETED]: { bg: "bg-danger", text: "text-danger", short: "D", label: "DELETED" },
    [commitStages.IGNORED]: { bg: "bg-text-muted", text: "text-text-muted", short: "I", label: "IGNORED" },
    [commitStages.UNTRACKED]: { bg: "bg-text-muted", text: "text-text-muted", short: "U", label: "UNTRACKED" },
};

export default function Commit({ stage, dir }: { stage: commitStages, dir: string }) {
    const { bg, short, label } = stageConfig[stage];
    return (
        <div className="flex flex-row justify-between">
            <p className={`text-sm font-mono rounded px-1.5 ${bg}`}>{short}</p>
            <p className="text-text-primary text-sm font-sans pl-3 truncate">{dir}</p>
        </div>
    );
}