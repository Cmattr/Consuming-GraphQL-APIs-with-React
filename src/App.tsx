import './App.css';
import { Route, Routes } from 'react-router-dom';
import CreatePostPage from './Pages/CreatePost-page';

function App() {
  return (
    <Routes>
      <Route path='/' element={<CreatePostPage />} />
    </Routes>
  )
}

export default App;
