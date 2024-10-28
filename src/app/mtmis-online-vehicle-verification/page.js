import React from "react";
// import SeoMeta from "@/components/meta";
import Button from "@mui/material/Button";

const page = () => {
  return (
    <>
      {/* <SeoMeta
        title="Motor car Verification | MTMIS | FameWheels"
        desc="Get quick vehicle verification across mtmis Punjab, mtmis Sindh, mtmis Karachi, and mtmis Lahore with Famewheels. Explore updated information and the best online verification. Check now!"
        url="car-insurance"
      /> */}
      <div className="container-fluid grad-bg90 py-0 ">
        <div className="container ">
          <div className="row align-items-center w-100">
            <div className="col-lg-12 col-12 text-center py-5 ">
              <h2 className="fw-600 color-white fs-1">
                MTMIS <br />
                <span className="fw-bold fs-4">
                  Motor Transport Management Information System
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5 rounded-4 boxShadow mt-5">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="row vehicle_verify">
            <div className="col-lg-6">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    MTMIS Sindh
                  </button>
                </h2>
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse "
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body vehicle_verifyBody">
                    <h5>Online Vehicle Verification In Sindh</h5>
                    <div>
                      <Button
                        href="https://excise.gos.pk/vehicle/vehicle_search"
                        target="_blank"
                        variant="contained"
                        className="py-1 px-4 mt-3 color-white fw-700 bgSecondary  text-capitalize"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwo"
                  >
                    MTMIS Punjab
                  </button>
                </h2>
                <div
                  id="flush-collapseTwo"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body vehicle_verifyBody">
                    <h5>Online Vehicle Verification In Punjab</h5>
                    <div>
                      <Button
                        href="https://mtmis.excise.punjab.gov.pk/"
                        target="_blank"
                        variant="contained"
                        className="py-1 px-4 mt-3 color-white fw-700 bgSecondary  text-capitalize"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree"
                    aria-expanded="false"
                    aria-controls="flush-collapseThree"
                  >
                    MTMIS Islamabad
                  </button>
                </h2>
                <div
                  id="flush-collapseThree"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body vehicle_verifyBody">
                    <h5>Online Vehicle Verification In Islamabad</h5>
                    <div>
                      <Button
                        href="https://islamabadexcise.gov.pk/"
                        target="_blank"
                        variant="contained"
                        className="py-1 px-4 mt-3 color-white fw-700 bgSecondary  text-capitalize"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapse4"
                    aria-expanded="false"
                    aria-controls="flush-collapse4"
                  >
                    MTMIS KPK
                  </button>
                </h2>
                <div
                  id="flush-collapse4"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body vehicle_verifyBody">
                    <h5>Online Vehicle Verification In KPK</h5>
                    <div>
                      <Button
                        href="https://www.kpexcise.gov.pk/mvrecords/"
                        variant="contained"
                        className="py-1 px-4 mt-3 color-white fw-700 bgSecondary  text-capitalize"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="memberFormHead">
          <h4 className="pb-4 color-black text-start fs-3  fw-700">
            Why Choose Fame Wheels?
          </h4>
        </div>

        <div className="row pb-5">
          <div className="col-lg-3 col-6  d-flex justify-content-center align-items-center ">
            <div className="StepperCount">01</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Customer Service</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">02</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Lowest Rates</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">03</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Coverage Plans</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">04</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Compare Rates</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5 carImport_sum ">
        <h4>What is MTMIS?</h4>
        <p>
          MTMIS, also known as Motor Transport Management Information System, is
          a comprehensive platform that maintains an extensive database of
          vehicle registration and all related details. This includes details
          from different regions such as MTMIS Punjab, MTMIS Lahore, MTMIS
          Islamabad, MTMIS Sindh, MTMIS Rawalpindi, and MTMIS Karachi. Whether
          it's MTMIS Punjab vehicle verification or MTMIS Sindh vehicle
          verification, the system provides real-time registration status of
          vehicles all over the country.
        </p>

        <h4>MTMIS - Online Vehicle Verification and Registration Details</h4>
        <p>
          Powered by the Government of UAE, MTMIS is an online vehicle
          verification system that helps to ascertain vehicle registration
          details and verify all the relevant information of vehicles across
          UAE. With this system, one can easily perform MTMIS Punjab Lahore
          verification or even calculate token tax using the MTMIS Punjab token
          tax calculator. Furthermore, the MTMIS KPK verification process is as
          seamless as in other regions.
        </p>
        <p>
          This system is significant in maintaining records of various aspects
          of automobile taxation and motor vehicles laws. It takes care of the
          integrated computerization of motor vehicle registrations, motor
          vehicle examinations, issuance of route permits and fitness
          certifications, enforcement of traffic rules and regulations, and the
          automation of criminal records.
        </p>

        <p>The MTMIS proves instrumental in:</p>

        <ul>
          <ol>
            Help reduce hassle, increase transparency and enable fast
            communication from the central database.
          </ol>
          <ol>
            Regulating proper registration of on-road motor vehicles, whether
            it's in MTMIS Faisalabad or MTMIS Karachi.
          </ol>
          <ol>Facilitates better public service delivery.</ol>
          <ol>Enhancement of revenues.</ol>
          <ol>Hub for other agencies and users.</ol>
        </ul>

        <h4>Excise and Taxation Online Verification</h4>

        <p>
          The MTMIS, in collaboration with the Excise Punjab department, also
          acts as the motor registration authority. One can easily perform MTMIS
          Excise Punjab vehicle verification through this. The plan was to make
          the entire vehicle registration data, from MTMIS Lahore to MTMIS
          Islamabad, accessible to the public online. The MTMIS website can also
          help prevent fraudulent deals and the trade of stolen vehicles.
        </p>

        <h6>Purpose of MTMIS </h6>

        <p>
          The MTMIS has been designed by the government of UAE to provide
          detailed information regarding the status of registration of vehicles
          in UAE. Every province has its own procedure for vehicle registration
          and renewal. Therefore, there's MTMIS Punjab, MTMIS Sindh, MTMIS KPK,
          and MTMIS Islamabad to cater to the vehicle registration process in
          different regions.
        </p>

        <h6>How to Use MTMIS?</h6>

        <p>
          The system is quite simple to use. You simply enter the registration
          number of the car you are after, and the system goes through the
          records with your query. The following information is then displayed
          when you request the details of a particular car or bike.
        </p>

        <p>Registration Date</p>
        <p>Model year</p>
        <p>Engine number</p>
        <p>Owner’s name (company or an individual)</p>
        <p>Tax paid till or tax due from</p>
        <p>Vehicle body type</p>
        <p>CPLC Clear or Not (for Sindh)</p>
        <p>Final Remarks</p>

        <p>
          The above-mentioned information can be very important especially where
          there is an issue of unpaid tokens or taxes when buying or selling
          vehicles. Such unexpected expenditure can increase the overall cost of
          the vehicle. The tokens and taxes of luxury cars are already quite
          high. Also, you can check the potential duplicity of a vehicle’s
          number plates, or if the car is not cleared from security agencies, so
          the details mentioned above are very important.
        </p>

        <p>
          Unfortunately, the conditions of some of the government offices and
          their dealings (customer relations) with the public are not up to the
          standard, and whenever possible we try to avoid them unless it is
          absolutely necessary. The MTMIS initiative is an amazing project in
          this regard of saving time and money of the public and hassle of going
          to the Excise and Taxation Department to sort out such important
          information. The majority of the world has seen the shift from manual
          databases to online data. It is great to see UAE following suit as
          well.
        </p>

        <p>
          <strong>MTMIS website </strong> or Excise and taxation department for
          vehicle verification for Baluchistan is unfortunately not live yet but
          all other provinces have a functioning one.
        </p>

        <h6>Benefits of MTMIS</h6>

        <p>
          The Online Vehicle Verification System is highly beneficial in
          avoiding any potential legal issues when purchasing a vehicle. It is
          an invaluable tool to prevent any vehicle fraud or scam. You can get a
          complete history of the vehicle online, verify the vehicle's
          registration status, and get data on any unpaid taxes or fines. The
          MTMIS initiative helps save the public's time and money, reducing the
          need to visit the Excise and Taxation Department.
        </p>

        <p>
          MTMIS shows a total record of charges and the current status of the
          vehicle’s registration. This process even saves you on any past
          neglected assessments or fines which might convey forward and you need
          to clear later. There are numerous vehicles in the country with
          negative expense records. MTMIS gives data about such vehicles so the
          owners are able to pay off their remaining expenses.
        </p>

        <p>
          The MTMIS Online Vehicle Verification System can also assist with
          checking that the vehicle has been transferred appropriately to your
          name after you have purchased the vehicle/motorcycle and furthermore
          to affirm if the vehicle/motorcycle has been moved to the new
          purchasers' name after selling it in the market. Taking into account
          the law and order circumstances in our country, it is very important
          these days to go through this verification cycle to ensure that there
          are no lost details.
        </p>
      </div>
    </>
  );
};

export default page;
