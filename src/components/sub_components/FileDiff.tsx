import { useEffect } from "react";
import Button from "./Button"
import { useStore } from "../store";
import { get_file_diffs } from "../utils/utils";

export default function FileDiff(){
    const {selectedFile, setError, setSelectedFile} = useStore();

    useEffect(() => {
        async function load() {
            try {
                if (selectedFile == null) return;
                const file_diff = await get_file_diffs(selectedFile.path);
                const lines = file_diff.split('\n').filter(l => l.length > 0);
                setSelectedFile({ ...selectedFile, diffs: lines }); 
            }
            catch (error) {
                setError({ error: String(error) });
            }
        }
        load();
    }, [selectedFile?.path])

    return(
        <div>
            {
                selectedFile != null && selectedFile.diffs != undefined && (
                    <div className="h-full w-full bg-bg-base font-mono">
                        <div className="flex w-full items-center justify-end p-2">
                            <Button onClick={() => { setSelectedFile(null) }} value={"X"} width={2} height={2} className="bg-danger border-danger hover:bg-transparent" />
                        </div>

                        {selectedFile != null && (
                            selectedFile.diffs.length === 0
                                ? <p className="text-text-primary px-2">Can't find any file changes!</p>
                                : selectedFile.diffs.map((line, i) => {
                                    const origin = line[0];
                                    const cls =
                                        origin === '+' ? 'text-green-400 bg-green-950/10' :
                                            origin === '-' ? 'text-red-400 bg-red-950/10' :
                                                origin === '@' ? 'text-blue-400 bg-blue-950/10' :
                                                    'text-text-secondary';
                                    return (
                                        <pre key={i} className={`px-2 ${cls}`}>{line}</pre>
                                    );
                                })
                        )}
                    </div>
                )
            }
        </div>
    )
}