import { useState } from "react";
import Button from "./Button"

interface props{
    value: string
    onClick: () => void
    trigger: React.ReactNode
}

export default function AreYouSure({ value, onClick,trigger }: props) {
    const [showWindow, setShowWindow] = useState<boolean>(false);
    return (
        <>
            <div onClick={() => setShowWindow(true)}>
                {trigger}
            </div>
            {showWindow && (
                <div className="absolute inset-0 flex items-center justify-center z-200 bg-black/40">
                    <div className="w-2xl bg-bg-elevated border border-border rounded-md flex flex-col">
                        <div className="flex flex-row justify-between items-center p-3 border-b border-border">
                            <p className="text-text-secondary">Are You Sure?</p>
                        </div>
                        <div className="flex flex-col gap-3 p-4">
                            <div className="w-full bg-bg-surface border border-border rounded-md p-3 flex flex-row gap-2 items-center justify-between">
                                <div className="flex flex-row gap-2">
                                    <p className="text-text-muted text-md shrink-0">-{'>'}</p>
                                    <p className="text-text-primary text-md shrink-0">{value}</p>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <Button value="yes" onClick={() => { onClick(); setShowWindow(false) }} width={2} height={2} fontSize={12} className=" border-success bg-transparent hover:bg-success font-mono-bold hover:text-text-muted" />
                                    <Button value="no" onClick={() => setShowWindow(false)} width={2} height={2} fontSize={12} className=" border-danger bg-transparent hover:bg-danger font-mono-bold hover:text-text-muted" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}