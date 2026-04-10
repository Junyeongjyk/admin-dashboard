import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageSent from "src/pages/MessageSent/MessageSent";
import "./ChatWidget.scss";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);

  return (
    <>
      {/* 버튼 */}
      <div className="chat-widget__button" onClick={toggle}>
        <i className="fa-solid fa-headset"></i>
      </div>

      {/* 위젯 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-widget"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="chat-widget__header">
              <span>관리자</span>
              <button onClick={toggle}>✕</button>
            </div>

            <div className="chat-widget__body">
              <MessageSent type={1} id={null} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

