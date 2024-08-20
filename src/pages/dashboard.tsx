import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ACCOUNTS, GET_TRANSACTIONS, CREATE_TRANSACTION } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import DatePicker from 'react-datepicker';
import moment from "moment";
import 'react-datepicker/dist/react-datepicker.css';
import { Search } from "lucide-react";
import { ChevronUp } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { formatCurrencyBRL, parseCurrencyBRL, formateDate, formateDateToTimestamp, formatCurrency } from '../utils/functions';
import { IAccount, ITransaction } from '../interfaces/Interfaces';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('authToken') as string);
    console.log(user);
    //const [to, setTo] = useState("");
    const [amountNumber, setAmountNumber] = useState("");
    const [depositAmount, setDepositAmount] = useState("");
    const [dateFilterTo, setDateFilterTo] = useState<Date | null>(null);
    const [dateFilterFrom, setDateFilterFrom] = useState<Date | null>(null);
    const [accountId, setAccountId] = useState<string | undefined>(undefined);
    const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION);
    const { data: accountsData, refetch: refatchAccounts } = useQuery(GET_ACCOUNTS);
    const userAccount = accountsData?.accounts.find((account: IAccount) => account.owner.id === user.id);
    const filteredAccounts = accountsData?.accounts.filter((account: IAccount) => account.owner.id !== user.id);
    const { data: transactionsData, refetch: refatchTransactions } = useQuery(GET_TRANSACTIONS, {
      variables: {
        accountId: user.accountId,
        dateFilterTo: dateFilterTo ? moment(dateFilterTo).format("YYYY-MM-DD") : null,
        dateFilterFrom: dateFilterFrom ? moment(dateFilterFrom).format("YYYY-MM-DD") : null,
      },
    });
    console.log(transactionsData);

    const handleTransferSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const amount = parseFloat(amountNumber);
        createTransaction({ variables: { from: user.accountId, to: accountId, amount } })
        .then((response) => {
            if (response.data.createTransaction) {
                console.log("Transaction created");
                cleanFields();
                refatchAccounts();
                refatchTransactions();
            }
        })
        .catch((err) => {
            console.error(err);
        });
    }

    const handleDepositSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const amount = parseFloat(depositAmount);
        createTransaction({ variables: { from: user.accountId, to: user.accountId, amount } })
        .then((response) => {
            if (response.data.createTransaction) {
                console.log("Transaction created");
                cleanFields();
                refatchAccounts();
                refatchTransactions();
            }
        })
        .catch((err) => {
            console.error(err);
        });
    };

    const formateDateTo = formateDateToTimestamp(dateFilterTo);
    const formateDateFrom = formateDateToTimestamp(dateFilterFrom);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    const cleanFields = () => {
        setAmountNumber("");
        setDepositAmount("");
        setAccountId(undefined);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6 mt-2">
            <header className="w-full max-w-4xl flex justify-between items-center p-6 bg-white shadow-md rounded-lg">
              <h1 className="text-2xl font-bold">Woovi Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span>Hello, {user.name}</span>
                <span>Balance: {formatCurrency(userAccount?.balance || 0)}</span>
                <Button onClick={handleLogout} className="bg-[#113463] hover:text-[#03D69D]" >Logout</Button>
              </div>
            </header>
            <div className="flex flex-col space-y-6 w-full max-w-4xl">
                <div className="flex space-x-6">
                    <div className="flex-1 p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Transfer</h2>
                        <form onSubmit={handleTransferSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">To</label>
                                <select
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="">Select Account</option>
                                    {filteredAccounts?.map((account: IAccount) => (
                                        <option key={account.id} value={account.id}>
                                            {account.ownerName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                type="text"
                                placeholder="Amount"
                                value={amountNumber}
                                onChange={(e) => {
                                  const formattedValue = formatCurrencyBRL(e.target.value);
                                  setAmountNumber(formattedValue);
                                }}
                                onBlur={() => {
                                  const numericValue = parseCurrencyBRL(amountNumber);
                                  setAmountNumber(numericValue.toString());
                                }}
                            />
                            <Button type="submit" size="lg" className="bg-[#113463] hover:text-[#03D69D]">
                                {loading ? "Loading..." : "Send"}
                            </Button>
                        </form>
                    </div>
                    <div className="flex-1 p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Deposit</h2>
                        <form onSubmit={handleDepositSubmit} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Amount"
                                value={depositAmount}
                                onChange={(e) => {
                                  const formattedValue = formatCurrencyBRL(e.target.value);
                                  setDepositAmount(formattedValue);
                                }}
                                onBlur={() => {
                                  const numericValue = parseCurrencyBRL(depositAmount);
                                  setDepositAmount(numericValue.toString());
                                }}
                            />
                            <Button type="submit" size="lg" className="bg-[#113463] hover:text-[#03D69D]">
                                {loading ? "Loading..." : "Deposit"}
                            </Button>
                        </form>
                    </div>
                </div> 
                <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
                    <div className="flex items-center justify-end space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">From</label>
                                <DatePicker
                                    selected={dateFilterTo}
                                    onChange={(date) => setDateFilterTo(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">To</label>
                                <DatePicker
                                    selected={dateFilterFrom}
                                    onChange={(date) => setDateFilterFrom(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <Button
                                className="bg-[#113463] hover:text-[#03D69D]" 
                                onClick={() => {
                                  refatchTransactions({
                                      accountId: '66bf4e8b4ac058a7c7d0645c',
                                      filter: {
                                          startDate: formateDateTo.toString(),
                                          endDate: formateDateFrom.toString(),
                                      }
                                  });
                                  console.log("Filters applied");
                              }}
                                size="sm"
                            >
                              <Search className="mr-2 h-4 w-4" /> 
                            </Button>
                    </div>
                    <h2 className="text-lg font-semibold">Transactions </h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>From</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionsData?.transactions.map((transaction: ITransaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        {transaction.type === 'income' ? (
                                          <ChevronUp size={24} color="green" />
                                        ) : (
                                          <ChevronDown size={24} color="red" />
                                        )
                                      }
                                    </TableCell>
                                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                    <TableCell>{formateDate(transaction.date)}</TableCell>
                                    <TableCell>{transaction.to.ownerName}</TableCell>
                                    <TableCell>{transaction.from.ownerName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
