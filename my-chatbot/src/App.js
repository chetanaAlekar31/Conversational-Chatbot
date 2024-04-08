import React,{useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
function App() {

  const uuidCheck = () => localStorage.getItem('device_info') ?  null : uuidv4()

  const uuidv4 = () => {
    let uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    localStorage.setItem('device_info',JSON.stringify({device_id : uuid}))
  }

  useEffect(() => {
    uuidCheck();
  }, []);

  return (
    <div className="App">
      <Header/>
    </div>
  
  );
}





export default App;