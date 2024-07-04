'use client'
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
   
   const {user,isSignedIn} = useUser();
   
   
   const route=useRouter();
   const newRoute=()=>{
      route.replace('/dashboard')
   }
   
   return (
      
    <div className='p-5 flex justify-between items-center border shadow-sm'>
       
       <Image src = {'./logo.svg'}
        alt='logo'
        width = {160}
        height= {100}
       />

       {isSignedIn ?
       <div className="flex gap-2 items-center"> 
         <Button onClick={()=>newRoute()}>
         Dashboard
       </Button>
       <UserButton/>
       
       </div> : 
       <Link href={'/sign-in'}>
       <Button>
        Get Started
       </Button>
       </Link>
       }
       
  
    </div>
      
    )
  }
  
  export default Header