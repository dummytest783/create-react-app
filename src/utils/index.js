function numberFormater(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + ' bn';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' mn';
    }
    return num.toString();
}

function sortByDate(list) {
    if(!list) {
        return
    }
    return list.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function trimSentence(sentence) {
  return sentence.trim().split(' ').slice(0, 2).join(' ');
}

function debounce(func, timeout = 1000){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function addPercentageGrowth(chartList, numberOfYears) {
  const slicedList = chartList && chartList.slice(-numberOfYears);
  return slicedList && slicedList.map((chartItem, index) => {
      if(index) {
        const current = parseInt(slicedList[index].value);
        const prev = parseInt(slicedList[index-1].value);
        const percentage = ((current - prev) / prev) * 100;
        return {...chartItem, 'percentage': `${percentage.toFixed(1)}%`}
      } else {
        return chartItem;
      }
  })
}

function roundToTwoDecimals(value) {
  // Ensure the value is a number and round it to 2 decimal places
  const numericValue = Number(value);
  if (!isNaN(numericValue)) {
    return parseFloat(numericValue.toFixed(2));
  } else {
    console.error('Invalid number:', value);
    return 0; // Return a default value if the input is not a valid number
  }
}

export {
  numberFormater,
  sortByDate,
  trimSentence,
  debounce,
  addPercentageGrowth,
  roundToTwoDecimals
}