export const PrimaryBtn = ({text,onClick}:{text:string,onClick:()=>void})=>{
    return(
        <div onClick={onClick} className="pt-1 pb-1 px-2 ml-1 hover:bg-slate-50 cursor-pointer hover:rounded">   
        {text}
        </div>
    )
}