import { useEffect } from "react";
import Button from "./Button"
import { useStore } from "../store";
import { get_commit_file_diffs } from "../utils/utils";

export default function FileDiff({ hash }: { hash: string }) {
    const { selectedFile, setError, setSelectedFile } = useStore();

    useEffect(() => {
        async function load() {
            try {
                if (selectedFile == null || !hash) return;
                const file_diff = await get_commit_file_diffs(selectedFile.path, hash);
                const lines = file_diff.split('\n').filter(l => l.length > 0);
                setSelectedFile({ ...selectedFile, diffs: lines });
            } catch (error) {
                setError({ error: String(error) });
            }
        }
        load();
    }, [selectedFile?.path, hash])

    if (selectedFile == null || selectedFile.diffs == undefined) return null;

    return (
        <div className="h-full w-full bg-bg-overlay border-l border-border flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
                <span className="text-text-primary truncate font-mono-bold tracking-widest">{selectedFile.path}</span>
                <Button
                    onClick={() => setSelectedFile(null)}
                    value="x"
                    width={2} height={2}
                    fontSize={18}
                    className="bg-transparent border-danger text-text-muted hover:bg-danger "
                />
            </div>

            <div className="overflow-y-auto flex-1">
                {selectedFile.diffs.length === 0 ? (
                    <p className="text-text-muted px-3 py-2">No changes found.</p>
                ) : (
                    selectedFile.diffs.map((line, i) => {
                        const origin = line[0];
                        const cls =
                            origin === '+' ? 'text-success bg-success/5' :
                                origin === '-' ? 'text-danger bg-danger/5' :
                                    origin === '@' ? 'text-text-muted bg-bg-base' :
                                        'text-text-secondary';
                        return (
                            <pre key={i} className={`px-3 py-px leading-5 ${cls}`}>{line}</pre>
                        );
                    })
                )}
            </div>
        </div>
    );
}