import { useEffect, RefObject } from "react";

export default function useClickOutside(ref: RefObject<HTMLElement | null>, onClose: () => void) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
}