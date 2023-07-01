import { useEffect, useState } from 'react'
import './App.css'
import { DonutLarge, MoreVert, Chat, Search } from '@material-ui/icons'
import ChatListItem from './components/ChatListItem'
import ChatIntro from './components/ChatIntro'
import ChatWindow from './components/ChatWindow'
import NewChat from './components/NewChat'
import Login from './components/Login'
import { addUser, onChatList } from './Api'

function App() {

    
    const [chatList, setChatList] = useState([])
    const [activeChat, setActiveChat] = useState({})
    const [user, setUser] = useState(null)
    const [showNewChat, setShowNewChat] = useState(false)
    
    useEffect(()=>{
        if(user !== null){
          let unsub =  onChatList(user.id, setChatList)
          return unsub
        }
    },[user])
    const handleNewChat=()=>{
        setShowNewChat(true)
    }

    const handleLoginData = async (u, profilePicture) => {
        let newUser = {
            id: u.user.uid,
            name: u.user.displayName,
            avatar: profilePicture
        };
        await addUser(newUser);
        setUser(newUser);
    }

if(user === null ){return (<Login onReceive={handleLoginData}/>)}

return (
    <>
      <div className='app-window'>
        <div className='sidebar'>

            <NewChat show={showNewChat} setShow={setShowNewChat} user={user} chatlist={chatList}/> 

            <header>
                <img className='header--avatar' src={user.avatar} alt=''/>
                <div className="header--buttons">
                    <div className="header--btn">
                        <DonutLarge style={{color: '#919191'}}/>
                    </div>

                    <div onClick={handleNewChat} className="header--btn">
                        <Chat style={{color: '#919191'}}/>
                    </div>

                    <div className="header--btn">
                        <MoreVert style={{color: '#919191'}}/>
                    </div>
                </div>
            </header>

            <div className="search">
                <div className="search--input">
                    <Search fontSize='small' style={{color:'#919191'}}/>
                    <input type='search' placeholder='Procurar ou começar uma nova conversa'/>
                </div>

            </div>

            <div className="chatlist">
                {chatList.map((item, key)=>(
                    <ChatListItem 
                        key={key}
                        data={item}
                        active={activeChat.chatId === chatList[key].chatId}
                        onClick={()=>setActiveChat(chatList[key])}
                    />
                ))}
            </div>
        </div>

        <div className='contentarea'>
            {activeChat.chatId !== undefined &&
                <ChatWindow 
                user={user}
                data={activeChat}
                />
            }
            {activeChat.chatId === undefined &&
                <ChatIntro/>
            }
        </div>
    </div>
    </>
  )
}

export default App      
