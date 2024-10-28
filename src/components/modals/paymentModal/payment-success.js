import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Confirm from "@/images/blue-tick-success.png";

const PaymentSuccess = ({ open, onClose, response }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="md-modal position-relative p-3 p-md-4">
          <div className="modalBody_area successBox  px-2 text-center ">
            <img src={Confirm} className="mb-4" alt="confirm" srcSet={Confirm} />
            <h4 className="pb-2 fs-3 ">{response?.responseMessage}</h4>
            <h3 className="pb-2 fs-3 ">Transaction Successful</h3>
            <p>Redirecting.. in 3 seconds</p>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default PaymentSuccess;
