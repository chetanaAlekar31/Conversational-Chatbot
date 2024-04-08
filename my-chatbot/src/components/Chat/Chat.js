import React, { useMemo,useEffect,useState } from 'react';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';
// import BotFace from '../../assests/BOTSVGFACE.svg'
// import Chatbot from '../../assests/Chatbot.png.png'
import BotFace from '../../assests/new_bot_icon.svg'
import './Chat.css'

function Chat() {

  const [token, setToken] = useState('');
  const [userID, setuserID] = useState('');
  const [permission,SetPermissiom] = useState()
  const [coords,Setcoord] = useState({})
  const [HideSendBox,setHideSendBox] = useState(true)
  

  const { Components: {
    AdaptiveCardContent,
    HeroCardContent,
  },
  ReactWebChat } = window.WebChat;

  const attachmentMiddleware = () => (next) => ({ activity, attachment, ...others }) => {
    const  {activities} = store.getState();
    const messageActivities = activities.filter(activity => activity.type === 'message');
    const recentBotMessage = messageActivities.pop() === activity;

    if (attachment) {
      switch (attachment.contentType) {
        case "application/vnd.microsoft.card.adaptive":
          // console.log('AdaptiveCardContent',attachment.content)
          attachment.content.body.map((m)=>{let pus = m.type==='ActionSet' ? console.log('action',m) : null })
          // console.log('AdaptiveCardContent',attachment.content.body.map((m)=>{let pus = m.type==='ActionSet' ? console.log('action') : null }))
          // console.log(attachment.content.body.map((m)=>{console.log(m.type)}))
          // console.log('AdaptiveCardContent',<AdaptiveCardContent content/>)
          return (
            <AdaptiveCardContent
              actionPerformedClassName="card__action--performed"
              content={attachment.content}
              disabled={!recentBotMessage}
            />
          );
        case 'application/vnd.microsoft.card.hero':
            return (
              <HeroCardContent
                actionPerformedClassName="card__action--performed"
                content={attachment.content}
                disabled={!recentBotMessage}
              />
            );
        default:
          return next({ activity, attachment, ...others });
      }
    } 
  };

  const styleOptions = {
    botAvatarImage: BotFace,
    botAvatarBackgroundColor : 'transparent',
    botAvatarInitials: 'BF',

    bubbleBackground: '#D9D9D9',
    bubbleBorderRadius: '0px 10px 10px 10px',
    bubbleFromUserBackground: '#C9256B',
    bubbleFromUserBorderRadius: '10px 0px 10px 10px',

    suggestedActionBorderRadius : 8,
    suggestedActionBackgroundColor: 'transparent',
    suggestedActionBorderColor: '#C9256B',
    suggestedActionLayout: 'flow',

    bubbleFromUserTextColor : '#fff',
    bubbleTextColor : '#000',

    botAvatarBackgroundColor : '#D9D9D9',
    suggestedActionTextColor : '#D9D9D9',

    suggestedActionLayout : 'stacked',

    backgroundColor: '#FFFFFF',
    sendBoxBorderBottom: 10,
    sendBoxBorderLeft: 10,
    sendBoxBorderRight: 10,
    sendBoxBorderTop: 10,
    sendBoxButtonColorOnHover: 'black',
    hideUploadButton: true,
    notificationDebounceTimeout: 5,
    transcriptTerminatorBackgroundColor : "black",
    primaryFont:'Sofia Sans',
    rootHeight:'86vh',
    sendBoxButtonColor : '#74107C',
    avatarSize: 30,
    transcriptActivityVisualKeyboardIndicatorColor: 'BLACK',
    transcriptActivityVisualKeyboardIndicatorStyle: 'dashed',
    transcriptActivityVisualKeyboardIndicatorWidth: 1,
    transcriptVisualKeyboardIndicatorColor: 'Black',
    transcriptVisualKeyboardIndicatorStyle: 'solid',
    transcriptVisualKeyboardIndicatorWidth: 2,
};


const directLine = useMemo(() => createDirectLine({ domain: "https://webchat.botframework.com/v3/directline",
token: 'Tow-j312Gmw.Rlkf3KA-d1AufX8lMN1X35d-rZMdzpIB4P-8DpyUTt8' }), 
[token])


// const store = useMemo(() => createStore(), []);

useEffect(() => {
  (async function () {
    const res = await fetch('https://webchat-mockbot.azurewebsites.net/directline/token', { method: 'POST' });
    const { token } = await res.json();
    setToken(token);
  })();
  let uuid = JSON.parse(localStorage.getItem('device_info'))
  setuserID(uuid.device_id)

  navigator.geolocation.getCurrentPosition(function(position) {
    navigator.permissions && navigator.permissions.query({name: 'geolocation'})
    .then(function(PermissionStatus) {
      if (PermissionStatus.state == 'granted') {
        SetPermissiom(true)
        Setcoord({'latitude':position.coords.latitude,'longitude':position.coords.longitude})
      } else {
        SetPermissiom(false)
      }
    })
  });

}, []);


const activityStatusMiddleware = () => (next) => (args) => {
  const { activity, sendState, sameTimestampGroup } = args;
  if (activity.from.role === "bot") {
    if (sendState === "sending") {
      return (
        <div className="activityStatus__wrapper"  >
          <span className="activityStatus activityStatus__sendStatus">
            Sending&hellip;
          </span>
        </div>
      );
    } else if (sendState === "send failed") {
      return (
        <div className="activityStatus__wrapper"  >
          <span className="activityStatus">Send failed.</span>
        </div>
      );
    } else if (!sameTimestampGroup) {
      return (
        <div className="activityStatus__wrapper" >
          <span className="activityStatus activityStatus__timestamp">
            <span
              style={{ fontSize: "small" }}
              className="activityStatus__timestampContent"
            >
              {new Date().toLocaleTimeString([], {timeStyle: 'short'})}
            </span>
          </span>
        </div>
      );
    }
  } else {
    if (!sameTimestampGroup) {
      return (
        <div className="activityStatus__wrapper"  >
          <span className="activityStatus activityStatus__timestamp">
            <span
              style={{ fontSize: "small" }}
              className="activityStatus__timestampContent"
            >
              {new Date().toLocaleTimeString([], {timeStyle: 'short'})}
            </span>
          </span>
        </div>
      );
    }
  }
  return next(args);
};

const store = window.WebChat.createStore(
  {},
  ({ dispatch }) =>
    (next) =>
    (action) => {
      if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
        let input = document.querySelector(
          ".webchat__send-box-text-box__input"
          );
          if (input) {
          input.focus();
        }
        setTimeout(() => {
          dispatch({
            type: "WEB_CHAT/SEND_EVENT",
            payload: {
              name: "webchat/join",
              value: { username: userID },
            },
          });
        }, 300);
      }
      if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
        // We are using the simple-update-in package to update "action" with partial deep cloning.
        action = window.simpleUpdateIn(action, ['payload', 'activity', 'channelData', 'parameters'], function () { return coords });
      }
      if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
        action.payload.activity.timestamp = new Date().toISOString();
      }
      if (action.type === "WEB_CHAT/SEND_MESSAGE") {
        action.payload = {
          ...action.payload,
        };
      }
      if (action.type === 'DIRECT_LINE/SET_SUGGESTED_ACTIONS') {
        if (action.payload.suggestedActions.length) {
          setHideSendBox(true);
        } else {
          setHideSendBox(false);
        }
      }
      return next(action);
    }
);

const activityMiddleware = () => next => card => {
  const { activity: { suggestedActions } } = card;
  const toggleSendBoxEvent = new Event('ToggleSendBoxEvent')
  console.log(suggestedActions)
  if (suggestedActions.actions.length > 0) {
    console.log('printing some thing for now')
    let selectorBtns = document.querySelectorAll(".webchat__suggested-action__button")

    for (let index = 0; index < selectorBtns.length - 1; index++) { 
        let element = selectorBtns[index]; element.style.width = "min-content";
    }
  } else {
    toggleSendBoxEvent.data = "flex";
    window.dispatchEvent(toggleSendBoxEvent);
  }
  return next(card);
  }

styleOptions.bubble = {
  ...styleOptions.bubble,
  '&:hover': {
    content: "",
    position: 'absolute',
    borderStyle: 'solid',
    display: 'block',
    width: '0',
    bottom: 'auto',
    borderColor: 'transparent #F6F6F6',
    borderWidth: '10px 0px 10px 15px',
    right: '-14px',
    top: '50%',
    cursor: 'pointer'
  },
  textAlign: 'left'
}

  return (
  <div className='App-body' >
    <ReactWebChat
    activityStatusMiddleware={activityStatusMiddleware}
    className="react-web-chat"
    sendTimeout={6000}
    directLine={directLine}
    store={store}
    attachmentMiddleware={attachmentMiddleware}
    userID = {userID}
    username='r'
    styleOptions={styleOptions}
    activityMiddleware={ activityMiddleware }
    />
  </div>
  )
}

export default Chat