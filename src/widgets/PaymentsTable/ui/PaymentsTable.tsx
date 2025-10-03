import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import styles from "./PaymentsTable.module.scss";

interface Payment {
  id: number;
  accountNumber: string;
  date: string;
  amount: string;
  status: "paid" | "unpaid";
}

const mockPayments: Payment[] = [
  {
    id: 1,
    accountNumber: "321312321",
    date: "16.03.2025",
    amount: "15,000 тг",
    status: "unpaid",
  },
  {
    id: 2,
    accountNumber: "321312321",
    date: "16.03.2025",
    amount: "15,000 тг",
    status: "paid",
  },
  {
    id: 3,
    accountNumber: "321312321",
    date: "16.03.2025",
    amount: "15,000 тг",
    status: "paid",
  },
  {
    id: 4,
    accountNumber: "321312321",
    date: "16.03.2025",
    amount: "15,000 тг",
    status: "paid",
  },
  {
    id: 5,
    accountNumber: "321312321",
    date: "16.03.2025",
    amount: "15,000 тг",
    status: "paid",
  },
  {
    id: 6,
    accountNumber: "321312321",
    date: "16.03.2025",
    amount: "15,000 тг",
    status: "paid",
  },
  {
    id: 7,
    accountNumber: "321312321",
    date: "16.03.2025",
    amount: "15,000 тг",
    status: "paid",
  },
  {
    id: 8,
    accountNumber: "321312321",
    date: "16.03.2025",
    amount: "15,000 тг",
    status: "paid",
  },
];

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "0px",
  boxShadow: "none",
  overflowX: "auto",
  padding: "22px 32px",
  "&::-webkit-scrollbar": {
    height: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c1c1c1",
    borderRadius: "2px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "10px 20px",

    "& .MuiTableCell-root": {
      fontSize: "11px",
    },
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: "transparent",
    color: "#0147ff",
    fontWeight: 600,
    fontSize: "14px",
    padding: "12px 8px",
    whiteSpace: "nowrap",
    minWidth: "80px",
    borderBottom: "1px solid #f5f5f5",
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiTableCell-head": {
      fontSize: "11px",
      padding: "8px 4px",
      minWidth: "60px",
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "1px solid #f5f5f5",
  padding: "12px 8px",
  fontSize: "13px",
  whiteSpace: "nowrap",
  minWidth: "80px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "11px",
    padding: "8px 4px",
    minWidth: "60px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#333",
  color: "white",
  borderRadius: "8px",
  padding: "8px 20px",
  fontSize: "12px",
  textTransform: "none",
  minWidth: "80px",
  "&:hover": {
    backgroundColor: "black",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
    padding: "4px 8px",
    minWidth: "60px",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: 500,
  height: "24px",
  minWidth: "80px",
  border: "0",
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
    height: "20px",
    minWidth: "60px",
  },
}));

const PaymentsTable: React.FC = () => {
  const handlePay = (paymentId: number) => {
    console.log("Paying for payment:", paymentId);
  };

  return (
    <div className={styles.paymentsPage}>
      <Box className={styles.title}>
        <Box className={styles.titleBar}></Box>
        <Typography variant="h4" className={styles.titleText}>
          Платежи
        </Typography>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Номер счета</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {mockPayments.map((payment) => (
              <TableRow key={payment.id}>
                <StyledTableCell>{payment.accountNumber}</StyledTableCell>
                <StyledTableCell>{payment.date}</StyledTableCell>
                <StyledTableCell>{payment.amount}</StyledTableCell>
                <StyledTableCell>
                  <StyledChip
                    label={
                      payment.status === "paid" ? "Оплачено" : "Не оплачено"
                    }
                    color={payment.status === "paid" ? "success" : "default"}
                    variant="outlined"
                    sx={{
                      color: payment.status === "paid" ? "#0147ff" : "#333",
                      borderColor:
                        payment.status === "paid" ? "#0147ff" : "#e0e0e0",
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  {payment.status === "unpaid" && (
                    <StyledButton onClick={() => handlePay(payment.id)}>
                      Оплатить
                    </StyledButton>
                  )}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </div>
  );
};

export { PaymentsTable };
