import React, { useContext, useState, useEffect } from 'react';
import userContext from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const Home = () => {
  const { user, setUser } = useContext(userContext);
  const [subscribedStocks, setSubscribedStocks] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate('/login'); 
  };

  const fetchData = async () => {
    if (!user) return;

    try {
      const allRes = await fetch(`${API_URL}/userstock/all`);
      const allData = await allRes.json();

      const subRes = await fetch(`${API_URL}/userstock/${user.id}`);
      const subData = await subRes.json();

      setSubscribedStocks(subData);
      
      const subTickers = subData.map(s => s.ticker);
      const remaining = allData.filter(s => !subTickers.includes(s.ticker));
      
      setAvailableStocks(remaining);

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1000); 
    return () => clearInterval(interval); 
  }, [user]);

  const handleSubscribe = async (ticker) => {
    try {
        await fetch(`${API_URL}/userstock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, ticker: ticker })
        });
        fetchData(); 
    } catch (err) {
        console.error(err);
    }
  };

  const handleUnsubscribe = async (ticker) => {
    try {
        await fetch(`${API_URL}/userstock`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, ticker: ticker })
        });
        fetchData(); 
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user?.name}</h1>

      <div style={{ display: "flex", gap: "50px" }}>
        
        <div>
          <h2>My Watchlist</h2>
          {subscribedStocks.length === 0 ? <p>No stocks subscribed.</p> : (
            <ul>
              {subscribedStocks.map((stock) => (
                <li key={stock.ticker} style={{ marginBottom: "10px" }}>
                  <strong>{stock.ticker}</strong>: ₹{Number(stock.price).toFixed(2)}
                  <button 
                    onClick={() => handleUnsubscribe(stock.ticker)}
                    style={{ marginLeft: "10px", color: "red" }}>
                    Unsubscribe
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2>Available Stocks</h2>
          <ul>
            {availableStocks.map((stock) => (
              <li key={stock.ticker} style={{ marginBottom: "10px" }}>
                <strong>{stock.ticker}</strong>: ₹{Number(stock.price).toFixed(2)}
                <button 
                  onClick={() => handleSubscribe(stock.ticker)}
                  style={{ marginLeft: "10px", color: "green" }}>
                  Subscribe
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <button onClick={handleLogout} style={{float: "right", backgroundColor: "red", color: "white"}}>
         Logout
      </button>
    </div>
  );
};

export default Home;