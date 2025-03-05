import './App.css'
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import PageNotFound from './components/PageNotFound';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './components/contextAPI/AuthContext';
import Home from './components/Home';
import TextEditor from './components/TextEditor';
import {SnackbarProvider} from 'notistack';
import ViewPage from './components/ViewPage';
function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
    <BrowserRouter>
      <Routes>
        {/* <Route path='/login' element= {<GoogleLogin/>}/> */}
        <Route path='/' element = {<Home/>}/>
        <Route path='/dashboard' element = {<Dashboard/>}/>
        <Route path='/texteditor/:docId' element = {<TextEditor/>}/>
        <Route path='/view/:docId' element = {<ViewPage/>}/>
        <Route path='*' element ={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
    </SnackbarProvider>
    </AuthProvider>
  )
}

export default App
