export enum commitStages { MODIFIED, NEW, RENAMED, DELETED, IGNORED, UNTRACKED}

export default function Commit({stage, dir}: {stage: commitStages, dir: string}){
    let color = "";
    let stateName = "";
    switch(stage) {
        case commitStages.NEW:
            color = "success";
            stateName = "NEW";
            break;
        case commitStages.MODIFIED:
            color = "warning";
            stateName = "MODIFIED";
            break;
        case commitStages.RENAMED:
            color = "warning";
            stateName = "RENAMED";
            break;
        case commitStages.DELETED:
            color = "danger";
            stateName = "DELETED";
            break;
        case commitStages.IGNORED:
            color = "text-muted";
            stateName = "IGNORED";
            break;
        case commitStages.UNTRACKED:
            color = "text-muted";
            stateName = "UNTRACKED";
            break;
    }
    return(
        <div className="flex flex-row justify-between">
            <p className={`text-${color} text-sm font-mono`}>{stateName}</p>
            <p className={`text-text-primary text-sm font-sans pl-3 truncate`}>{dir}</p>
        </div>
    )
}