import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import appkey from '../../config/appkey.json';
import api from '../../config/api.json';
import {trimSentence, debounce} from '../../utils/index'

const getConvertedOptions = (response) => {
  return response.data && response.data.results && response.data.results.filter(val => val.locale === 'us').map((obj) => {
    return {label: `${trimSentence(obj.name)} (${obj.ticker})`, value: obj.ticker};
  });
};

const multiSelectFn = (inputValue) =>{
  if(!inputValue || inputValue.length ===0) {
    return [];
  }
  return new Promise((resolve) => {
    debouncedFn(inputValue, resolve)
  });
}

function getApiTickerData(inputValue, resolve) {
  const apikey = appkey.polygonIOKey;
  const apiUrl = `${api.polygon}${api.polygonSearchTickerApi}?market=stocks&search=${inputValue}&apiKey=${apikey}`;
  axios.get(apiUrl).then(response => {
    const selectOptions = getConvertedOptions(response);
    resolve(selectOptions);
  })
}

const debouncedFn = debounce(getApiTickerData, 1000);

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '2px solid #ccc',
    borderRadius: '4px',
    padding: '5px',
    boxShadow: state.isFocused ? '0 0 0 2px #007bff' : null,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#007bff' : null,
    color: state.isFocused ? 'white' : null,
    cursor: 'pointer',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    display: 'none',
    color: state.isFocused ? '#007bff' : null,
  })
}
function MultiSelect({setMultiSelectValues, multiSelectInput}) {
  const handleSelectChange = (selectedOptions) => {
    setMultiSelectValues(selectedOptions)
  };

  return (
    <AsyncSelect
    isMulti
    cacheOptions
    styles={customStyles}
    onChange={handleSelectChange}
    value={multiSelectInput}
    loadOptions={multiSelectFn}
    placeholder="Type company name"
    noOptionsMessage={() => null}
  />
  )
}
export default MultiSelect;
