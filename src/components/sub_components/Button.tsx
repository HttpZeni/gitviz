interface props{
    value: string
    width?: number
    height?: number
    fontSize?: number
    onClick?: () => void;
    className?: string;
}

export default function Button({ value, width = 3.5, height = 2, onClick, fontSize = 12, className}: props){
    return(
        <div onClick={onClick}
            style={{ width: `${width}rem`, height: `${height}rem`, fontSize: `${fontSize}px` }}
            className={`flex items-center justify-center rounded-md cursor-pointer border transition-all duration-100 border-border text-text-primary text-sm font-mono ${className}`}>
            {value}
        </div>
    )
}