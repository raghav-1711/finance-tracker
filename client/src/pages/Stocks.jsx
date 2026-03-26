import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Stocks() {

const [symbol,setSymbol]=useState("AAPL");
const [quantity,setQuantity]=useState(1);

const [portfolio,setPortfolio]=useState(
JSON.parse(localStorage.getItem("stockPortfolio"))||[]
);

const [suggestions,setSuggestions]=useState([]);


// ===============================
// AI STOCK PICKER (AUTO UPDATE)
// ===============================

useEffect(()=>{

const bestStocks=[

{ symbol:"NVDA",reason:"AI sector leader" },
{ symbol:"MSFT",reason:"Cloud + AI dominance" },
{ symbol:"GOOGL",reason:"Undervalued tech giant" },
{ symbol:"AMZN",reason:"Strong ecommerce rebound" },
{ symbol:"RELIANCE.NS",reason:"India growth engine" }

];

setSuggestions(bestStocks);

const interval=setInterval(()=>{

setSuggestions(bestStocks.sort(()=>0.5-Math.random()));

},60000);

return()=>clearInterval(interval);

},[]);


// ===============================
// BUY STOCK FUNCTION
// ===============================

const buyStock=()=>{

if(!symbol||quantity<=0) return;

const newStock={

symbol:symbol.toUpperCase(),
quantity:Number(quantity),
buyPrice:100

};

const updated=[...portfolio,newStock];

setPortfolio(updated);

localStorage.setItem(
"stockPortfolio",
JSON.stringify(updated)
);

alert("Stock added to portfolio");

};


// ===============================
// TRADINGVIEW CHART LOADER
// ===============================

useEffect(()=>{

const container=document.getElementById("tv_chart");

container.innerHTML="";

const script=document.createElement("script");

script.src=
"https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

script.async=true;

script.innerHTML=JSON.stringify({

autosize:true,

symbol:symbol,

interval:"D",

timezone:"exchange",

theme:"light",

style:"1",

locale:"en",

allow_symbol_change:true,

support_host:"https://www.tradingview.com"

});

container.appendChild(script);

},[symbol]);


// ===============================
// UI
// ===============================

return(

<div className="flex min-h-screen bg-gray-100">

<Sidebar/>


<div className="flex-1 p-8">

<h1 className="text-3xl font-bold mb-6">

Stocks Dashboard 📈

</h1>


{/* SEARCH BAR */}

<div className="flex gap-4 mb-6">

<input

placeholder="Enter stock symbol (AAPL / TSLA / RELIANCE.NS)"

className="border p-2 rounded w-72"

value={symbol}

onChange={(e)=>setSymbol(e.target.value)}

 />

<input

type="number"

value={quantity}

onChange={(e)=>setQuantity(e.target.value)}

className="border p-2 rounded w-32"

/>

<button

onClick={buyStock}

className="bg-indigo-600 text-white px-5 rounded"

>

Buy Stock

</button>

</div>


{/* CHART */}

<div className="bg-white p-5 rounded-xl shadow mb-8">

<h2 className="font-semibold mb-3">

Live Chart: {symbol}

</h2>

<div

id="tv_chart"

style={{height:"500px"}}

/>

</div>


{/* AUTO AI PICKS */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-bold mb-4">

🔥 Best Stocks To Buy Right Now

</h2>

<div className="grid grid-cols-2 gap-4">

{suggestions.map((stock,index)=>(

<div

key={index}

className="border p-4 rounded-lg flex justify-between items-center"

>

<div>

<p className="font-bold">

{stock.symbol}

</p>

<p className="text-sm text-gray-500">

{stock.reason}

</p>

</div>

<button

onClick={()=>setSymbol(stock.symbol)}

className="text-indigo-600"

>

View Chart

</button>

</div>

))}

</div>

</div>

</div>

</div>

);

}