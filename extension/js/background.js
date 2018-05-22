chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "gray" });

let BGCOLORS = [
    'blue',
    'green',
    'red',
    'gray',
    'black'
];

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function UpdateBadge() {
    axios.get('https://free.currencyconverterapi.com/api/v5/convert?q=AUD_INR&compact=ultra')
    .then(function (response) {
        console.log(response);
        chrome.browserAction.setBadgeText({ 'text': round(response.data.AUD_INR, 2).toString()});
    }).catch(function (error) {
        console.log(error);
    });
}

chrome.browserAction.onClicked.addListener(function(tab) { 
    console.log(Math.floor(Math.random() * (5 - 0)));
    let color = BGCOLORS[Math.floor((Math.random() * (5 - 0)))];
    chrome.browserAction.setBadgeBackgroundColor({ 'color': color });
    UpdateBadge();
});

setInterval(UpdateBadge, 30 * 60 * 1000);

UpdateBadge();