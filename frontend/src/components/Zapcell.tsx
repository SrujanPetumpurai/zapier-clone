export default function Zapcell({onClick,name,idx}:{name:string,idx:number,onClick:()=>void}){
    return(
        <div onClick={onClick} className="flex border mb-4 py-4 px-4 w-[300px]">
            <span className="pl-4">{idx}</span>
            <span>{name}</span>
        </div>
    )
}