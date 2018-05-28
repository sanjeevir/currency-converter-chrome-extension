$(document).ready(function() {
    var currenciesListElement = document.getElementsByClassName('currencies-list');
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

    /* $('#from-currency, #to-currency').change(function(){
        if ($('#from-currency').val() != $('#to-currency').val()) {
            var currencyQuery = $('#from-currency').val() + '_' + $('#to-currency').val();
            axios.get('https://free.currencyconverterapi.com/api/v5/convert?q=' + currencyQuery + '&compact=ultra')
            .then(function (response) {
                console.log(response.data);
                $('#result').text(parseFloat(response.data[currencyQuery]).toFixed(2));
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            $('#result').text("1");
        }
    }); */

    $('body').on('change', 'select.currencies-list', function(event){
        $(event.target).parent('div').find('.result').text('...');
        var currencyQuery = '';
        if(event.target.id.indexOf('from-currency-') > -1) {
            var anotherCurrency = $(this).parent('div').find('#to-currency-' + event.target.id.split('-')[2]);
            currencyQuery = $(this).val() + '_' + $(anotherCurrency).val();
        } else {
            var anotherCurrency = $(this).parent('div').find('#from-currency-' + event.target.id.split('-')[2]);
            currencyQuery = $(anotherCurrency).val() + '_' + $(this).val();
        }
        console.log(currencyQuery);

        axios.get('https://free.currencyconverterapi.com/api/v5/convert?q=' + currencyQuery + '&compact=ultra')
        .then(function (response) {
            console.log(response.data);
            $(event.target).parent('div').find('.result').text(response.data[currencyQuery].toFixed(2).toString());
        }).catch(function (error) {
            console.log(error);
        });
    });

    $('#new-item').click(function() {
        var templateCode = $('#template div').clone();
        templateCode.find('select[id="from-currency-{}"]').attr('id', 'from-currency-' + $('#default-item div').length);
        templateCode.find('select[id="to-currency-{}"]').attr('id', 'to-currency-' + $('#default-item div').length);
        templateCode.find('span[id="result-{}"]').attr('id', 'result-' + $('#default-item div').length);
        templateCode.appendTo('#default-item');
    });

    $('body').on('click', 'img.remove-item', function(event) {
        $(event.target).parent('div').remove();
    });
});

var backgroundPage = chrome.extension.getBackgroundPage();
backgroundPage.UpdateBadge();