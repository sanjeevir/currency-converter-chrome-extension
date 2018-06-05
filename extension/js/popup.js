$(document).ready(function() {
    init();

    // populate currencies list in dropdowns
    let currenciesListElement = document.getElementsByClassName('currencies-list');
    for(var j = 0; j < currenciesListElement.length; j++) {
        for(var i = 0; i < CURRENCIES.length; i++) {
            var thisCurrency = document.createElement('option');
            thisCurrency.value = CURRENCIES[i];
            thisCurrency.innerText = CURRENCIES[i];
            //TODO Temp default selection. Change to read from storage.
            if(currenciesListElement[j].id == 'base-currency' && CURRENCIES[i] === 'AUD') {
                thisCurrency.selected = true;
            } else if (currenciesListElement[j].id == 'badge-target' && CURRENCIES[i] === 'INR') {
                thisCurrency.selected = true;
            }
            currenciesListElement[j].append(thisCurrency);
        }
    }

    $('body').on('change', 'select.currencies-list', function(event) {
        $(event.target).parent('div').find('.result').text('...');
        let currencyLineItem = {};
        let currencyQuery = '';
        currencyLineItem.id = event.target.id.split('-')[2];
        if(event.target.id.indexOf('from-currency-') > -1) {
            let anotherCurrency = $(this).parent('div').find('#to-currency-' + event.target.id.split('-')[2]);
            currencyQuery = $(this).val() + '_' + $(anotherCurrency).val();
            currencyLineItem.fromCurrency = $(this).val();
            currencyLineItem.toCurrency = $(anotherCurrency).val();
        } else {
            let anotherCurrency = $(this).parent('div').find('#from-currency-' + event.target.id.split('-')[2]);
            currencyQuery = $(anotherCurrency).val() + '_' + $(this).val();
            currencyLineItem.fromCurrency = $(anotherCurrency).val();
            currencyLineItem.toCurrency = $(this).val();
        }

        findAndUpdateState(currencyLineItem);

        console.log(currencyQuery);
        fetchAndUpdateConversion(currencyQuery, $(event.target).parent('div').find('.result'));
    });

    $('#new-item').click(function() {
        let currencyItemsCount = $('#currency-conversion-items div').length;
        
        let currencyLineItem = {};
        currencyLineItem.id = currencyItemsCount;
        currencyLineItem.fromCurrency = 'AED';
        currencyLineItem.toCurrency = 'AED';

        addCurrencyLineItem(currencyLineItem);
        updateState(currencyLineItem);
    });

    $('body').on('click', 'img.remove-item', function(event) {
        let thisId = $(this).parent('div').attr('id');
        chrome.storage.sync.get(['sCurrencyCoverterState'], function(result) {
            for (var i in result.sCurrencyCoverterState) {
                if(result.sCurrencyCoverterState[i].id == thisId) {
                    result.sCurrencyCoverterState.remove(i);
                    chrome.storage.sync.set({ sCurrencyCoverterState: result.sCurrencyCoverterState});
                    $(this).parent('div').remove();
                    break;
                }
            }
        });

    });

    $('#reset-items').click(function() {
        chrome.storage.sync.remove('sCurrencyCoverterState', function() {
            $('#currency-conversion-items div').remove();
        });
    })
});

var backgroundPage = chrome.extension.getBackgroundPage();
backgroundPage.UpdateBadge();