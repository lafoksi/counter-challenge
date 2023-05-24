import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./redux/counter/Store";
import { Counter, CounterWs, Sphere } from "./components";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={< Counter />}></Route>
            <Route exact path='/live' element={< CounterWs />}></Route>
            <Route exact path='/sphere' element={< Sphere />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
