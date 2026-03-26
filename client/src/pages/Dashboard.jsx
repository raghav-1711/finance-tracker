import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {

const navigate = useNavigate();

/*
=====================
STATE
=====================
*/

const [transactions, setTransactions] = useState([]);

// ✅ USE SAME KEY AS STOCKS.JSX
const [stockPortfolio, setStockPortfolio] = useState(
  JSON.parse(localStorage.getItem("stockPortfolio")) || []
);

const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");
const [type, setType] = useState("income");

const [darkMode] = useState(
  localStorage.getItem("darkMode") === "true"
);

const token = localStorage.getItem("token");

const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

/*
=====================
🔥 SYNC STOCKS (KEY FIX)
=====================
*/
useEffect(() => {
  const handleStorageChange = () => {
    const latest = JSON.parse(localStorage.getItem("stockPortfolio")) || [];
    setStockPortfolio(latest);
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

/*
=====================
AUTH CHECK
=====================
*/
useEffect(() => {
  if (!token) navigate("/");
}, [token]);

/*
=====================
FETCH TRANSACTIONS
=====================
*/
useEffect(() => {

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTransactions(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  if (token) fetchTransactions();

}, [token]);

/*
=====================
ADD TRANSACTION
=====================
*/
const handleAddTransaction = async (e) => {
  e.preventDefault();

  if (!title || !amount) return;

  try {
    const res = await axios.post(
      "http://localhost:5000/api/transactions",
      {
        title,
        amount: Number(amount),
        type
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setTransactions([res.data, ...transactions]);

    setTitle("");
    setAmount("");

  } catch (err) {
    console.log(err);
  }
};

/*
=====================
DELETE TRANSACTION
=====================
*/
const deleteTransaction = async (id) => {

  await axios.delete(
    `http://localhost:5000/api/transactions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setTransactions(
    transactions.filter(t => t._id !== id)
  );
};

/*
=====================
DELETE STOCK
=====================
*/
const deleteStock = (symbol) => {

  const updated = stockPortfolio.filter(
    s => s.symbol !== symbol
  );

  setStockPortfolio(updated);

  localStorage.setItem(
    "stockPortfolio",
    JSON.stringify(updated)
  );
};

/*
=====================
CALCULATIONS
=====================
*/

const income = transactions
  .filter(t => t.type === "income")
  .reduce((a, c) => a + c.amount, 0);

const expense = transactions
  .filter(t => t.type === "expense")
  .reduce((a, c) => a + c.amount, 0);

const stockInvestment = stockPortfolio
  .reduce((a, s) => a + s.buyPrice * s.quantity, 0);

const balance = income - expense;

/*
=====================
CHART DATA
=====================
*/

const chartData = [
  { name: "Balance", value: balance },
  { name: "Expense", value: expense },
  { name: "Stocks", value: stockInvestment }
];

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

/*
=====================
UI
=====================
*/

return (

<div className={`${darkMode ? "bg-slate-900 text-white" : "bg-gray-100"} min-h-screen flex`}>

<Sidebar darkMode={darkMode} />

{/* MAIN */}
<div className="flex-1 p-10">

{/* HEADER */}
<div className="flex justify-between mb-8">

<h1 className="text-3xl font-bold">
Welcome, {user.name} 👋
</h1>

<button
onClick={() => {
  // ✅ FIX: DO NOT CLEAR STOCKS
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
}}
className="flex items-center gap-2 text-red-500"
>
<FaSignOutAlt />
Logout
</button>

</div>

{/* CARDS */}
<div className="grid grid-cols-4 gap-6 mb-10">

<Card title="Balance" value={balance} color="text-green-500"/>
<Card title="Income" value={income} color="text-blue-500"/>
<Card title="Expense" value={expense} color="text-red-500"/>
<Card title="Stocks" value={stockInvestment} color="text-indigo-500"/>

</div>

{/* PIE CHART */}
<div className="bg-white p-6 rounded-xl shadow-md mb-10">

<h2 className="text-xl font-bold mb-4">
Finance Overview
</h2>

<div className="h-64">

<ResponsiveContainer>
<PieChart>

<Pie data={chartData} dataKey="value" outerRadius={90} label>
{chartData.map((_, index) => (
<Cell key={index} fill={COLORS[index]} />
))}
</Pie>

<Tooltip />

</PieChart>
</ResponsiveContainer>

</div>

</div>

{/* ADD TRANSACTION */}
<div className="bg-white p-6 rounded-xl shadow-md mb-10">

<h2 className="text-xl font-bold mb-4">
Add Transaction
</h2>

<form onSubmit={handleAddTransaction} className="flex gap-4">

<input
placeholder="Title"
className="border p-2 rounded w-1/3"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<input
placeholder="Amount"
type="number"
className="border p-2 rounded w-1/3"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<select
value={type}
onChange={(e)=>setType(e.target.value)}
className="border p-2 rounded"
>
<option value="income">Income</option>
<option value="expense">Expense</option>
</select>

<button className="bg-blue-600 text-white px-4 rounded">
Add
</button>

</form>

</div>

</div>

{/* RIGHT PANEL */}
<div className="w-96 p-6 space-y-6">

<Panel title="Transactions" items={transactions} deleteFn={deleteTransaction} isStock={false}/>
<Panel title="Stocks" items={stockPortfolio} deleteFn={deleteStock} isStock={true}/>

</div>

</div>
);
}

/*
=====================
COMPONENTS
=====================
*/

function Card({title,value,color}) {
return (
<div className="bg-white p-6 rounded-xl shadow-md">
<h3 className="text-gray-500">{title}</h3>
<p className={`text-2xl font-bold mt-2 ${color}`}>₹{value}</p>
</div>
);
}

function Panel({title,items,deleteFn,isStock}) {
return (
<div className="bg-white p-6 rounded-xl shadow-md">

<h2 className="text-xl font-bold mb-4">{title}</h2>

{items.length===0 ? (
<p>No data</p>
) : (

<div className="space-y-3">

{items.map((item,index)=>(
<div key={index} className="flex justify-between items-center p-3 border rounded-lg">

<div>
<p className="font-semibold">
{isStock ? item.symbol : item.title}
</p>

{isStock && (
<p className="text-sm text-gray-500">
Qty: {item.quantity}
</p>
)}

</div>

<div className="flex gap-3 items-center">

{isStock && (
<p className="text-blue-500 font-bold">
₹{item.buyPrice * item.quantity}
</p>
)}

<button
onClick={()=>deleteFn(isStock ? item.symbol : item._id)}
className="text-red-500"
>
Delete
</button>

</div>

</div>
))}

</div>
)}

</div>
);
}