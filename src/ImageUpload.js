import React, { useState } from 'react'
import { Button, Input } from '@mui/material'
import {storage, db} from './firebase';
import firebase from 'firebase/compat/app'
import './ImageUpload.css'

function ImageUpload({username}) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on('state_changed', (snapshot) => {
            // progress function
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(progress)
        }, (error) => {
            // error function
            console.log(error)
            alert(error.message)
        }, () => {
            // complete function
            storage.ref('images').child(image.name).getDownloadURL().then(url => {
                db.collection('posts').add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url,
                    username: username,
                    post:url
                })
                setProgress(0)
                setCaption('')
                setImage(null)
            })
        })
    }

  return (
    <div className='imageUpload'>
        <progress className='imageUpload__progress' value={progress} max="100" />
        <Input type="text" placeholder='Enter caption....'
        onChange={event => setCaption(event.target.value)} 
        value={caption}
        />
        <input type="file" onChange={handleChange}/>
        <Button onClick={handleUpload}>Upload</Button>
    </div>
  )
}

export default ImageUpload