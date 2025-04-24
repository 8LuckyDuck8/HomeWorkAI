import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

function App() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '' });
  const [calculations, setCalculations] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;
    
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) return;

    setExpenses((prev) => [...prev, { ...newExpense, amount }]);
    setNewExpense({ category: '', amount: '' });
  };

  const calculateExpenses = () => {
    if (expenses.length === 0) return;

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const dailyAverage = total / 30;
    
    const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
    const top3 = sortedExpenses.slice(0, 3);

    setCalculations({
      total,
      dailyAverage,
      top3,
    });
  };

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Expense Calculator
      </Typography>

      <StyledCard>
        <CardContent>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              name="category"
              label="Category"
              value={newExpense.category}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="amount"
              label="Amount ($)"
              type="number"
              value={newExpense.amount}
              onChange={handleInputChange}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={addExpense}
              sx={{ minWidth: '120px' }}
            >
              Add Expense
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell align="right">
                      ${expense.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={calculateExpenses}
              disabled={expenses.length === 0}
            >
              Calculate
            </Button>
          </Box>
        </CardContent>
      </StyledCard>

      {calculations && (
        <StyledCard>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Results
            </Typography>
            <Typography variant="body1" paragraph>
              Total Expenses: ${calculations.total.toLocaleString()}
            </Typography>
            <Typography variant="body1" paragraph>
              Average Daily Expense: ${calculations.dailyAverage.toLocaleString()}
            </Typography>
            <Typography variant="body1" paragraph>
              Top 3 Expenses:
              <ul>
                {calculations.top3.map((expense, index) => (
                  <li key={index}>
                    {expense.category}: ${expense.amount.toLocaleString()}
                  </li>
                ))}
              </ul>
            </Typography>
          </CardContent>
        </StyledCard>
      )}
    </StyledContainer>
  );
}

export default App; 