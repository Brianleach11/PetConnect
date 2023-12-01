'use client'
import { useState, useEffect, FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { Button } from "./ui/button";
import * as Dialog from '@radix-ui/react-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from "next/navigation";

interface AccountSettingsCardProps {
    userId: string
}

const AccountSettingsCard: FC<AccountSettingsCardProps> = ({ userId }) => {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const router = useRouter()

    const supabase = createClientComponentClient<Database>()
    const { toast } = useToast();

    const formData = new FormData();
    formData.append('userId', userId.toString());

    const deleteAccount = async () => {
        const response = await fetch(`/api/deleteUser`, {
            method: 'POST',
            body: formData
        })
        if(response.ok){
            toast({
                title: "Success",
                description: "Account deleted",
                variant: 'default',
              })
            supabase.auth.signOut()
            router.push('/')
        }
        console.log(response)
    }

    return (
        <div>
            <Card className='mx-auto mt-24 drop-shadow-lg w-3/4 text-midnight'>
                <CardHeader className="ml-10">
                    <h3 className="font-bold text-3xl">Account Information</h3>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 ml-10 mt-12 space-between">
                        <Dialog.Root>
                            <Dialog.Trigger>
                                <div
                                    className="bg-red ml-6 w-36 rounded-lg hover:bg-midnight hover:drop-shadow-lg hover:text-white"
                                >
                                    Delete Account
                                </div>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <div
                                    style={{ zIndex: 2147483647, position: 'absolute' }}
                                    className=' left-8 top-40'
                                >
                                    <Dialog.Overlay className="fixed inset-0 bg-darkGreen bg-opacity-50" />
                                    <Dialog.Content className="bg-white border-4 border-midnight rounded-lg p-4 drop-shadow-2xl shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <Dialog.Title className="DialogTitle">Confirm Delete</Dialog.Title>
                                        <Dialog.Description className="DialogDescription">
                                            Are you sure? Once you delete the account, it will be unrecoverable.
                                        </Dialog.Description>
                                        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'space-between' }}>
                                            <Dialog.Close asChild>
                                                <Button
                                                    className="bg-softGreen text-midnight hover:text-white"
                                                    onClick={() => deleteAccount()}
                                                >
                                                    Yes
                                                </Button>
                                            </Dialog.Close>

                                            <Dialog.Close asChild>
                                                <Button aria-label="Close" className='bg-red text-midnight hover:text-white'>
                                                    Cancel
                                                </Button>
                                            </Dialog.Close>
                                        </div>
                                    </Dialog.Content>
                                </div>
                            </Dialog.Portal>
                        </Dialog.Root>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AccountSettingsCard