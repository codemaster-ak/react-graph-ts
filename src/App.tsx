import React, {FC, useState} from 'react';
import './App.scss';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import {ComputeMethods} from "./enums";

const App: FC = () => {

    const [fromPointKey, setFromPointKey] = useState<string>('')
    const [toPointKey, setToPointKey] = useState<string>('')
    const [compareResult, setCompareResult] = useState<string>('')

    const [throughPoints, setThroughPoints] = useState<string[]>([])
    const [selectedMethod, setSelectedMethod] = useState<ComputeMethods>(ComputeMethods.Dijkstra)

    return <div className="full-height app">
        <Header
            fromPointKey={fromPointKey}
            toPointKey={toPointKey}
            compareResult={compareResult}
            selectedMethod={selectedMethod}
            throughPoints={throughPoints}
        />
        <Main/>
        <Footer
            fromPointKey={fromPointKey}
            toPointKey={toPointKey}
            setFromPointKey={setFromPointKey}
            setToPointKey={setToPointKey}
            setCompareResult={setCompareResult}
            throughPoints={throughPoints}
            setThroughPoints={setThroughPoints}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
        />
    </div>
}

export default App;