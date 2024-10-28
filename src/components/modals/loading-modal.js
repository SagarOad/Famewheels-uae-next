import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TimerLoader from "@/images/timer.gif";

const LoadingModal = ({ open, onClose }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        disableAutoFocus={true}
        className="timerModal"
      >
        <Box className="text-center loadingModal">
          <img
            className="modalLoaderImg"
            src={TimerLoader}
            alt="Loading..."
            srcSet=""
          />
        </Box>
      </Modal>
    </>
  );
};

export default LoadingModal;
