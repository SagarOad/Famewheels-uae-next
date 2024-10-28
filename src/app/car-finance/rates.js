import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CarFinanceRates() {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const galleryUrl = process.env.NEXT_PUBLIC_GALLERY_URL;
  const [rates, setRates] = useState([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(`${baseUrl}/financebanklist`);

        setRates(response?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRates();
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Bank Names</StyledTableCell>
              <StyledTableCell align="center">
                Financing Rate
                <div className="finance-rate-sub-heading">
                  *rate is inclusive of Kibor
                </div>
              </StyledTableCell>
              <StyledTableCell align="center">Insurance Rate</StyledTableCell>
              <StyledTableCell align="center">Processing Fee</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rates?.map((row) => (
              <StyledTableRow key={row.financebank_id}>
                <StyledTableCell component="th" scope="row">
                  <img
                    src={`${galleryUrl}/${row?.financebank_logo}`}
                    alt={`${row?.financebank_name}`}
                    srcSet=""
                    style={{
                      objectFit: "contain",
                      width: "150px",
                      marginRight: "10px",
                    }}
                  />{" "}
                  {row.financebank_name}
                </StyledTableCell>
                <StyledTableCell align="center">{row.calories}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.financebank_insurance}
                </StyledTableCell>
                <StyledTableCell align="center">
                  PKR {row.financebank_process}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
