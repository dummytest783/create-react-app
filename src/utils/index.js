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

  export {
    numberFormater,
    sortByDate
  }