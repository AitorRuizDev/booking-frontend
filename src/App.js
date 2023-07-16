import { Routes, Route, BrowserRouter} from 'react-router-dom';
import ShowBookings from './components/ShowBookings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowBookings></ShowBookings>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
