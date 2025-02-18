'use client';
// import { cookies } from 'next/headers'
import { getDecodedAccessToken } from '@/lib'
import Image from 'next/image'
import { Validation } from '@/lib';
import { ImageComponent } from '@/app/login/components/custom/image_loader'
import "../globals.css";
import { startTransition, useActionState, useEffect, useState } from 'react';
import clsx from 'clsx';
import { tree } from 'next/dist/build/templates/app-page';
import { redirect } from 'next/navigation';

// let resp = Validation()

const INITIAL_FORM_STATE = {
    id: null,
    category: null,
    photo: '/media/test/default.jpg',
    validated: null,
    newType: null,
}

export default function Page() {
    // const cookieStore = await cookies()
    // const access_token = cookieStore.get('access')
    // let decoded_ac_token = await getDecodedAccessToken()
    // const [INITIAL_FORM_STATE, SET_INITIAL_FORM_STATE] = useState({ photo: '/media' })
    // useEffect(() => {
    //     Validation().then(result => { SET_INITIAL_FORM_STATE(result) });
    // }, [])
    // console.log(INITIAL_FORM_STATE)
    const [state, formAction] = useActionState(ImageComponent, INITIAL_FORM_STATE)
    useEffect(() => {
        startTransition(() => {
            formAction({ foo: 'bar' })
        })
    }, [])

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('access='));
        if (!token) {
            redirect('/login');
        }
    }, []);

    const handleButtonClick = (value: string) => {
        startTransition(() => {
            formAction({ value }); // Dispatch the action correctly
        });
    };

    return (
        <div className='h-screen items-center'>
            <div className='flex h-32 items-center max-w-96 justify-center'>
                <h1 className='flex justify-center text-test font-medium subpixel-antialiased hover:italic'>Hello Admin</h1>
            </div>
            <div className="h-96 flex gap-4 ">
                <div className='flex basis-2/3 grid items-center'>
                    <div className='flex justify-center'>
                        <Image className='rounded-lg' src={`http://localhost${state.photo}`} width={640} height={480} alt="Image"></Image>
                        {/* <ImageComponent type='test'></ImageComponent> */}
                    </div>
                </div>
                <div className='flex flex-col gap-10 justify-center'>
                    <div>
                        <button onClick={() => handleButtonClick("DW")} type="button" className={clsx("text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800", { 'cursor-not-allowed': state.photo === "/media/test/default.jpg" })} disabled={(state.photo === '/media/test/default.jpg') ? true : false}>Dry Waste</button>
                    </div>
                    <div>
                        <button onClick={() => handleButtonClick("WW")} type="button" className={clsx("text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800", { 'cursor-not-allowed': state.photo === "/media/test/default.jpg" })} disabled={(state.photo === '/media/test/default.jpg') ? true : false}>Wet Waste</button>
                    </div>
                </div>
            </div >
        </div >
    )
}