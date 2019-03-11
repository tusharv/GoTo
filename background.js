// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function (text) {
        
        var newURL = getService(text);

        chrome.tabs.create({
            url: newURL
        });
    });

function getService(options){
    var params = options.toLowerCase().split(" ");
    var keyAction = params[0];
    
    if(params.length == 1 && config.hasOwnProperty(keyAction)){
        //Single Param 
        return config[keyAction].default;
    }else if(params.length == 2 && config.hasOwnProperty(keyAction)){
        //Two Params
        return (config[keyAction].search).replace("{0}",params[1]);
    }else if(params.length >= 2 && config.hasOwnProperty(keyAction)){
        //Multiple Params
        var query = params.slice(1).join(" ");
        return (config[keyAction].search).replace("{0}",encodeURIComponent(query));
    }

    //Fallback for Google
    return "https://www.google.com/search?q=" + encodeURIComponent(options);
}