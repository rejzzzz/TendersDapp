import { Applytender } from './components/Applytender';
import { Choose } from './components/Choose';
import { Home } from './components/Home';
import { Layout } from './components/Layout';
// import { LoginWithMetaMask } from './components/Login';
import './css/app.css'
import { Routes,Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Layout/>}>
       <Route index element={<Home/>}/>
       <Route path='/choose' element={<Choose/>}/>
       <Route path='/applyTander' element={<Applytender/>}/>
      </Route>
      {/* <Route path='/login' element={<LoginWithMetaMask/>}/> */}
      {/* <Route path='/choose' element={<Choose/>}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
