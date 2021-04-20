import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';

import './App.css';

import InputBox from "./components/InputBox";
import OutputBox from "./components/OutputBox";

const URL = 'https://www.nbrb.by/api/exrates/rates?periodicity=0';

function App() {

    let [currencyData, setCurrencyData] = useState([]);
    let [toCurrency, setToCurrency] = useState('USD');
    let [amount, setAmount] = useState('');
    let [convertedAmount, setConvertedAmount] = useState(0);

    // useEffect(() => {
    //
    //     if (localStorage.getItem('currency')) {
    //         const currentDate = new Date(Date.now())
    //
    //         if (moment().isBefore(currentDate, 'day') === false) {
    //             setCurrencyData(getCompleteCurrData());
    //         }
    //     }
    // }, []);

    useEffect(() => {
        getCompleteCurrData();
    }, []);

    const data = useRef();
    data.current = currencyData;

    console.log(data)

    async function getCompleteCurrData() {
        const response = await fetch(URL);
        const data = await response.json();
        setCurrencyData(data)
        localStorage.setItem('currency', JSON.stringify(data));
    }

    const handleCurrencyChange = val => {
        setToCurrency(val)
        setAmount('')
        setConvertedAmount(0)
    };

    function convert(amountToConvert = amount) {
        let curr = data.find(curr => curr.Cur_Abbreviation === toCurrency)
        const convertedAmount = (amountToConvert * curr.Cur_Scale / curr.Cur_OfficialRate).toFixed(2)
        setConvertedAmount(+convertedAmount)
    }

    return (
        <div className="wrap">
            <h1 style={ {color: '#877e87'} }>Currency Converter</h1>
            <div className="App">

                {currencyData ?
                    <>
                    <InputBox
                        data={data}
                        amount={amount}
                        setAmount={setAmount}
                        handleCurrencyChange={handleCurrencyChange}
                        convert={convert}
                    />
                    <OutputBox
                        convertedAmount={convertedAmount}
                        toCurrency={toCurrency}
                    />
                    </>
                : null
                }
            </div>
        </div>
    );
}

export default App;