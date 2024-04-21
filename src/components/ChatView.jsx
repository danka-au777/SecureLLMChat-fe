import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import { FileContext } from "../context/fileContext";
import Thinking from "./Thinking";
import { MdSend } from "react-icons/md";
import { replaceProfanities } from "no-profanity";
import Modal from "./Modal";
import Setting from "./Setting";

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const messagesEndRef = useRef();
    const inputRef = useRef();
    const [formValue, setFormValue] = useState("");
    const [thinking, setThinking] = useState(false);
    const [messages, addMessage] = useContext(ChatContext);
    const [respondData, setRespondData] = useContext(FileContext);
    const [modalOpen, setModalOpen] = useState(false);

    /**
     * Scrolls the chat area to the bottom.
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    /**
     * Adds a new message to the chat.
     *
     * @param {string} newValue - The text of the new message.
     * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
     */
    const updateMessage = (newValue, ai = false) => {
        const id = Date.now() + Math.floor(Math.random() * 1000000);
        const newMsg = {
            id: id,
            createdAt: Date.now(),
            text: newValue,
            ai: ai,
        };

        addMessage(newMsg);
    };

    /**
     * Sends our prompt to our API and get response to our request from openai.
     *
     * @param {Event} e - The submit event of the form.
     */
    const sendMessage = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setModalOpen(true);
            return;
        }

        const newMsg = formValue;

        setThinking(true);
        setFormValue("");
        updateMessage(newMsg, false);

        try {
            //aws AI API request in here
            // await API
            const response = await fetch(
                `https://s6gbso96ee.execute-api.us-east-1.amazonaws.com/api/documents/${fileId}/query`,
                {
                    method: "POST",
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: newMsg,
                    }),
                }
            );
            const data = await response.json();
            const { text } = data;
            text && updateMessage(text, true);
        } catch (err) {
            window.alert(`Error: ${err} please try again later`);
        }

        setThinking(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            // 👇 Get input value
            sendMessage(e);
        }
    };

    /**
     * Scrolls the chat area to the bottom when the messages array is updated.
     */
    useEffect(() => {
        scrollToBottom();
    }, [messages, thinking]);

    /**
     * fecth summary when file upload respond back.
     */
    useEffect(() => {
        if (!respondData) return;
        console.log(respondData);
        const { id: fileId } = respondData;
        if (!fileId) return;
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch(
            `https://s6gbso96ee.execute-api.us-east-1.amazonaws.com/api/documents/${fileId}/summary`,
            {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                const { text } = data;
                updateMessage(text, true);
            })
            .catch((error) => {
                // setModalOpen(true);
                // localStorage.setItem("token", null);
                console.error(error);
            });
    }, [respondData]);

    /**
     * Focuses the TextArea input to when the component is first rendered.
     */
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <main className="relative flex flex-col h-screen p-1 overflow-hidden dark:bg-light-grey">
            <section className="flex flex-col flex-grow w-full px-4 overflow-y-scroll sm:px-10 md:px-32">
                {messages.length ? (
                    messages.map((message, index) => (
                        <Message key={index} message={{ ...message }} />
                    ))
                ) : (
                    <div className="flex my-2">
                        <div className="w-screen overflow-hidden content-center justify-items-center">
                            <ul className="grid content-center justify-items-center">
                                <li className="content-center justify-items-center p-6 border rounded-lg border-slate-300 hover:border-slate-500">
                                    <h1 className="text-base font-semibold content-center justify-items-center ">
                                        Welcome to SecureLLMChat
                                    </h1>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {thinking && <Thinking />}

                <span ref={messagesEndRef}></span>
            </section>
            <form
                className="flex flex-col px-10 mb-2 md:px-32 join sm:flex-row"
                onSubmit={sendMessage}
            >
                <div className="flex items-stretch justify-between w-full">
                    <textarea
                        ref={inputRef}
                        className="w-full grow input input-bordered join-item max-h-[20rem] min-h-[3rem]"
                        value={formValue}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setFormValue(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="join-item btn"
                        disabled={!formValue}
                    >
                        <MdSend size={30} />
                    </button>
                </div>
            </form>
            <Modal
                title="Setting"
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            >
                <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </Modal>
        </main>
    );
};

export default ChatView;
