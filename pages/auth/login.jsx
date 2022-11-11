import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utilities/firebaseConfigs";
import { useRouter } from 'next/router';
import { useAuthState } from "react-firebase-hooks/auth";

export default function login() {

    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const googleProvider = new GoogleAuthProvider();


    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, user);


    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='shadow-xl mt-32 p-10 text-gray-700 rounded-lg'>
            <h2 className='text-2xl font-medium'>Join Today</h2>
            <div className='py-4'>
                <h3 className='py-4'>Sign in using one of the providers</h3>
                <button
                    onClick={googleLogin}
                    className='text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2'>
                    <FcGoogle className='text-2xl' />
                    Sign in with google
                </button>
            </div>
        </div>
    )
}
