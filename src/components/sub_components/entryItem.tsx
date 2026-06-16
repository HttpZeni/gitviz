import { FileInfo } from "../../App";

export default function EntryItem({ entryFile, isSelected, onClick }: { entryFile: FileInfo, isSelected: boolean, onClick: () => void }) {
    let color = "";
    switch(entryFile.status) {
        case "STAGED":
            color = "success"
            break;
        case "UNTRACKED":
            color = "text-muted"
            break;
        case "MODIFIED":
            color = "warning"
            break;
    }

    return (
        <div
            onClick={onClick}
            className={`w-full flex flex-row gap-3 px-3 py-3 cursor-pointer border border-border transition-all duration-100 rounded-sm
            ${isSelected ? "bg-bg-surface" : "hover:bg-bg-surface"}`} >

            <div className="w-full flex flex-row items-center justify-between">
                <p className={`text-sm font-sans truncate text-${color}`}>
                    {entryFile.status}
                </p>
                <p className={`text-sm font-sans truncate ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                    {entryFile.path}
                </p>
            </div>
        </div>
    );
}
