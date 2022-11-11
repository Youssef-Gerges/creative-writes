import React, { useEffect, useState } from 'react';
import Message from '../components/MessageComponent/Message';
import { auth, DB } from '../utilities/firebaseConfigs';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Link from 'next/link';

export default function dashboard() {
    const [user, loading] = useAuthState(auth);
    const [userPosts, setUserPosts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) {
            return router.push('/auth/login');
        }
        if (!loading) {
            const collectionRef = collection(DB, 'posts');
            const q = query(collectionRef, where('user', '==', user.uid));
            const unsubscribe = onSnapshot(q, (snap) => {
                setUserPosts(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });
            return unsubscribe;
        }

    }, [user, loading]);

    const logOut = () => {
        auth.signOut();
    }

    const deletePost = async (id) => {
        const docRef = doc(DB, 'posts', id);
        await deleteDoc(docRef);
    }

    return (
        <div>
            <h1>Your Posts</h1>
            <div>
                {userPosts.map((post) => {
                    return (<Message {...post} key={post.id}>
                        <div className='flex gap-4'>
                            <button
                                onClick={() => deletePost(post.id)}
                                className='text-pink-600 flex items-center justify-center gap-2 py-2 text-sm'>
                                <BsTrash2Fill className='text-2xl' />
                                Delete
                            </button>
                            <Link href={{ pathname: "/post", query: { id: post.id } }}>
                                <button className='text-teal-600 flex items-center justify-center gap-2 py-2 text-sm'>
                                    <AiFillEdit className='text-2xl' />
                                    Edit
                                </button>
                            </Link>
                        </div>
                    </Message>)
                })}
            </div>

            <button onClick={logOut} className='font-medium text-white bg-gray-800 py-2 px-4 my-6 rounded-md'>
                Sign Out
            </button>
        </div>
    )
}
