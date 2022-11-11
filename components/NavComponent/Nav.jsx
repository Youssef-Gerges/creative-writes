import React from 'react';
import Link from "next/link";
import { auth } from "../../utilities/firebaseConfigs";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
    const [user, loading] = useAuthState(auth);

    return (
        <nav className='flex justify-between items-center py-10'>
            <Link href="/">
                <button className='text-lg font-medium'>Creative Writes</button>
            </Link>
            <ul className='flex items-center gap-10'>

                {!user &&
                    (<Link href="/auth/login">
                        <button className='py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium'>Join Now</button>
                    </Link>)}
                {user && (
                    <div className='flex items-center gap-6'>
                        <Link href="/post">
                            <button className='py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium'>Post</button>
                        </Link>
                        <Link href="/dashboard">
                            <img src={user.photoURL} className='w-12 rounded-full' alt="avater user" />
                        </Link>
                    </div>
                )}
            </ul>
        </nav>
    )
}
