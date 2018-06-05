Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

var init = function() {
    chrome.storage.sync.get(['sCurrencyCoverterState'], function(result) {
        if (result && result.sCurrencyCoverterState && result.sCurrencyCoverterState.length > 0) {
            for(sCurrencyCoverterStateItem of result.sCurrencyCoverterState) {
                let updateConversionResult = true;
                addCurrencyLineItem(sCurrencyCoverterStateItem, updateConversionResult);
            }
        } else {
            let currencyLineItem = {};
            currencyLineItem.id = 0;
            currencyLineItem.fromCurrency = 'AED';
            currencyLineItem.toCurrency = 'AED';
            addCurrencyLineItem(currencyLineItem);
            updateState(currencyLineItem);
        }
    });
}

var findAndUpdateState = function(currencyLineItem) {
    chrome.storage.sync.get(['sCurrencyCoverterState'], function(result) {
        if (!(result && result.sCurrencyCoverterState && result.sCurrencyCoverterState.length > 0)) {
            return;
        }
        
        for (var i in result.sCurrencyCoverterState) {
            if(result.sCurrencyCoverterState[i].id == currencyLineItem.id) {
                result.sCurrencyCoverterState[i].fromCurrency = currencyLineItem.fromCurrency;
                result.sCurrencyCoverterState[i].toCurrency = currencyLineItem.toCurrency;
                break;
            }
        }
        
        chrome.storage.sync.set({ sCurrencyCoverterState: result.sCurrencyCoverterState});
    });
}

var updateState = function(currencyLineItem) {
    chrome.storage.sync.get(['sCurrencyCoverterState'], function(result) {
        if (!(result && result.sCurrencyCoverterState && result.sCurrencyCoverterState.length > 0)) {
            result.sCurrencyCoverterState = [];
        }
        result.sCurrencyCoverterState.push(currencyLineItem);
        chrome.storage.sync.set({ sCurrencyCoverterState: result.sCurrencyCoverterState});
    });
}

var addCurrencyLineItem = function(currencyLineItem, updateConversionResult) {
    let templateCode = $('#template div').clone();
    templateCode.attr('id', currencyLineItem.id);
    templateCode.find('select[id="from-currency-{}"]')
        .attr('id', 'from-currency-' + currencyLineItem.id)
        .val(currencyLineItem.fromCurrency);
    templateCode.find('select[id="to-currency-{}"]')
        .attr('id', 'to-currency-' + currencyLineItem.id)
        .val(currencyLineItem.toCurrency);
    templateCode.find('span[id="result-{}"]')
        .attr('id', 'result-' + currencyLineItem.id);
    templateCode.appendTo('#currency-conversion-items');

    if(updateConversionResult && (currencyLineItem.fromCurrency != currencyLineItem.toCurrency)) {
        let currencyQuery = currencyLineItem.fromCurrency + '_' + currencyLineItem.toCurrency;
        let updateTarget = $('#result-' + currencyLineItem.id);
        console.log('update value for...', updateTarget, currencyLineItem.id);
        fetchAndUpdateConversion(currencyQuery, updateTarget);
    }
}

var fetchAndUpdateConversion = function(currencyQuery, updateTarget) {
    axios.get('https://free.currencyconverterapi.com/api/v5/convert?q=' + currencyQuery + '&compact=ultra')
    .then(function (response) {
        console.log(response.data);
        $(updateTarget).text(response.data[currencyQuery].toFixed(2).toString());
    }).catch(function (error) {
        console.log(error);
    });
}