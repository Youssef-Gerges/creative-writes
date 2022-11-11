import React, { useEffect, useState } from 'react';
import { auth, DB } from "../utilities/firebaseConfigs";
import { useRouter } from 'next/router';
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { toast } from "react-toastify";

export default function post() {
    const [post, setPost] = useState({ description: '' });
    const [user, loading] = useAuthState(auth);
    const [editMode, setEditMode] = useState(false);
    const router = useRouter();
    const updateData = router.query;

    useEffect(() => {
        if (!user && !loading) {
            router.push('/auth/login');
        }
        if (updateData.id) {
            const postRef = doc(DB, `posts/${updateData.id}`);
            // const post = getDoc(postRef);
            const unsupscribe = onSnapshot(postRef, (snap) => {
                const snapData = snap.data();
                if (user.uid == snapData.user) {
                    setEditMode(true);
                    setPost({ description: snap.data().description })
                } else {
                    toast.error('Permission denied')
                    router.back();
                }
            })
            return unsupscribe;
            // alert(JSON.stringify(post))
        }
    }, [user, loading]);

    const savePost = async (e) => {
        e.preventDefault();
        if (post.description.length == 0) {
            return toast.error("Post description is empty👀");
        }

        if (post.description.length > 300) {
            return toast.error("Post description is too long😱");
        }
        if (!editMode) {
            const collectioRef = collection(DB, 'posts');
            await addDoc(collectioRef, {
                ...post,
                timestamp: serverTimestamp(),
                user: user.uid,
                avatar: user.photoURL,
                username: user.displayName
            });
            setPost({ description: '' });
            toast.success('Post published successfully🚀');
            return router.push('/');
        }

        if (editMode) {
            const postRef = doc(DB, `posts/${updateData.id}`);
            await updateDoc(postRef, {
                ...post,
                timestamp: serverTimestamp(),
            });
            setPost({ description: '' });
            toast.success('Post updated successfully🚀');
            return router.push('/dashboard');
        }

    }


    return (
        <div className=' p-12 shadow-lg rounded-lg max-w-md mx-auto'>
            <form onSubmit={savePost}>
                <h1 className='text-2xl font-bold'>{editMode == false ? 'Create a new post' : 'Edit the post'}</h1>
                <div className='py-2'>
                    <h3 className='text-lg font-medium py-2'>Description</h3>
                    <textarea value={post.description} onChange={(event) => setPost({ ...post, description: event.target.value })} className='bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm'></textarea>
                    <p
                        className={`text-green-600 font-medium text-sm ${post.description.length > 300 ? 'text-red-600' : null}`}>
                        {post.description.length}/300
                    </p>
                </div>
                <button type="submit" className='w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm'>Submit</button>
            </form>
        </div>
    )
}
