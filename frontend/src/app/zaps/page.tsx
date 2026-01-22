'use client'
import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Zap{
    "id":string,
    "trigger":{
        "id":string,
        "zapId":string,
        "availableTriggerId":string,
        "triggerMetadata":Record<string,any>,   
    }|null,
    "userId":number,
    "actions":{
        "id":string,
        "zapId":string,
        "availableActionId":string,
        "metadata":Record<string,any>,
        "sortingOrder":number
    }[],
    "zapRun":any[],
    "updatedAt":Date,
    "isActive":boolean,
    "name":string
}
export default function zaps(){
                const router = useRouter();
                const createZap =  ()=>[
                    router.push('/createzap')
                ]
        const [zaps,setZaps] = useState<Zap[]>([]);
    useEffect(()=>{
        const fetchData = async()=>{
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:4000/zaps',{
                method:"GET",
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-type':'application/json'
                }
            })
            const data = await res.json();
                 setZaps(
                        data.zaps.map((zap: any) => ({
                            ...zap,
                            updatedAt: new Date(zap.updatedAt),
                        }))
                        );

        }
        fetchData();
    },[])
    return(
        <div className="flex w-full mt-32  justify-center">
            <div className=" pl-12 w-[30%]">
                <button onClick={()=>{createZap()}} className="w-[50%] flex items-center justify-center rounded-xl text-xl bg-orange-600  px-3 py-1 text-white">Create Zap <span className="text-3xl font-bold relative bottom-0.5     ml-4">+</span>  </button>
            </div>
            <ZapTable zaps={zaps}></ZapTable>
        </div>
    )
}

function ZapTable({zaps}:{zaps:Zap[]}){
    return(
        <div className="w-[70%]">
            <table className="table-auto w-[70%] border-separate border-spacing-y-2  ">
                <thead className="w-[70%]">
                    <tr>
                    <th className="text-gray-600 border-gray-300 border  px-2 py-1 w-[10%]  ">Trigger</th>
                    <th className="text-gray-600 border-gray-300 border  px-2 py-1 w-[10%]  ">Name</th>
                    <th className="text-gray-600 border-gray-300 border  px-2 py-1 w-[10%]  ">Last edit</th>
                    <th className="text-gray-600 border-gray-300 border  px-2 py-1 w-[10%]  ">Running</th>
                    </tr>
                </thead>
                <tbody>
                    {zaps.map((zap)=>(
                        <tr className="pb-16" key={zap.id}>
                            <td>{zap.trigger?.availableTriggerId}</td>
                            <td >{zap.name}</td>
                            <td>{zap.updatedAt.toLocaleDateString("en-US",{
                                year:'numeric',
                                month:'short',
                                day:"numeric"
                            })}</td>
                            <td>{zap.isActive?'Active':'NotActive'}</td>
                        </tr>
                    ) )}
                </tbody>    
                </table>
        </div>
    )
}