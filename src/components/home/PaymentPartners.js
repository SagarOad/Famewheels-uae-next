import Image from "next/image";
import Jazzcash from "@/images/jazzcash.png";
import Payfast from "@/images/PayFastLogo.png";
import BAFL from "@/images/bafl-logo-home.png";
import BALH from "@/images/al-habib.png";
import NBP from "@/images/nbp.png";

const PaymentPartners = () => {
  return (
    <>
    <div className="container">
          <div className=" my-5 pb-5">
            <h2
              className="text-center text-md-start section-titles pb-5 fs-1"
              id="paymentpartners"
            >
              Our <br /> Payment{" "}
              <span className="color-secondary">Partners</span>
            </h2>
            <div className="d-flex justify-content-center justify-content-md-around align-items-center paymentPartnersImg flex-wrap gap-4">
              <Image src={Jazzcash} alt="Jazzcash" srcSet={Jazzcash} />
              <Image src={Payfast} alt="Payfast" srcSet={Payfast} />
              <Image src={BAFL} alt="Alfala" srcSet={BAFL} />
              <Image src={BALH} alt="AlHabib" srcSet={BALH} />
              <Image src={NBP} alt="AlHabib" srcSet={NBP} />
            </div>
          </div>
        </div>
    </>
  )
}

export default PaymentPartners