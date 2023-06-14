import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  Message,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { WechatOutlined } from "@ant-design/icons";

//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 maaz
//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 moeez1
//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 kashir
//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 moeez2

const API_KEY = "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";
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Explain things like you're a food guide or food assistant know all callories. Your name is TopDish And respond to only questions that are related to food.",
};

const Chatbot = () => {
  const values = [true];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm TopDish! Ask me anything!",
      sentTime: "just now",
      sender: "TopDish",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      direction: "outgoing",
      sender: "user",
    };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    await processMessageToSufar(newMessages);
  };

  async function processMessageToSufar(chatMessages) {
    // chatMessages {sender:"user" or "TopDish", message:"Any Message"}
    //apiMessages {role:"user" or "assistant", content:"Any Message"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "TopDish") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.choices[0].message.content);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <>
      {values.map((v, idx) => (
        <Button
          key={idx}
          className="me-2 mb-2 button1"
          style={{ marginRight: "1.5rem" }}
          onClick={() => handleShow(v)}
        >
          <WechatOutlined style={{ fontSize: "48px" }} />
          {typeof v === "string" && `below ${v.split("-")[0]}`}
        </Button>
      ))}
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>
              <span style={{ color: "#04e9ae" }}>
                <b>TopDish</b>
              </span>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="App">
            <div className="gpt">
              <MainContainer>
                <ChatContainer>
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={
                      typing ? (
                        <TypingIndicator content="TopDish is typing" />
                      ) : null
                    }
                  >
                    {messages.map((message, i) => {
                      return <Message key={i} model={message} />;
                    })}
                  </MessageList>
                  <MessageInput
                    placeholder="Type message here"
                    onSend={handleSend}
                  />
                </ChatContainer>
              </MainContainer>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Chatbot;
