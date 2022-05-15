import React, {FC, useState} from 'react';
import './App.scss';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

const App: FC = () => {

    const [path, setPath] = useState<number[]>([])
    const [distance, setDistance] = useState<number | undefined>(undefined)

    return <div className="full-height app">
        <Header path={path} setPath={setPath} distance={distance} setDistance={setDistance}/>
        <Main/>
        <Footer/>
    </div>

}

export default App;