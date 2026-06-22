import { useStore } from "./store"
import { Button } from "./sub_components"

interface props { }

export default function ErrorWindow({ }: props) {
    const { error, setError } = useStore();

    return (
        <div className="absolute inset-0 flex items-center justify-center z-200 bg-black/40">
            <div className="w-2xl bg-bg-elevated border border-border rounded-md flex flex-col">
                <div className="flex flex-row justify-between items-center p-3 border-b border-border">
                    <p className="text-text-secondary">Error</p>
                    <Button
                        value={"x"}
                        width={2}
                        height={2}
                        fontSize={14}
                        onClick={() => setError({ error: "", files: [] })}
                        className="bg-danger border-danger hover:bg-transparent"
                    />
                </div>
                <div className="flex flex-col gap-3 p-4">
                    <div className="w-full bg-bg-surface border border-border rounded-md p-3 flex flex-row gap-2">
                        <p className="text-text-muted text-sm shrink-0">-{'>'}</p>
                        <p className="text-text-primary text-sm break-all">
                            {error.error !== "" ? error.error : "No error :)"}
                        </p>
                    </div>
                    <div className="flex flex-row justify-end">
                        <Button
                            value={"Dismiss"}
                            width={6}
                            height={2.5}
                            fontSize={14}
                            onClick={() => setError({ error: "", files: [] })}
                            className="tracking-wide bg-border hover:bg-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}