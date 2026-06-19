import { useState } from "react";
import { FileInfo } from "../utils/types"
import { statusConfig, git_add_stage, git_remove_stage, get_entrys } from "../utils/utils"
import Button from "./Button";
import { useStore } from "../store";

interface props{
    file: FileInfo
}

export default function StageFile({file}: props){
    const {setStageFiles, stagedFiles} = useStore();
    const currentFile = stagedFiles.find(f => f.path === file.path) ?? file;
    const [active, setActive] = useState<boolean>(false);
    const config = statusConfig[file.status];

    const handleAdd = async() => {
        await git_add_stage(file);
        const staged_files = await get_entrys();
        setStageFiles(staged_files);
    }
    const handleRemove = async () => {
        await git_remove_stage(file);
        const staged_files = await get_entrys();
        setStageFiles(staged_files);
    }

    return(
        <div className="w-full h-12 flex flex-row gap-2 p-2 border border-border rounded-lg items-center justify-between">
            <div className="flex flex-row gap-2 text-text-primary">
                <p>-{'>'}</p>
                <Button onClick={() => setActive(!active)} width={active ? 4.5 : 1.5} height={1.5} value={active ? config.label : config.short} className={`${config.className} p-1 px-2 rounded-lg border-none hover:bg-accent/20`} />
                <p>{file.path}</p>
            </div>
            <div>
                {
                    !currentFile.is_staged && !currentFile.is_ignored ? (
                        <Button value="+" onClick={handleAdd} width={2} height={2} fontSize={26} className={`text-black! border-success bg-success hover:bg-transparent hover:text-text-primary!`}/>
                    ) : !currentFile.is_ignored && currentFile.is_staged && (
                        <Button value="-" onClick={handleRemove} width={2} height={2} fontSize={26} className={`text-black! border-danger bg-danger hover:bg-transparent hover:text-text-primary!`} />
                    )
                }
            </div>
        </div>
    )
}