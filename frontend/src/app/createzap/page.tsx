'use client'
import Zapcell from "@/components/Zapcell"
import { PrimaryBtn } from "@/components/PrimaryBtn"
import { useState,useEffect } from "react"
import { Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import { Input } from "../../components/Input"
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import './createzap.css'


export default function CreateZap(){
        const [availableTrigger,setAvailableTrigger] = useState<{id:string,name:string,image:string}[]>([])
        const [availableAction,setAvailableAction] = useState<{id:string,name:string,image:string}[]>([])
             

        const [modalIndex,setModalIndex] = useState<null|number>(null)
        const [trigger,setTrigger] = useState<{
          name:string,
          triggerMetadata:any,
          availableTriggerId:string
        }>()
        const [actions,setActions]=useState<{
            name:string,
            index:number,
            actionMetadata:any,
            availableActionId:string,
        }[]>([])
    useEffect(()=>{
        const getAvailableData = async()=>{
            const token = localStorage.getItem('token')
            try{
            const availableaction = await fetch(`http://localhost:4000/action`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":`Bearer ${token}`
                },
                
            })
            const availabletrigger = await fetch(`http://localhost:4000/trigger`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":`Bearer ${token}`
                },
                
            })
            const triggerdata = await availabletrigger.json()
            const actiondata = await availableaction.json()
            setAvailableTrigger(triggerdata.triggerTypes)
            setAvailableAction(actiondata.actionTypes)
            console.log("code is below setAvailableTrigger")
            console.log(triggerdata.triggerTypes)
          }catch(e){
            console.log('Unable to get data from the backend')
          }
        }
        getAvailableData()
    },[])
    
    const changeModalIndex = ()=>{
      setModalIndex(null)
    }
        
        return(
            <div className="createzap text-4xl h-screen w-full flex flex-col items-center font-bold pt-38 pl-8 ">
              <PrimaryBtn text='Publish' onClick={()=>
                
                fetch('http://localhost:4000/zaps',{
                  method:"POST",
                   headers:{
                    "Content-Type":"application/json",
                    "authorization":`Bearer ${localStorage.getItem('token')}`
                },
                body:JSON.stringify({
                  name:'zapDiddy',
                  actions:actions,
                  availableTriggerId:trigger?.availableTriggerId,
                  triggerMetadata:trigger?.triggerMetadata
                })

                })
              }></PrimaryBtn>

                <div>
                            <Zapcell onClick={()=>setModalIndex(1)} idx={1} name={trigger?.name?trigger.name:'Trigger'}></Zapcell>
                </div>
                    <div>
                        {actions.map((action,index)=>(
                            <Zapcell onClick={()=>setModalIndex(2+index)} idx={2+index} name={action.name?action.name:'Action'}></Zapcell>
                        )
                        )}
                    </div>
                <div>
                    <PrimaryBtn onClick={()=>{
                        setActions((a)=> [...a,{
                            name:'',
                            index:a.length+1,
                            actionMetadata:{},
                            availableActionId:''
                        }])
                    }} text="+"></PrimaryBtn>
                </div>
                <div>
                  
                    {modalIndex && <Modal indexFunction = {changeModalIndex} onSelect={(props:null|{name:string,metadata:any,id:string})=>{
                      if(!props){
                        setModalIndex(null)
                        return;
                      }
                      if(modalIndex==1){
                        setTrigger({name:props.name,triggerMetadata:props.metadata,availableTriggerId:props.id})
                        setModalIndex(null)
                      }
                      else{
                        setActions((a)=>{
                        let newActions =[...a];
                        newActions[modalIndex-2]={index:modalIndex,actionMetadata:props.metadata,availableActionId:props.id,name:props.name}
                        setModalIndex(null)
                        return newActions
                        }
                    )
                      }
                    }} index={modalIndex} availableItems={modalIndex==1?availableTrigger:availableAction}></Modal>}
                </div>
        </div>
    )
}





function Modal({availableItems,onSelect,indexFunction,index}:{index:number|null,indexFunction:()=>void,onSelect:(props:null|{name:string,metadata:any,id:string})=>void,availableItems:{name:string,image:string,id:string}[]}) {
  const [open, setOpen] = useState(true)
  const isTrigger = index ===1;
  const [step,setStep]=useState(0);
  const [selectedAction,setSelectedAction] = useState<{
    name:string,
    id:string
  }>()
  return (
    <div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
               {step==1 && selectedAction?.name=='Email' && 
                   <EmailSelector setMetadata={(metadata)=>{
                    onSelect({
                       metadata,
                      ...selectedAction
                    })
                   }}></EmailSelector> 
                }
               {step==1 && selectedAction?.name=='Solana' && 
               <SolanaSelector setMetadata={(metadata)=>{
                    onSelect({
                       metadata,
                      ...selectedAction
                    })
                   }}></SolanaSelector>
                }

               {step==0 && <div className="bg-gray-800 sm:flex sm:items-start px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {Array.isArray(availableItems) && availableItems.map((item)=>(
                  <div className="m-2" onClick={()=>{
                    if(isTrigger){
                      onSelect({id:item.id,name:item.name,metadata:{}})
                    }else{
                      setStep(s=>s+1);
                      setSelectedAction({
                        id:item.id,
                        name:item.name
                      })
                    }

                    }} key={item.id}>
                    {item.name}Item no. 1 here
                  </div>
                ))}
                
              </div>} 
              <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                onClick={() => {setOpen(false) 
                   indexFunction()}}
                  className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                >
                  Deactivate
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

function EmailSelector({setMetadata}:{setMetadata:(props:{email:string,body:string})=>void}){
  const [email,setEmail]=useState<string>('')
  const [body,setBody]=useState('')
  return(
    <div>
      <Input placeholder="To" label="To" value={email} onChange={(e)=>setEmail(e.target.value)}></Input>
      <Input placeholder="Body" label="Body" value={body} onChange={(e)=>setBody(e.target.value)}></Input>
      <button onClick={()=>setMetadata({email,body})}>Submit</button>
    </div>
  )
}

function SolanaSelector({setMetadata}:{setMetadata:(props:{amount:string,address:string})=>void}){
   const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");    

    return (<div>
        <Input value={amount}  label={"To"} type={"text"} placeholder="To" onChange={(e) =>setAmount(e.target.value) }></Input>
        <Input value={address} label={"Amount"} type={"text"} placeholder="To" onChange={(e) =>setAddress(e.target.value) }></Input>
        <button onClick={()=>setMetadata({amount,address})}>Submit</button>
    </div>
  )
}
