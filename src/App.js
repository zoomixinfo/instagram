import { useEffect, useState } from 'react';
import './App.css';
import {db, auth} from './firebase';
import Post from './Post';
import { Modal, Button, Input } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user logged in
        console.log(authUser);
        setUser(authUser);
        if(authUser.displayName){
          // user already has a username
        }
        else{
          return authUser.updateProfile({
            displayName: username
          })
      }
    }
      else 
      {
        // user logged out
      }
    });
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => (
        {
          id: doc.id,
          post: doc.data()
        }
      )
        ))
    })
  }, [])
  const signUp = (event) => {
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
    .catch(error => alert(error.message))
    setOpen(false);
  }
  const signIn = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))
      setOpenSignIn(false)
  }


  return (
    <div className="app">    
      <Modal 
      open={open}
      onClose={()=>setOpen(false)}
      >
      <div style={getModalStyle()} className={classes.paper}>
        <form className="app__signup">
      <center>
      <img className='app__headerImage' src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027" alt="" />
      </center>
      <Input 
      placeholder="username"
      type="text"
      name="username"
      value={username}
      onChange={(e)=>setUsername(e.target.value)}
      />
      <Input
      placeholder="email"
      type="text"
      name="email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />
      <Input
      placeholder="password"
      type="password"
      name="password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      />
      <Button type='submit' onClick={signUp}>Sign Up</Button>
      </form>
      </div>
      </Modal>
      <Modal 
      open={openSignIn}
      onClose={()=>setOpenSignIn(false)}
      >
      <div style={getModalStyle()} className={classes.paper}>
        <form className="app__signup">
      <center>
      <img className='app__headerImage' src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027" alt="" />
      </center>
      <Input
      placeholder="email"
      type="text"
      name="email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />
      <Input
      placeholder="password"
      type="password"
      name="password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      />
      <Button type='submit' onClick={signIn}>Sign In</Button>
      </form>
      </div>
      </Modal>
      <div className='app__heading'>
          <img className='app__headerImage' src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027" alt="" />
        {
        user ? (<Button onClick={()=>auth.signOut()}>Logout</Button>) : 
        (
        <div className='app__loginContainer'> 
        <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        <Button onClick={()=>setOpenSignIn(true)}>Login</Button>
        </div>
        )
      }
        </div>

      {
        posts.map(({id,post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} post={post.post} />
        ))
      }
      {
      user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ) : (
        <h3>Please sign in or sign up to upload images</h3>
      )
    }
    </div>
  );
}

export default App;
