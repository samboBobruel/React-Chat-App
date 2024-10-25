import { useEffect, useState, memo } from 'react'
import './App.css'

interface LoginPanelProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

interface MessageProps {
  messageA: string;
  usernameA: string;
  timeA: string;
}

interface EmojiProps {
  emoji: string;
  setReactValue: React.Dispatch<React.SetStateAction<string>>;
  setReactBarVis: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginPanel({onClick} : LoginPanelProps) {
  return (
    <div className='loginDiv'>
      <h3>Username</h3>
      <input id='username'></input>
      <h3>Password</h3>
      <input id='password' type="password"></input>
      <button onClick={onClick}>Login</button>
    </div>
  )
}

function EmojiButton({emoji, setReactValue, setReactBarVis} : EmojiProps){
  return (
  <a className='emojiOption' onClick={() => {
    setReactValue(emoji);
    setReactBarVis(false);
  }}>{emoji}</a>
  );
}

const Message = memo(function ({messageA, usernameA, timeA} : MessageProps){
  const [message, setMessage] = useState(messageA)
  const [time, setTime] = useState(timeA);
  const [username, setUsername] = useState(usernameA);

  const [editing, setEditing] = useState(false);
  const [edited, setEdited] = useState(false);

  const [reactValue, setReactValue] = useState('');

  const [inputValue, setInputValue] = useState('');

  const [reactBarVis, setReactBarVis] = useState(false);

  const [reactions, setReactions] = useState({'👍':["Samuel", "Laco"]});

  if(username === ''){
    setUsername(localStorage["username"]);
  }

  useEffect(() => {
    const d = new Date();
    setTime((edited && '(Edited) ' || '') + (d.getHours() < 10 && "0" || '') + d.getHours().toString() + ":" + (d.getMinutes() < 10 && "0" || '') + d.getMinutes().toString());
  }, [edited])

  const d = new Date();
  if(time === ''){
    setTime((d.getHours() < 10 && "0" || '') + d.getHours().toString() + ":" + (d.getMinutes() < 10 && "0" || '') + d.getMinutes().toString());
  }

  return (
    <span className='messageHolder'>
      <h4 className='messageUsername'>{username}</h4>
      <h4 className='messageTime'>{time}</h4>
      {!editing && <p className='message'>{message}</p> || <textarea value={inputValue} onChange={(e) => {
        setInputValue(e.target.value);
      }} className="messageInput" onKeyDown={(e) => {
        if(e.key === "Enter"){
          setMessage(inputValue);
          setInputValue('');
          setEditing(false);
          setEdited(true);
        }
      }}></textarea>}
      {username == localStorage["username"] && <a className='editMessage' onClick={() => {
        setEditing(true);
        setInputValue(message);
      }}>Edit</a>}
      <a className='reactMessage' onClick={() => {
        setReactBarVis(true);
        setReactValue('');
      }}>React</a>
      {reactBarVis && <div className='reactBar'>
        <EmojiButton emoji={"👍"} setReactValue={setReactValue} setReactBarVis={setReactBarVis}/>
        <EmojiButton emoji={"❤️"} setReactValue={setReactValue} setReactBarVis={setReactBarVis}/>
        <EmojiButton emoji={"😂"} setReactValue={setReactValue} setReactBarVis={setReactBarVis}/>
        </div>}
      {reactValue !== '' && <div className='emojiReaction' onClick={() => {
        setReactValue('');
      }
      }>{reactValue}</div>}
    </span>
  )
});


function ChatApp(){
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<string[]>(JSON.parse(localStorage["messages"]) || []);

  useEffect(() => {
    let messagesContainer = document.getElementsByClassName("messagesContainer")[0];
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages.length]);

  return (
    <div className="appContainer">
      <div className="messagesContainer" onChange={() => {

      }}>
        {messages.map((text, index) => {
          return <Message messageA={text} usernameA={''} timeA={''} key={`message_${index}`}/>
        })}
      </div>
      <textarea value={inputValue} onChange={(e) => {
        setInputValue(e.target.value);
      }} className="messageInput" onKeyDown={(e) => {
        if(e.key === "Enter"){
          setMessages((prevMessages) => {
            localStorage['messages'] = JSON.stringify([...prevMessages, inputValue]);
            return [...prevMessages,inputValue]
          });
          console.log(JSON.stringify(messages));
          setInputValue('');
        }
      }}/>
    </div>
  )
}

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage["loggedIn"] || false);

  function logIn(){
    const username = document.getElementById("username")?.value;

    setLoggedIn(true);
    localStorage["loggedIn"] = true;
    localStorage["username"] = username;
    console.log(loggedIn);
  }

  return (
    <>
      {!loggedIn && <LoginPanel onClick={logIn}/>}
      {loggedIn && <ChatApp />}
    </>
  )
}

export default App
