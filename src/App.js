import { Route, Routes, BrowserRouter  } from 'react-router-dom';
import './App.css';
import Joinroom from './components/Joinroom/Joinroom';
import EditorPage from './components/EditorPage/EditorPage';
import { Toaster } from 'react-hot-toast';
import Editor from './components/Editor/Editor'

function App() {
  return (
    <>
      
      <Toaster/>
      <BrowserRouter>
      <Routes>
        <Route path='/join-room' element={<Joinroom/>}></Route>
        <Route path='/' element={<Editor/>}></Route>
        <Route path='/editor/:roomID' element={<EditorPage/>}></Route>     
      {/* <Room/> */}
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
