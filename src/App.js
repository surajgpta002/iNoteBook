import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';


function App() {
  return (
    <>
      <NoteState>

        <BrowserRouter>

          <Navbar />
          <Alert message= "This is Amazing react app"/>

          <div className="container">
            <Routes>

              <Route exact path="/" element={<Home />}></Route>
              <Route exact path="/about" element={<About />}></Route>
              <Route exact path="/login" element={<Login />}></Route>
              <Route exact path="/signup" element={<Signup />}></Route>

            </Routes>
          </div>


        </BrowserRouter>

      </NoteState>


    </>
  );
}

export default App;



