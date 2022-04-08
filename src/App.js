import './App.css';
import HomePage from './pages/home';
import Machines from './pages/machines';
import MachineDetail from './pages/machine-detail';
import NotFound from './pages/not-found';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="machines" element={<Machines />}>
            <Route path=":machineId" element={<MachineDetail />}></Route>
          </Route>
        </Route>
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
