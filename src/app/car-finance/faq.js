import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CarFinanceFAQs() {
  return (
    <>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          What is the minimum amount required for car finance?
        </AccordionSummary>
        <AccordionDetails>
          The minimum amount required for car finance is 35% as a down payment.
          Our user-friendly car loan calculator helps you to take a car on
          installments in UAE. You can compare the interest rate, insurance
          rates, markup, and varying Kibor rates of changing banks. It will help
          you to take a bank loan for car at a reliable price according to your
          budget.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          What is the eligibility criteria required for financing a car in
          UAE?
        </AccordionSummary>
        <AccordionDetails>
          The eligibility criteria for financing a car in UAE varies. For a
          salaried person, the applicant's age should be 22 years old or a
          maximum of 65 or less at the time of maturity. The maximum income of
          the salaried person should be RS 80,000. The salary of a self-employed
          individual should be RS 1,00,000. However, in the case of
          pensioner/remittance income, the minimum age should be 65 or less,
          with a salary of RS 1,00,000.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          What is the minimum or maximum financing tenure and criteria for cars?
        </AccordionSummary>
        <AccordionDetails>
          The minimum financing criteria for new and used cars is 1 year, and
          for the maximum, it is 5 years. If the car is up to 1000cc, the tenure
          should be 1 to 5 years for the model of 2016 and onwards. However, if
          the car is more than 1000cc, the plan should be 3 to 5 years for the
          car from 2016 onwards. However, Faysal Bank and Dubai Islamic Bank
          offer car financing for 9 years old vehicles as well, with a tenure of
          3 years.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          What are the documents required for car financing in UAE?
        </AccordionSummary>
        <AccordionDetails>
          The documents for car financing vary on the type of employment in
          UAE. The general documents that we need are 2 passport-size
          pictures, a CNIC copy, an appointment letter, a bank account
          maintenance letter, and a letter with 6 months to 1 year of job
          experience. In addition, both bank letters and bank statements should
          be signed and stamped.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          What is Islamic car finance?
        </AccordionSummary>
        <AccordionDetails>
          Islamic car finance is a type of financing that follows
          Shariah-compliant principles. It operates on the concept of
          Musharakah, where the bank and the borrower share the cost and profit
          of the car purchase.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel6-content"
          id="panel6-header"
        >
          Which bank is cheapest for car loan?
        </AccordionSummary>
        <AccordionDetails>
          Several banks offer competitive interest rates for car loans in
          UAE. It is recommended to compare the rates and terms offered by
          different banks before making a decision. Some of the popular banks
          for car loans include MCB Bank, HBL, and Faysal Bank.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel7-content"
          id="panel7-header"
        >
          Is car financing halal or haram?
        </AccordionSummary>
        <AccordionDetails>
          The permissibility of car financing, also known as auto loans, in
          Islamic finance depends on the specific structure and compliance with
          Shariah principles. Islamic banks offer halal car financing options
          that adhere to Shariah guidelines, such as avoiding interest-based
          transactions and promoting profit-sharing models. It is important for
          individuals to seek guidance from Islamic scholars or experts to
          ensure compliance with Islamic principles in car financing.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel8-content"
          id="panel8-header"
        >
          How can I pay the minimum amount of money in each installment?
        </AccordionSummary>
        <AccordionDetails>
          The loan tenure and EMI (equated monthly installment) are inversely
          related. This means the longer you take to pay off the loans, the
          lower the amount in installments you will have to pay and vice versa.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel9-content"
          id="panel9-header"
        >
          What is the maximum amount required for car finance?
        </AccordionSummary>
        <AccordionDetails>
          The maximum down payment which the individual has to pay is 70%.
          Moreover, each bank has a varying policy, interest rate, and insurance
          rate. Furthermore, the vehicle owners' credit source and financial
          history play an important role in determining the maximum amount they
          can borrow.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel10-content"
          id="panel10-header"
        >
          Does FameWheels charge any additional cost or interest for car
          financing?
        </AccordionSummary>
        <AccordionDetails>
          No, we don't charge any additional charges for auto financing.
          However, you need to pay a significant upfront cost as a downpayment.
          It varies, ranging from maximum to minimum. The customers can choose
          the one suitable for them on the car loan calculator present on our
          website.{" "}
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel11-content"
          id="panel11-header"
        >
          Is there any time and car finance limit for cars in UAE?
        </AccordionSummary>
        <AccordionDetails>
          Yes, there are 1-7 years in which the vehicle owners have to repay the
          borrowed money to the banks. Moreover, the car finance limit is RS 50
          lacs to 2 lacs. The minimum price of a car should be a minimum of 50
          lacs or a maximum of 2 lacs.
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel12-content"
          id="panel12-header"
        >
          Does the bank cover car insurance in the auto financing plan?
        </AccordionSummary>
        <AccordionDetails>
          The banks consist of car insurance services along with financing for
          both new and used cars. However, banks have varying insurance
          companies and types of insurance for car owners. It depends upon their
          needs and demands on which insurance they will choose.
        </AccordionDetails>
      </Accordion>
    </>
  );
}
