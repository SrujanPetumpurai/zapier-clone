'use client'
export const Input = ({label,placeholder,onChange,value,type='text'}:{value:string,label:string,placeholder:string,onChange:(e:any)=>void,type?:'text'|'password'})=>{
    return(
        <div>
            <div>
                <label className="text-sm pb-1 pt-2">{label}</label>
            </div>
            <input  className="border rounded px-4 py-2 w-full border-black" onChange={onChange} placeholder={placeholder}  value={value} type={type} />
        </div>
    )
}