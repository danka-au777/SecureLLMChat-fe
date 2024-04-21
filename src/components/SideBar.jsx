import { useState, useEffect, useContext } from 'react';
import {
  MdClose,
  MdMenu,
  MdDelete,
  MdUpload,
} from 'react-icons/md';
import { ChatContext } from '../context/chatContext';
import bot from '../assets/logo.svg';
import ToggleTheme from './ToggleTheme';
import Modal from './Modal';
import Setting from './Setting';

/**
 * A sidebar component that displays a list of nav items and a toggle
 * for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 */
const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [, , clearChat] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);


  function handleResize() {
    window.innerWidth <= 720 ? setOpen(false) : setOpen(true);
  }

  useEffect(() => {
    handleResize();
  }, []);

  function clear() {
    clearChat();
  }

  const handleUpdateFile = async () => {
    if (file) {
      console.log("Uploading file...");

      const formData = new FormData();
      formData.append("file", file);

      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const result = await fetch("https://d1mgavax5f35ri.cloudfront.net/api/documents/upload", {
          method: "POST",
          body: formData,
        });

        const data = await result.json();

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  }


  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }

  }

  return (
    <section
      className={`${open ? 'w-72' : 'w-16'
        } bg-neutral flex flex-col items-center gap-y-4 h-screen pt-4 relative duration-100 shadow-md`}>
      <div className='flex items-center justify-between w-full px-2 mx-auto'>
        <div
          className={` ${!open && 'scale-0 hidden'
            } flex flex-row items-center gap-1 mx-auto w-full`}>
          <img src={bot} alt='logo' className='w-5 h-5' />
          <p className={`${!open && 'scale-0 hidden'}`}>SecureLLMChat</p>
        </div>
        <div
          className='mx-auto btn btn-square btn-ghost'
          onClick={() => setOpen(!open)}>
          {open ? <MdClose size={15} /> : <MdMenu size={15} />}
        </div>
      </div>

      <ul className='w-full menu rounded-box gap-3'>
        <li>
          <input type="file" id="fileUpload" style={{ display: "none" }} accept="application/pdf" onChange={handleFileChange} />
          <a className='border border-slate-500' onClick={handleUpdateFile}>
            <MdUpload size={15} />
            <label htmlFor="fileUpload"><p className={`${!open && 'hidden'}`}>Upload File</p></label>
          </a>
        </li>
        <li>
          <a className='border border-slate-500' onClick={clear}>
            <MdDelete size={15} />
            <p className={`${!open && 'hidden'}`}>Clear chat</p>
          </a>
        </li>
        {file && (
          <section>
            File details:
            <ul>
              <li>Name: {file.name}</li>
              <li>Type: {file.type}</li>
              <li>Size: {file.size} bytes</li>
            </ul>
          </section>
        )}

      </ul>

      <ul className='absolute bottom-0 w-full gap-1 menu rounded-box'>
        <li>
          <ToggleTheme open={open} />
        </li>

      </ul>
      <Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
    </section>
  );
};

export default SideBar;
