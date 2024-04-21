import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import Setting from "./components/Setting";
import { FileContextProvider } from "./context/fileContext";

const App = () => {
    const [modalOpen, setModalOpen] = useState(true);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            setModalOpen(true);
        } else {
            setModalOpen(false);
        }
    }, []);
    return (
        <ChatContextProvider>
            <Modal
                // title="Login"
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            >
                <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </Modal>
            <div className="flex transition duration-500 ease-in-out">
                <FileContextProvider>
                    <SideBar />
                    <ChatView />
                </FileContextProvider>
            </div>
        </ChatContextProvider>
    );
};

export default App;
