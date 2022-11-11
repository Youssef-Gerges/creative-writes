import React, { useEffect, useState } from 'react';
import Message from '../components/MessageComponent/Message';
import { useRouter } from 'next/router';
import { auth, DB } from "../utilities/firebaseConfigs";
import { toast } from 'react-toastify';
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function details() {
    const router = useRouter();
    const { slug } = router.query;
    const [message, setMessage] = useState('');
    const [post, setPost] = useState({});
    const [allMessages, setAllMessages] = useState([]);
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        const postRef = doc(DB, `posts/${slug}`);
        const unsubscribe = onSnapshot(postRef, (snap) => {
            const data = snap.data();
            if (data != undefined) {
                setPost({ ...data });
                setAllMessages(data.comments)
            }
            else {
                setPost({});
            }
        });
        return unsubscribe;
    }, [slug]);

    const submitMessage = async () => {
        if (!user && !loading) {
            return router.push('/auth/login');
        }
        if (!message) {
            return toast.error("dont't leave an empty message 😅");
        }
        const postRef = doc(DB, `posts/${slug}`);
        await updateDoc(postRef, {
            comments: arrayUnion({
                message,
                avatar: user.photoURL,
                username: user.displayName,
                timestamp: Timestamp.now()
            })
        });
        getMessages();
        setMessage('');
        toast.success('Message sent successfully');
    }

    const getMessages = async () => {
        const docRf = doc(DB, `posts/${slug}`);
        const docSnap = await getDoc(docRf);
        setAllMessages(docSnap.data().comments);
    }

    return (
        <div>
            {post.description ?
                (<Message {...post}>
                    <div className='my-4'>
                        <div className='flex'>
                            <input
                                type="text"
                                placeholder='send a message ☺'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className=" outline-none bg-gray-800 w-full p-2 text-white text-sm"
                            />
                            <button onClick={submitMessage} className='bg-cyan-500 text-white py-2 px-4 text-sm'>Send</button>
                        </div>
                        <div className="py-6">
                            <h2 className='font-bold'>Comments</h2>
                            {allMessages?.map((message, index) => (
                                <div className='bg-white p-4 my-4 border-2' key={index}>
                                    <div
                                        className='flex items-center gap-2 mb-4'
                                    >
                                        <img
                                            className='w-10 rounded-full'
                                            src={message.avatar}
                                            alt="commented user" />
                                        <h2 className='font-bold text-lg'>{message.username}</h2>
                                    </div>
                                    <p>{message.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Message>)
                : <h1>Post Not Found</h1>}
        </div>
    )
}
