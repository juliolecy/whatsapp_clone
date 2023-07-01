import React, { useEffect, useState } from 'react'
import './styles.css'
import { ArrowBack } from '@material-ui/icons'
import { getContactList } from '../../Api'

export default function NewChat({show, setShow, chatlist, user}){

    const [list, setList] = useState([])

    useEffect(()=>{
        const getList = async () =>{
            if(user !== null){
                let results = await getContactList(user.id);
                setList(results);
            }
        }
        getList();
    },[user])

    const handleClose=()=>{
        setShow(false)
    }

    const addNewChat = async(user2) =>{
        await addNewChat(user, user2);
        handleClose()
    }

    return (
        <div className='newChat' style={{left: show? 0 : -415}}>
            <div className="newChat--head">
                <div onClick={handleClose} className="newChat--backbutton">
                    <ArrowBack style={{color: '#FFF'}} />
                </div>
            <div className="newChat--headtitle"> Nova Conversa</div>
            </div>


            <div className="newChat--list">
                {list.map((item, key)=>(
                        <div onClick={()=>addNewChat(item)} className="newChat--item" key={key}>
                            <img className='newChat--itemavatar' src={item.avatar} alt=''/>
                            <div className="newChat--itemname">{item.name}</div>
                        </div>
                ))}
            </div>
        </div>
    )
}