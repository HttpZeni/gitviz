import { useState } from "react"

interface props {
    childs: { key: number | string, value: string }[]
    label: string
    width?: number
    height?: number
    fontSize?: number
    className?: string;
    selected?: number | string
    onClick?: () => void
    setSelected: React.Dispatch<React.SetStateAction<number | string>>;
}

export default function DropDown({ childs, label, width = 3.5, height = 2, fontSize = 12, className, selected, setSelected, onClick }: props) {
    const [active, setActive] = useState<boolean>(false);
    return(
        <div className="relative">
            <div onClick={() => setActive(!active)}
                style={{ width: `${width}rem`, height: `${height}rem`, fontSize: `${fontSize}px` }}
                className={`flex items-center justify-center rounded-md cursor-pointer ${active ? "border-b-0 rounded-b-none" : "border-b-border rounded-b-lg"} border transition-all duration-100 border-border text-text-primary text-sm font-mono ${className} z-50`}>
                {label}
            </div>

            {active && (
                <div style={{ width: `${width}rem` }} className="absolute max-h-52 overflow-y-scroll top-full left-0 flex flex-col gap-2 p-2 border border-t-0 border-border z-50 bg-bg-surface">
                    {childs.map((child) => (
                        <div onClick={() => { setSelected(child.key); onClick; setActive(false) }} style={{ height: `${height}rem` }} className={`border border-border ${selected != undefined && selected == child.key ? "bg-border" : "bg-transparent"} hover:bg-bg-overlay w-full rounded-lg flex items-center justify-center cursor-pointer text-text-primary text-sm font-mono transition-all duration-100 `}>
                            {child.value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}