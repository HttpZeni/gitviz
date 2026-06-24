export default function Loading({value}: {value: string}){
    return (
        <div className="absolute inset-0 flex items-center justify-center z-200 bg-black/40">
            <div className="w-2xl bg-bg-elevated border border-border rounded-md flex flex-col">
                <div className="flex flex-row justify-between items-center p-3 border-b border-border">
                    <p className="text-text-secondary">Loading</p>
                </div>
                <div className="flex flex-col gap-3 p-4">
                    <div className="w-full bg-bg-surface border border-border rounded-md p-3 flex flex-row gap-2">
                        <p className="text-text-muted text-sm shrink-0">-{'>'}</p>
                        <p className="text-text-primary text-sm shrink-0">{value}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}