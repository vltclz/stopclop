import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/data`
      );
      setData(response.data);
    };
    fetch();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Currently building.</p>
        <p>Fetched {data}</p>
      </header>
    </div>
  );
};

export default App;
