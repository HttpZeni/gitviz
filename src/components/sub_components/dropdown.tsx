import { useRef, useState } from "react"
import useClickOutside from "./ClickOutside"

interface props {
    childs: { key: number | string, value: string }[]
    label: string
    width?: number
    height?: number
    fontSize?: number
    className?: string;
    selected?: number | string
    emptyText?: string
    onClick?: () => void
    down?: boolean
    childMinHeight?: number
    setSelected: React.Dispatch<React.SetStateAction<number | string>>;
}

export default function DropDown({ childs, label, width = 3.5, height = 2, fontSize = 12, className, selected, setSelected, onClick, emptyText = "", down = true, childMinHeight = 2}: props) {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<boolean>(false);
    useClickOutside(ref, () => setActive(false)); 
    return(
        <div ref={ref} className="relative z-50 shrink-0">
            <div onClick={() => setActive(!active)}
                style={{ width: `${width}rem`, height: `${height}rem`, fontSize: `${fontSize}px` }}
                className={`px-1 flex items-center justify-center rounded-md cursor-pointer ${active ? down ? "border-b-0 rounded-b-none" : "border-t-0 rounded-t-none" : "rounded-lg"} border transition-all duration-100 border-border text-text-primary text-sm font-mono ${className} z-50`}>
                {label}
            </div>

            {active &&  (
                <div style={{ width: `${width}rem` }} className={`absolute max-h-72 rounded-b-lg overflow-y-scroll ${down ? "top-full rounded-b-lg rounded-t-none border-t-0" : "bottom-full rounded-t-lg rounded-b-none border-b-0"} left-0 flex flex-col gap-2 p-2 border border-border z-50 bg-bg-surface`}>
                    {childs.length > 1 ? childs.map((child) => (
                        <div onClick={() => { setSelected(child.key); onClick; setActive(false) }} style={{ height: `${height}rem`, minHeight: `${childMinHeight}rem` }} className={`border border-border ${selected != undefined && selected == child.key ? "bg-border" : "bg-transparent"} hover:bg-bg-overlay w-full rounded-lg flex items-center justify-center cursor-pointer text-text-primary text-sm font-mono transition-all duration-100 `}>
                            {child.value}
                        </div>
                    )) :
                    (
                        <div className="text-text-primary text-sm w-full h-full flex items-center justify-center">
                            {emptyText}
                        </div>
                    )
                }
                </div>
            )}
        </div>
    )
}