"use client";
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { userDetailContext } from '@/context/UserDetailContext'; // Fixed import
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './_components/AppSidebar';

export default function WorkspaceProvider({ children }) {
  const newUserMutation = useMutation(api.users.CreateNewUser);
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  const createNewUser = async () => {
    try {
      const result = await newUserMutation({
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        picture: user?.imageUrl
      });
      setUserDetail(result);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  return (
    <userDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <SidebarProvider>
        <AppSidebar />
        <div className='w-full p-10'>
          <SidebarTrigger />
          {children}
        </div>
      </SidebarProvider>
    </userDetailContext.Provider>
  );
}