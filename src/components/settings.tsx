import { useState } from "react";
import { useStore } from "./store"
import { Button } from "./sub_components";

export default function Settings() {
    const { openSettings, setOpenSettings, userName, setUserName, token, setToken, settingsInfos, setSettingsInfos } = useStore();
    const [commitLimit, setCommitLimit] = useState<number>(50);
    const [commitCacheSize, setCommitCacheSize] = useState<number>(50);
    const [lazyLoading, setLazyLoading] = useState<boolean>(false);
    

    const handleCommitLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setCommitLimit(value);
        setSettingsInfos({...settingsInfos, commitLimit: value});
    }
    const handleCommitCacheSize = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setCommitCacheSize(value);
        setSettingsInfos({ ...settingsInfos, commitCacheSize: value });
    }
    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    }
    const handleToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToken(e.target.value);
    }

    return(
        <>
            {
                openSettings && (
                    <div className="absolute transition-all duration-100 right-0 bg-bg-base/75 border-l border-border w-1/3 h-full z-150 flex flex-col gap-5 px-5">
                        <div className="w-full h-16 items-center justify-between flex flex-row gap-5">
                            <p className="text-text-secondary">Settings</p>
                            <Button value="X" width={4} height={2} onClick={() => setOpenSettings(false)} className="bg-danger border-danger hover:bg-transparent"/>
                        </div>
                        <h1 className="text-text-primary text-2xl">Performance:</h1>
                        <div className="w-full h-54 pl-15 text-text-secondary flex flex-col gap-5">
                            <div className="w-full h-10 items-center flex flex-row gap-5">
                                <p>Commit limit {'>'}</p>
                                <input type="number" onChange={handleCommitLimit} value={commitLimit} onKeyDown={() => { }} onWheel={(e) => e.preventDefault()} placeholder="50" className="h-full w-12 outline-none border border-border rounded-md bg-bg-surface transition-all duration-100 px-2 text-text-primary text-md" />
                                <p className="ml-15">Cache size {'>'}</p>
                                <input type="number" onChange={handleCommitCacheSize} value={commitCacheSize} onKeyDown={() => { }} placeholder="50" className="h-full w-12 outline-none border border-border rounded-md bg-bg-surface transition-all duration-100 px-2 text-text-primary text-md" />
                                <p className="ml-15">Lazy Loading {'>'}</p>
                                <Button value={`${lazyLoading ? "✔" : "✖"}`} width={2.5} height={2.5} onClick={() => {setLazyLoading(!lazyLoading); setSettingsInfos({...settingsInfos, lazyLoading: !lazyLoading})}} fontSize={22} className={`border text-text-muted ${lazyLoading ? "bg-success border-success" : "bg-danger border-danger"} hover:bg-transparent hover:text-text-primary`}/>
                            </div>
                        </div>
                        <h1 className="text-text-primary text-2xl">Remote:</h1>
                        <div className="w-full h-54 pl-15 text-text-secondary flex flex-col gap-5">
                            <div className="w-full h-10 items-center flex flex-row gap-5">
                                <p>Username {'>'}</p>
                                <input type="text" onChange={handleUsername} value={userName} onKeyDown={() => { }} placeholder={userName} className="h-full w-32 outline-none border border-border rounded-md bg-bg-surface transition-all duration-100 px-2 text-text-primary text-md" />
                                <p className="ml-15">Token {'>'}</p>
                                <input type="password" onChange={handleToken} value={token} onKeyDown={() => { }} placeholder={token} className="h-full w-32 outline-none border border-border rounded-md bg-bg-surface transition-all duration-100 px-2 text-text-primary text-md" />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}