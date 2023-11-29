'use client'
import { useState, useEffect, FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { Button } from "./ui/button";
import * as Dialog from '@radix-ui/react-dialog';
import { Trash2 } from "lucide-react";

interface AccountSettingsCardProps {
    userId: string
}

const AccountSettingsCard: FC<AccountSettingsCardProps> = (userId) => {
    const [showDialog, setShowDialog] = useState<boolean>(false)

    const supabase = createClientComponentClient<Database>()

    /*
useEffect(() => {
    const fetchData = async() => {
        const {data} = await supabase
            .from('user')
            .select('*')
            .eq('id', userId)
            .single()
        if(data) setUserData(data)
        //get the user email
        //username
        //
    }
    fetchData()
}, [supabase])*/
    //get all pet ids, delete all pet id folders, delete user id folder
    //delete user from supabase

    const deleteAccount = async() => {
        //const folder = 'UserAvatar'
        //
    }

    return (
        <div>
            <Card className='mx-auto mt-24 drop-shadow-lg w-3/4 text-midnight'>
                <CardHeader className="ml-10">
                    <h3 className="font-bold text-3xl">Account Information</h3>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 ml-10 mt-12 space-between">
                        <Button
                            className="bg-red ml-6 w-36 hover:bg-midnight hover:drop-shadow-lg hover:text-white"
                            onClick={() => setShowDialog(!showDialog)}
                        >
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {
                showDialog ??
                <Dialog.Root>
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
            }
        </div>
    )
}

export default AccountSettingsCard