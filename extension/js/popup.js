$(document).ready(function() {
    var currenciesListElement = document.getElementsByClassName('currencies-list');
    for(var j = 0; j < currenciesListElement.length; j++) {
        for(var i = 0; i < CURRENCIES.length; i++) {
            var thisCurrency = document.createElement('option');
            thisCurrency.value = CURRENCIES[i];
            thisCurrency.innerText = CURRENCIES[i];
            currenciesListElement[j].append(thisCurrency);
        }
    }

    $('#from-currency, #to-currency').change(function(){
        if ($('#from-currency').val() != $('#to-currency').val()) {
            var currencyQuery = $('#from-currency').val() + '_' + $('#to-currency').val();
            axios.get('https://free.currencyconverterapi.com/api/v5/convert?q=' + currencyQuery + '&compact=ultra')
            .then(function (response) {
                console.log(response.data);
                $('#result').text(response.data[currencyQuery]);
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            $('#result').text("1");
        }
    })
});