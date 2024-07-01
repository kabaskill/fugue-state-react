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

const Modal = ({ showModal, closeModal, showXButton = true, children }) => {
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
          <motion.div className="modal" variants={modalVariants} initial="hidden" animate="visible">
            {children}
            {showXButton && (
              <button
                className="absolute top-[-3rem] right-[-3rem] rounded-full text-white "
                onClick={closeModal}
              >
                X
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Modal;
