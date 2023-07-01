import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { Search, AttachFile, More, Send, InsertEmoticon, Close, Mic } from '@material-ui/icons';
import EmojiPicker from 'emoji-picker-react';
import MessageItem from '../MessageItem';
import { onChatContent, sendMessage } from '../../Api';

export default function ChatWindow ({user, data}){

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition 
    if(SpeechRecognition !== undefined){
        recognition = new SpeechRecognition()
    }

    const [emojiOpen, setEmojiOpen] = useState(false)
    const [text, setText] = useState('')
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([])
    const [users, setUsers] = useState([])

    useEffect(()=>{
        if(body.current.scrollHeight > body.current.offsetHeight){
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
        }
    },[list])

    useEffect(()=>{
        setList([]);
        let unsub = onChatContent(data.chatId, setList, setUsers)
        return unsub
    },[data.chatId])

    const handleEmojiClick = (e, emojiObject) =>{
        setText(text + emojiObject.emoji)
    }


    const handleOpenEmoji = () =>{
        setEmojiOpen(true)
    }

    const handleCloseEmoji = ()=>{
        setEmojiOpen(false)
    }

    const handleSendClick = () =>{
        if( text !== ''){
            sendMessage(data, user.id, 'text', text, users);
            setText('')
            setEmojiOpen(false);
        }
    }

    const handleMicClick = () =>{
        if(recognition !== null){

            recognition.onstart = () =>{
                setListening(true)
            }

            recognition.onend = () =>{
                setListening(false)
            }

            recognition.onresult = (e) =>{
                    setText(e.results[0][0].transcript );
            }

            recognition.start();
            
        }
    }

    const handleInputKeyUp = (e) =>{
        if(e.keyCode ===13){
            handleSendClick()
        }
    }

return (
<div className="chatWindow">
    <div className="chatWindow--header">
        <div className="chatWindow--headerInfo">
            <img src={data.image} alt="" className="chatWindow--avatar" />    
            <div className="chatWindow--name">{data.title}</div>
        </div>        

        <div className="chatWindow--headerbuttons">
            <div className="chatWindow--btn">
                <Search style={{color: '#919191'}}/>
            </div>
            <div className="chatWindow--btn">
                <AttachFile style={{color: '#919191'}}/>
            </div>
            <div className="chatWindow--btn">
                <More style={{color: '#919191'}}/>
            </div>
        </div>
    </div>

    <div ref={body} className="chatWindow--body">
        {list.map((item, key)=>(
            <MessageItem
             key={key}
             data={item}
             user={user}/>
        ))}
    </div>  

    <div 
    className="chatWindow--emojiarea"
    style={{height: emojiOpen? '200px' : '0'}}
    >
        <EmojiPicker
            onEmojiClick={handleEmojiClick}
            disableSearchBar
            disableSkinTonePicker
            width={'auto'}
            previewConfig={{
                showPreview: false
            }}
        
        />
    </div>

    <div className="chatWindow--footer">

        <div className="chatWindow--pre">

            <div 
            className="chatWindow--btn"
            onClick={handleCloseEmoji}
            style={{width: emojiOpen? 40:0}}
                >
                <Close style={{color: '#919191'}}/>
            </div>

            <div 
            className="chatWindow--btn"
            onClick={handleOpenEmoji}
            >
            <InsertEmoticon style={{color: emojiOpen? '#009688' : '#919191'}}/>
            </div>
        </div>

        <div className="chatWindow--inputarea">
            <input 
                type="text" 
                className="chatWindow--input"
                placeholder='Digite uma mensagem'
                value={text}
                onKeyUp={handleInputKeyUp}
                onChange={e=>setText(e.target.value)}
            />
        </div>

        <div className="chatWindow--pos">
            {text === '' && 
        <div className="chatWindow--btn" onClick={handleMicClick}>
                <Mic 
                style={{color: listening? '#126ECE' : '#919191'}}
                />
            </div>
        }

            {text !== '' && 
            <div 
            className="chatWindow--btn"
            onClick={handleSendClick}>
                <Send style={{color: '#919191'}}/>
            </div>
    }
        </div>
    </div>
</div>
        )
}