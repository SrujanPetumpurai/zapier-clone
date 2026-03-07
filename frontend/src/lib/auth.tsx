import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
export default function Auth(){
    const router = useRouter();
    const {status} = useSession({
        required:true,
        onUnauthenticated(){
            router.push('/signIn')
        }
    })
    if(status=='loading'){
        return 'Loading or unauthenticated'
    }
    
    return 'User logged in'
}