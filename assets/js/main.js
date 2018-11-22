$(document).ready(function () {

    //neils code
    var translatedText;
    var translate = false;

    var $categoryButtons = $('#categoryButtons');



    var userCategorySelection;
    $(document).on("click", ".categoryButtons", function () {
        var $element = $(this);
        userCategorySelection = $element.attr('value');
        console.log(userCategorySelection);
        showRecalls(userCategorySelection);
    });

    function showRecalls(category) {
        $("#resultsContainer").empty();

        var recallIDs = [];
        var recallDetailObjects = [];
        var baseURL = 'https://healthycanadians.gc.ca/recall-alert-rappel-avis';
        var baseURLimages = 'https://healthycanadians.gc.ca';
        var queryURL = baseURL + '/api/recent/english';
        $.ajax({
            url: queryURL,
            type: 'GET',
            Accept: "application/json",
            dataType: 'json'
        }).then(function (response) {
            console.log("the summary object");
            console.log(response);

            // userCategorySelection can be set to one of: ALL, CPS, FOOD, HEALTH, VEHICLE... note CPS is Consumer Goods
            for (let i = 0; i < response.results[category].length; i++) {
                recallIDs[i] = response.results[category][i].recallId;
                queryURL = baseURL + '/api/' + recallIDs[i];
                $.ajax({
                    url: queryURL,
                    type: 'GET',
                    Accept: "application/json",
                    dataType: 'json'
                }).then(function (detailData) {

                    recallDetailObjects[i] = detailData;
                    console.log("recall detail object is:");
                    console.log(detailData);

                    var $recallContainer = $('<div>');
                    $recallContainer.addClass('recallContainer');

                    var $recallID = $('<p>');
                    $recallID.html(recallDetailObjects[i].recallId);
                    $recallID.addClass('recallID');
                    $recallContainer.append($recallID);

                    var $recallTitle = $('<p>');
                    if (translate) {
                        translatedText = translateTextYandex(recallDetailObjects[i].title, "en", "ru", "Plain");
                        $recallTitle.html(translatedText);
                    } else {
                        $recallTitle.html(recallDetailObjects[i].title, "en", "ru", "Plain");
                    }
                    $recallTitle.addClass('recallTitle');
                    $recallContainer.append($recallTitle);

                    for (let j = 0; j < recallDetailObjects[i].panels.length; j++) {
                        var $panelContainer = $('<div>');
                        $panelContainer.addClass('panelContainer');

                        if (recallDetailObjects[i].panels[j].panelName === 'images') {
                            var $imageContainer = $('<div>')
                            $imageContainer.addClass('imageContainer');
                            for (let k = 0; k < recallDetailObjects[i].panels[j].data.length; k++) {

                                var fullUrl = baseURLimages + recallDetailObjects[i].panels[j].data[k].fullUrl;
                                var $image = $('<img>');
                                $image.addClass('image');
                                $image.attr('src', fullUrl);
                                $imageContainer.append($image);

                                var $imageTitle = $('<p>');
                                if (translate) {
                                    translatedText = translateTextYandex(recallDetailObjects[i].panels[j].data[k].title, "en", "ru", "Plain");
                                    $imageTitle.html(translatedText);
                                } else {
                                    $imageTitle.html(recallDetailObjects[i].panels[j].data[k].title, "en", "ru", "Plain");
                                }

                                $imageTitle.addClass('imageTitle');
                                $imageContainer.append($imageTitle);

                            }
                            $panelContainer.append($imageContainer);

                        } else {
                            // don't need to show panelName to user
                            /*    var $panelName=$('<p>');
                                $panelName.addClass('panelName');
                                $panelName.html(recallDetailObjects[i].panels[j].panelName);
                                $panelContainer.append($panelName);
                            */
                            var $panelTitle = $('<p>');
                            $panelTitle.addClass('panelTitle');
                            if (translate) {
                                translatedText = translateTextYandex(recallDetailObjects[i].panels[j].title, "en", "ru", "Plain");
                                $panelTitle.html(translatedText);
                            } else {
                                $panelTitle.html(recallDetailObjects[i].panels[j].title, "en", "ru", "Plain");
                            }
                            $panelContainer.append($panelTitle);

                            var $panelText = $('<p>');
                            $panelText.addClass('panelText');
                            if (translate) {
                                translatedText = translateTextYandex(recallDetailObjects[i].panels[j].text, "en", "ru", "Plain");
                                $panelText.html(translatedText);
                            } else {
                                $panelText.html(recallDetailObjects[i].panels[j].text, "en", "ru", "Plain");
                            }
                            $panelContainer.append($panelText);

                        }
                        $recallContainer.append($panelContainer);
                    }

                    $('#resultsContainer').append($recallContainer);

                });
            }
        });

    }

    //Source: http://healthycanadians.gc.ca/connect-connectez/data-donnees/recall-alert-rappel-avis-eng.php?wbdisable=true
    //var queryURLRecentRecalsSummary = "http://healthycanadians.gc.ca/recall-alert-rappel-avis/api/recent/en"
    //   var queryURLRecentRecalsDetails = http://healthycanadians.gc.ca/recall-alert-rappel-avis/api/68318

    /*

Request Sample 
https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181120T185250Z.245d06bd93fae3b3.650dd5c0e49e6bd5f17ac6a446ae8362c5a2da91&text=%22One%20lot%20each%20of%20Option+%20Family%20Sunscreen%20Lotion%20SPF%2050+%20and%20Personnelle%20Sport%20Sunscreen%20Lotion%20SPF%2050+%20have%20been%20voluntarily%20recalled%20by%20Empack%20Spraytech%20Inc.%20because%20of%20bacterial%20contamination.\n\n%20The%20sunscreens%20were%20found%20to%20contain%20multiple%20types%20of%20bacteria:\n%3Cul%3E\n%20%3Cli%3E\n%20Lactobacillus%20brevis,%20and%3C/li%3E\n%20%3Cli%3E\n%20Either%20Micrococcus%20luteus%20%3Cstrong%3Eor%20%3C/strong%3EStaphylococcus%20hominis%20novobiosepticus%20(see%20table%20below).%3C/li%3E\n%3C/ul%3E\n\n%20Although%20Lactobacillus%20brevis%20has%20not%20been%20documented%20to%20cause%20any%20illness%20in%20humans,%20the%20other%20two%20(Micrococcus%20luteus%20or%20Staphylococcus%20hominis%20novobiosepticus)%20may%20result%20in%20infection.%20The%20risk%20may%20be%20higher%20in%20children%20and%20individuals%20with%20a%20weakened%20immune%20system.%20To%20date,%20Health%20Canada%20has%20not%20received%20any%20adverse%20reaction%20reports%20involving%20the%20recalled%20sunscreens.%22&lang=en-ru
       
Yandex API language translator documentation
https://tech.yandex.com/translate/doc/dg/reference/translate-docpage/

JSON and JSONP interfaces
The response is returned in JSON format. If the callback parameter is set, the JSON object is wrapped in a function with the name specified in this parameter (JSONP).

Request syntax
https://translate.yandex.net/api/v1.5/tr.json/translate
 ? key=<API key>
 & text=<text to translate>
 & lang=<translation direction>
 & [format=<text format>]
 & [options=<translation options>]
 & [callback=<name of the callback function>]
Query parameters	

key *	
API key. It is issued free of charge.

text *	
The text to translate.

You can use multiple text parameters in a request.

Attention.
The source text must be URL-encoded.

Restrictions:

For POST requests, the maximum size of the text being passed is 10,000 characters.
In GET requests, the restriction applies not to the text itself, but to the size of the entire request string, which can contain other parameters besides the text.

The maximum size of the string is from 2 to 10 KB (depending on the browser version).

lang *	
The translation direction.

You can set it in either of the following ways:

As a pair of language codes separated by a hyphen (“from”-“to”). For example, en-ru indicates translating from English to Russian.
As the target language code (for example, ru). In this case, the service tries to detect the source language automatically.
format	
Text format.

Possible values:

plain - Text without markup (default value).
html - Text in HTML format.
options	
The only option available at this time is whether the response should include the automatically detected language of the text being translated. This corresponds to the value 1 for this parameter.

If the language of the text being translated is defined explicitly, meaning the lang parameter is set as a pair of codes, the first code defines the source language. This means that the options parameter does not allow switching to automatic language detection. However, it does allow you to understand whether the source language was defined correctly in the lang parameter.

callback	The name of the callback function. Use for getting a JSONP response.
*  Required

Note. All special characters must be escaped. 



Yandex API language translator documentation for getting supported languages
https://tech.yandex.com/translate/doc/dg/reference/getLangs-docpage/

Response example
https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1.20181120T185250Z.245d06bd93fae3b3.650dd5c0e49e6bd5f17ac6a446ae8362c5a2da91&ui=en
       

JSON and JSONP interfaces
The response is returned in JSON format. If the callback parameter is set, the JSON object is wrapped in a function with the name specified in this parameter (JSONP).

Request syntax
https://translate.yandex.net/api/v1.5/tr.json/getLangs
 ? key=<API key>
 & [ui=<language code>]
 & [callback=<name of the callback function>]
Query parameters	
key *	
API key. It is issued free of charge.

ui	
Required parameter.

In the response, supported languages are listed in the langs field with the definitions of the language codes. Language names are output in the language corresponding to the code in this parameter.

All the language codes are shown in the list of supported languages.

callback	The name of the callback function. Use for getting a JSONP response.





 
 */

function getSupportedLanguagesYandex(){

    var queryURL = "https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1.20181120T185250Z.245d06bd93fae3b3.650dd5c0e49e6bd5f17ac6a446ae8362c5a2da91&ui=en";

    $.ajax({
      url: queryURL,
      method: "GET"
      }).then(function (response) {
          
      //This will return an array of supported languages.  The array will look like
      /*
      0: Array(2)
          0: "af"
          1: "Afrikaans"
          length: 2
      1: Array(2)
          0: "am"
          1: "Amharic"
          length: 2
      */
      var entries = Object.entries(response.langs)

    
    entries.sort(function(arr1, arr2) {
        return arr1[1].charCodeAt(0) - arr2[1].charCodeAt(0);
      });


            //For each array element get the 
      entries.forEach(function (lang) {
      
          console.log(lang[0],lang[1]);
          
          var option=$('<option>');
          option.val(lang[0]);
          option.text(lang[1]);
          $('#language').append(option);

        });

        

        }); //End of Then
    }

    // This function will use the Yandex (free) API to translate the text passed to it
    // *********************************************
    // !! This function returns a string.  Ensure to assign the result of the function call to a variable !! 
    // *********************************************
    function translateTextYandex(textToTranslate, languageFrom, languageTo, format) {

        //The Yandex queryURL string
        var queryURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181120T185250Z.245d06bd93fae3b3.650dd5c0e49e6bd5f17ac6a446ae8362c5a2da91";

        //Add the key "text" and pass the value as the text to translate
        queryURL = queryURL + "&text=" + textToTranslate;

        //Add the key "lang" and pass the value as the language to translate from, a dash, and the 
        //language to translate to i.e. English to Russion would be lang value of en-ru.  
        //The languageFrom will always be 'en' for this project.
        queryURL = queryURL + "&lang=" + languageFrom + "-" + languageTo;

        //Add the "format" key and pass the value as either HTML or Plain depending on the text
        //formatting required. 
        queryURL = queryURL + "&format=" + format;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            return response;

        });

    }

    //Usage examples
    //translateTextYandex ("Hello world", "en", "ru", "plain");


    //Start local storage section
    //localStorage.setItem("name", name);
    //localStorage.getItem("name", name);

    getSupportedLanguagesYandex();

});