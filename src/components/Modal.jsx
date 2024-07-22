// Modal.js
import { motion } from "framer-motion";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    y: "-100vh",
  },
  visible: {
    opacity: 1,
    y: "0",
    transition: { delay: 0.3 },
  },
};

const Modal = ({ showModal, closeModal, showXButton = true, flexible = false, children }) => {
  return (
    <>
      {showModal && (
        <motion.div
          className="backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className={`${flexible ? "flex-modal" : "modal"}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            {children}
            {showXButton && (
              <button
                onClick={() => closeModal()}
                className="z-50 absolute top-[1rem] right-[1rem] p-2 bg-red-500 text-white rounded-full hover:bg-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Modal;
