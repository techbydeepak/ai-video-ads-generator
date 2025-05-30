"use client"
import {api} from '@/convex/_generated/api'
import {useMutation} from 'convex/react'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { userDetailContext } from '@/context/UserDetailContext'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'

function WorkspaceProvider({children}) {
    const newUserMutation=useMutation(api.users.CreateNewUser)
    const {user} = useUser()
    const [userDetail,setUserDetail] = useState()
    useEffect(() => {
        if (user) {
          CreateNewUser();
        }
      }, [user]);
      
    const CreateNewUser= async () =>{

        const result = await newUserMutation({

            name:user?.fullName,
            email:user?.primaryEmailAddress?.emailAddress,
            picture:user?.imageUrl
        })
        console.log(result);
        setUserDetail(result)
        
    }
  return (
   
      <userDetailContext.Provider value={{userDetail, setUserDetail}}>
      <SidebarProvider>
        <AppSidebar/>
      <div className='w-full p-10'>  <SidebarTrigger/> {children} </div>
      </SidebarProvider>
      </userDetailContext.Provider>
      
   
  )
}

export default WorkspaceProvider
