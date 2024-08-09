import { AboutProject } from './components/AboutProject';
import { Applytender } from './components/Applytender';
import { Choose } from './components/Choose';
import {ContactUs} from './components/ContactUs';
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
       <Route path="/home" element={<Home/>}/>
       <Route index element={<Choose/>}/>
       <Route path='/applyTander' element={<Applytender/>}/>
       <Route path='/contactUs' element={<ContactUs/>}/>
       <Route path='/aboutProject' element={<AboutProject/>}/>
      </Route>
      {/* <Route path='/login' element={<LoginWithMetaMask/>}/> */}
      {/* <Route path='/choose' element={<Choose/>}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
