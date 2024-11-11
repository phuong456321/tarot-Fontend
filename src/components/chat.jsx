import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import icon from "./iconc.svg";
import SendIcon from "@mui/icons-material/Send";
import "./styles/chat.css";
import client from "../api";
import Markdown from "https://esm.sh/react-markdown@9";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { from: "User", text: inputValue };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");

      // Generate AI response after sending the message
      setLoading(true); // Set loading to true
      setTimeout(() => {
        generateAIResponse(inputValue, userMessage);
      }, 1000);
    }
  };
  function getRandomApiKey() {
    // Get the API keys from the environment variable
    const apiKeys = process.env.REACT_APP_GEMINI_API_KEY.split(','); 
    // Generate a random index
    var randomIndex = Math.floor(Math.random() * apiKeys.length);
    // Return the randomly selected API key
    return apiKeys[randomIndex];
  }
  const generateAIResponse = async (userMessage, userMessageObject) => {
    try {
      // Tạo lịch sử tin nhắn dưới dạng chuỗi
      const messageHistory = messages
        .map((msg) => `${msg.from}: ${msg.text}`)
        .join("\n");
      const response = await client.post(
        "/models/gemini-1.5-pro:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are an expert in tarot reading, you have to ask me questions to get information about my name, the topic I want to ask, the details of the problem, my feelings. Ask these questions individually or when you have received enough information and then after they have provided the information, put them all together and then proceed to draw 3 tarot cards in the form of a Smith Waite deck.:
                  AI: What is your name?
                  ${messageHistory}
                  User: ${userMessage}
                  Now, continue the conversation by asking the next question or offering the tarot card if all the information has been answered. Not claiming to be an AI, you're a tarot fortune teller.'`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 1,
            topP: 0.9,
            maxOutputTokens: 10000,
          },
        },
        {
          params: {
            key: getRandomApiKey(),
          },
        }
      );
      console.log("API response:", response.data);

      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates.length > 0
      ) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "AI", text: aiResponse },
        ]);
      } else {
        setLoading(true);
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      setLoading(true);
      console.error("Error in generateAIResponse:", error);
      if (error.response) {
        console.error(
          "Server responded with error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        setLoading(true);
        console.error("No response received:", error.request);
      } else {
        setLoading(true);
        console.error("Error setting up request:", error.message);
      }

      // Retry logic
      setTimeout(() => {
        setLoading(true);
        console.log("Retrying API call...");
        generateAIResponse(userMessage, userMessageObject); // Retry with the same user message
      }, 2000); // Retry after 2 seconds
    } finally {
      setLoading(false); // Set loading to false after processing
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);
  const loadingText = "Almost there! Just a moment for your message to be completed...";
  return (
    <div className="container2">
      <Link to="/card" className="iconlogo">
        <img src={icon} alt="ZodiacChat Logo" />
        <p>ZodiacChat</p>
      </Link>
      <div className="content2">
        <div className="chat">
          <div className="chatAI">
            <div className="chatAIcontent">
              <p>Greetings, dear seeker! I’m truly honored to accompany you on this journey of self-discovery through the wisdom of tarot. Before we begin, may I know your name so that we can connect more deeply?</p>
            </div>
          </div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.from === "AI" ? "chatAI" : "chatUser"}
            >
              <div
                className={
                  message.from === "AI" ? "chatAIcontent" : "chatUsercontent"
                }
              >
                <Markdown>{message.text}</Markdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chatAI">
              <div className="chatAIcontent">
                <p className="loading-message">{loadingText.split(" ").map((char, index) => (
          <span key={index} className="bounce" style={{ '--i': index }}>{char}&nbsp; </span>
        ))}</p> {/* Loading message */}
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
        <div>
          <div className="send">
            <input
              autoFocus
              ref={inputRef} 
              style={{ color: "white" }}
              type="text"
              placeholder="Nhập vào đây để chia sẻ tâm sự của bạn"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={loading}
            />
            <SendIcon
              onClick={handleSendMessage}
              style={{ cursor: "pointer" }}
            />
          </div>
          <p className="dk">
            Khi chọn nhắn tin với ZodiacChat thì bạn đã đồng ý với{" "}
            <b>
              <u>điều khoản</u>
            </b>{" "}
            của chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chat;
