import React from 'react'
import './styles.css'
import { auth, provider } from '../../Api';
import { signInWithPopup, FacebookAuthProvider  } from 'firebase/auth';

export default function Login({onReceive}){

    const handleFacebookLogin = async () => {
        const result = await signInWithPopup(auth, provider)
        console.log(result)
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        const res = await fetch(`https://graph.facebook.com/${result.user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`)
        const blob = await res.blob();

        onReceive(result, blob)

        // signInWithPopup(auth, provider).then((result) => {
        //     console.log('Result:' + result)
        //     const credential = FacebookAuthProvider.credentialFromResult(result);
        //     const accessToken = credential.accessToken;
        //     console.log(credential, accessToken)
        //     // fetch facebook graph api to get user actual profile picture

        //     fetch(`https://graph.facebook.com/${result.user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`)
        //         .then((response) => {console.log(response)
        //             response.blob()})
        //         .then((blob) => {
        //             onReceive(result, blob);
        //         })

        // }).catch((err) => {
        //     console.log('err: ' + err);
        // });
    };

    return(
        <div className="login">
            <button onClick={handleFacebookLogin}>Logar com Facebook</button>  
        </div>
    )
}