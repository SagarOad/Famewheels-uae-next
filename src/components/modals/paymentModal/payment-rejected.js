import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Failed from "@/images/payment-failed-icon.png";

const PaymentRejected = ({ open, onClose }) => {
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
            <img src={Failed} className="mb-4" alt="Failed" srcSet={Failed} />
            <h4 className="pb-2 fs-3 ">Payment Rejected</h4>
            <h3 className="pb-2 fs-3 ">Please try again later!</h3>
            <p>Redirecting.. in 3 seconds</p>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default PaymentRejected;
