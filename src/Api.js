import { initializeApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider } from "firebase/auth";
import firebaseConfig  from './FirebaseConfig';
import { getFirestore, doc, setDoc, getDocs, collection, addDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore';

import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();
const db = getFirestore(app);
const storage = getStorage();

const addUser = async (u) => {

    await setDoc(doc(db, 'users', u.id), {
        name: u.name
    }, { merge: true });

    const storageRef = ref(storage, u.id);
    await uploadBytes(storageRef, u.avatar).then((snapshot) => {        
    });
}

const addNewChat = async (user, user2) => {

    let newChat = await addDoc(collection(db, 'chats'), {
        messages:[],
        users:[user.id, user2.id]
    });

    let imgUser1 = await getPhotoUserStorage(user.id);
    let imgUser2 = await getPhotoUserStorage(user2.id);

    await setDoc(doc(db, 'users', user.id), {
        chats: arrayUnion({
            chatId: newChat.id,
            title: user2.name,
            image: imgUser2,
            with: user2.id
        })
    }, { merge: true }); 

    await setDoc(doc(db, 'users', user2.id), {
        chats: arrayUnion({
            chatId: newChat.id,
            title: user.name,
            image: imgUser1,
            with: user.id
        })
    }, { merge: true }); 

}

const onChatList = (userId, setChatList) => {
    return onSnapshot(doc(db, 'users', userId), (doc) => {
        if (doc.exists){
            let data = doc.data();
            if (data.chats) {
                let chats = [...data.chats];
                
                chats.sort((a,b) => {
                    if (a.lastMessageDate === undefined){
                        return -1;
                    }
                    if (b.lastMessageDate === undefined){
                        return -1;
                    }
                    if (a.lastMessageDate.seconds < b.lastMessageDate.seconds){
                        return 1;
                    }else {
                        return -1
                    }
                })

                setChatList(chats);
            }
        }
    })  
}

const onChatContent = (chatId, setList, setUsers) => {
    return onSnapshot(doc(db, 'chats', chatId), (doc) => {
        if (doc.exists){
            let data = doc.data();
            setList(data.messages);
            setUsers(data.users);
        }
    });
}

const getPhotoUserStorage = async (userId) => {
    if (userId){
        let url = await getDownloadURL(ref(storage, userId));
        return url;
    }
}

const getContactList = async (userId) => {
    let list = []
    const results = await getDocs(collection(db, 'users'));
    results.forEach(async (result) => {

        if (result.id !== userId){
            await getDownloadURL(ref(storage, result.id))
        .then((url) => {
            list.push({
                id: result.id,
                name: result.data().name,
                avatar: url
            })
        })
        .catch((error) => { console.log(error)
        });
        }
    });
    return list;
}

const sendMessage = async (chatData, userId, type, body, users) => {
    let now = new Date();

    setDoc(doc(db, 'chats', chatData.chatId), {
        messages: arrayUnion({
            type,
            author: userId,
            body,
            date: now
        })
    }, { merge: true });   
    
    for (let i in users){
        let u = await getDoc(doc(db, 'users', users[i]));
        let uData = u.data();
        
        if (uData.chats){
            let chats = [...uData.chats];

            for (let e in chats){
                if (chats[e].chatId == chatData.chatId){
                    chats[e].lastMessage = body;
                    chats[e].lastMessageDate = now;
                }
            }
            await setDoc(doc(db, 'users', users[i]), {
                chats
            }    
            , { merge: true });  
        }
    }
    

    

}


export { auth, provider, addUser, getContactList, addNewChat, onChatList, getPhotoUserStorage, onChatContent, sendMessage }