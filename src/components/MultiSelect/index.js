import React from 'react';

import AsyncSelect from 'react-select/async';
import axios from 'axios';
import options from './options';
import appkey from '../../config/appkey.json';

const filterColors = (inputValue) => {
  return options.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const promiseOptions = (inputValue) =>{
  //searchTicker(inputValue)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });
}

const searchTicker =  (inputStr) =>  {
  const apikey = appkey.alphaVintageKey;
  const apiUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${inputStr}&apikey=${apikey}`;
  axios.get(apiUrl).then(response => {
    console.log('response ',  response)
  })

}


function MultiSelect() {
  return (
    <AsyncSelect
    isMulti
    cacheOptions
    defaultOptions
    loadOptions={promiseOptions}
  />
  )
}
export default MultiSelect;
