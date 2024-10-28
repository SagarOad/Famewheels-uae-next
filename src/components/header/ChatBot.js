import { Box, SpeedDial } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import logo from "@/images/fame-wheels-logo.png";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Loader from "@/images/icons/d3iSD5efML.json";
import Lottie from "lottie-react";
import Image from "next/image.js";

const Chatbot = () => {
    const chatUrl = process.env.REACT_APP_CHAT_URL;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! Welcome to FameWheels. What can I help you with?",
    },
  ]);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever messages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSpeedToggle = () => {
    setSpeedOpen(!speedOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await axios.post(`${chatUrl}/chatbot`, {
        message: input,
        sessionId: sessionId,
      });
      const chatbotMessage = response.data.message;
      setLoading(false);
      setMessages([...newMessages, { sender: "bot", text: chatbotMessage }]);
    } catch (error) {
      console.error("Error from backend:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Box className="position-relative">
        <SpeedDial
          ariaLabel=""
          sx={{ position: "fixed", bottom: 40, right: 30 }}
          icon={
            speedOpen ? (
              <div
                style={{ fontSize: 12 }}
                className="d-flex align-items-center gap-2"
              >
                <CloseIcon sx={{ height: 15, width: 15 }} /> Close
              </div>
            ) : (
              <div
                style={{ fontSize: 12 }}
                className="d-flex align-items-center gap-2"
              >
                <QuestionAnswerOutlinedIcon sx={{ height: 15, width: 15 }} />{" "}
                Need Help?
              </div>
            )
          }
          onClick={handleSpeedToggle}
          open={speedOpen}
          className="SpeedDailBtn"
        />

        {speedOpen && (
          <div className="supportPopup pt-2">
            <div>
              <p
                style={{ fontSize: 16 }}
                className=" mb-0 text-white fw-700 px-4 py-2 d-flex  align-items-center "
              >
                {/* <Image
                  src={logoWhite}
                  alt="logo-famewheels"
                  className="img-fluid w-25"
                /> */}
                <i class="fa-solid fa-headset me-3 fs-4 "></i>
                Chat with FameWheels
              </p>
            </div>
            <div className="mt-2 p-2 bg-white rounded-2">
              <div
                ref={chatContainerRef} // Attach the ref to the chat container
                style={{
                  height: "450px",
                  overflowY: "scroll",
                  maxWidth: "450px",
                }}
              >
                {messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    {msg?.sender === "bot" ? (
                      <div
                        className="d-flex justify-content-start align-items-start  rounded-2 px-2 pt-2"
                        style={{ maxWidth: "90%", height: "fit-content" }}
                      >
                        <Image
                          src={logo}
                          alt="logo"
                          className="img-fluid  bg-light rounded-pill bg-white border"
                          style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "10px",
                            marginBottom: "10px",
                            objectFit: "contain",
                            padding: 4,
                          }}
                        />
                        <div>
                          <p
                            className="mb-0"
                            style={{
                              fontSize: "10px",
                              fontWeight: "normal",
                              color: "#212121",
                            }}
                          >
                            FameWheels
                          </p>
                          <p
                            className="text-start py-2 m-0  px-3 mt-1 "
                            style={{
                              fontSize: "13.5px",
                              height: "fit-content",
                              backgroundColor: "#e5e5e5",
                              borderTopLeftRadius: 0,
                              borderTopRightRadius: 15,
                              borderBottomLeftRadius: 15,
                              borderBottomRightRadius: 15,
                            }}
                          >
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="d-flex justify-content-end align-items-start w-100"
                        style={{ height: "fit-content" }}
                      >
                        <div
                          className="d-flex justify-content-start align-items-start text-white rounded-2 px-2 pt-2"
                          style={{ maxWidth: "90%", height: "fit-content" }}
                        >
                          <div>
                            <p
                              className="mb-0 color-black text-end"
                              style={{ fontSize: "10px", fontWeight: "normal" }}
                            >
                              Me
                            </p>
                            <p
                              className="text-start py-2 px-3 mb-2"
                              style={{
                                fontSize: "13.5px",
                                height: "fit-content",
                                backgroundColor: "#20409a",
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 0,
                                borderBottomLeftRadius: 15,
                                borderBottomRightRadius: 15,
                              }}
                            >
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                {loading && (
                  <div
                    className="d-flex justify-content-start align-items-start  rounded-2 px-2 pt-2 mb-3 "
                    style={{ maxWidth: "90%", height: "fit-content" }}
                  >
                    <Image
                      src={logo}
                      alt="logo"
                      className="img-fluid  bg-light rounded-pill bg-white border"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "10px",
                        marginBottom: "10px",
                        objectFit: "contain",
                        padding: 4,
                      }}
                    />
                    <div>
                      <p
                        className="mb-0"
                        style={{
                          fontSize: "10px",
                          fontWeight: "normal",
                          color: "#212121",
                        }}
                      >
                        FameWheels
                      </p>
                      <p
                        className="text-start py-2 m-0  px-3 mt-1 "
                        style={{
                          fontSize: "13.5px",
                          height: "fit-content",
                          backgroundColor: "#e5e5e5",
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 15,
                          borderBottomLeftRadius: 15,
                          borderBottomRightRadius: 15,
                        }}
                      >
                        <Lottie
                          className="chatloader"
                          animationData={Loader}
                          loop={true}
                        />
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <form
                className="d-flex align-items-center form-control rounded-pill px-3 "
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  className="  px-0 border-0"
                  placeholder="Enter your message"
                  required
                  value={input}
                  onChange={handleInputChange}
                  style={{ fontSize: "13.5px", outlineStyle: "none" }}
                />
                <button
                  onClick={handleSendMessage}
                  type="submit"
                  className="border-0 py-1 px-3 text-light  rounded-pill"
                  style={{ height: "fit-content", backgroundColor: "#20409a" }}
                >
                  <SendIcon sx={{ fontSize: "18px" }} />
                </button>
              </form>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default Chatbot;
