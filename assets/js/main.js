$(document).ready(function () {

    //neils code
    var translatedText;
    var translate = false;
    var translateLanguageTo = "";
    var categoriesSelected = [];
    var languagesSelected = [];
    var userCategorySelection;

    //Chris' key
     var apiKey = "trnsl.1.1.20181120T185250Z.245d06bd93fae3b3.650dd5c0e49e6bd5f17ac6a446ae8362c5a2da91";
   
    //Neil's key
    //var apiKey = "trnsl.1.1.20181122T172352Z.219e66ea794b47a7.d38015ba75421c81cf9125e4e9371fa1fb2f8872";
   
    //Saad's key
    //var apiKey = "trnsl.1.1.20181124T154353Z.d8b12291d0f255b3.5ea00312fe96342f5c893312480068d8d123baac";
     
    var getLanguagesDefaultLanguage = 'en';

    getSupportedLanguagesYandex();

    
    getLocalStorageCategories();
    getLocalStorageLanguages();

    if (categoriesSelected[0] !== null && languagesSelected[0] !== null){
      
        runProgram();
    }

    
    
    /*Gets the key localCategoriesSelected from local storage if it exists.
    The value is an array of categories selected by the user based on the value of the category buttons.
    */
    function getLocalStorageCategories(){

        //Using JSON.parse to get the "string" from local storage back as an array.
        var categoriesSelectedLocalStorage = JSON.parse(localStorage.getItem("localCategoriesSelected"));
       
        if (categoriesSelectedLocalStorage !== null){
    
            for (i=0; i< categoriesSelectedLocalStorage.length;i++){

               // if (categoriesSelected.indexOf(categoriesSelectedLocalStorage[i]) === -1){
                    categoriesSelected[0] = categoriesSelectedLocalStorage[i];
                    userCategorySelection = categoriesSelected[0];
              //  }
                    
                setButtonStatus(categoriesSelectedLocalStorage[i]);
            }
        }
       

    }


  /*Gets the key localLanguagesSelected from local storage if it exists.
    The value is an array of languages selected by the user based on the value of the language drop down.
    */
   function getLocalStorageLanguages(){

    //Using JSON.parse to get the "string" from local storage back as an array.
    var languagesSelectedLocalStorage = JSON.parse(localStorage.getItem("localLanguagesSelected"));
   
    if (languagesSelectedLocalStorage !== null ){

        for (i=0; i< languagesSelectedLocalStorage.length;i++){

          //  if (languagesSelected.indexOf(languagesSelectedLocalStorage[i]) === -1){
                languagesSelected[0] = languagesSelectedLocalStorage[i];
                translateLanguageTo = languagesSelected[0];
          //  }

            
            setLanguagesSelected(languagesSelectedLocalStorage[i]);
        }
    }
   

}










    /*This function will set the "Active" status of the button.
    A button is "Active" when it has the "active" class added to it. 
    This will make the button show in a solid red. */
    function setButtonStatus(selectedButtonValue){

        if (selectedButtonValue === "ALL"){
            $('.btn-all').addClass("active");
        }
        else
        {
            $('.btn-all').removeClass("active");
        }

        if (selectedButtonValue === "CPS"){
            $('.btn-cps').addClass("active");
         }
         else
         {
             $('.btn-cps').removeClass("active");
         }


         if (selectedButtonValue === "FOOD"){
            $('.btn-food').addClass("active");
         }
         else
         {
             $('.btn-food').removeClass("active");
         }

       if (selectedButtonValue === "HEALTH"){
            $('.btn-health').addClass("active");
         }
         else
         {
             $('.btn-health').removeClass("active");
         }

         if (selectedButtonValue === "VEHICLE"){
            $('.btn-vehicle').addClass("active");
         }
         else
         {
             $('.btn-vehicle').removeClass("active");
         }


    }

   
        /*Will set the local storage key localCategoriesSelected to the array of category
        selections made by the user*/
        function setLocalStorageCategories(userCategorySelection){
            var categoriesSelectedLocalStorage = localStorage.getItem("localCategoriesSelected");


        /*If the local storage key localCategoriesSelected does not exist - OR - the key does exist but
        the category selected by the user does not exist in the array returned*/
        
          if   (categoriesSelectedLocalStorage === null || categoriesSelected.indexOf(userCategorySelection) === -1){
                //Add the user's category selection to the categoriesSelected array.

                //For now we are just using the 0 index of the array i.e. One category is stored. 
                categoriesSelected[0]= userCategorySelection;

                //Set the button status 
                setButtonStatus(categoriesSelected[0]);

                //If in the future we want to have multiple categories selected.
                //categoriesSelected.push(userCategorySelection);

                //Add the categoriesSelected array to local storage.
               localStorage.setItem("localCategoriesSelected", JSON.stringify(categoriesSelected));
          }

        }




        function setLanguagesSelected(selectedLanguageValue){

            $('#language option:selected').removeAttr('selected');
            $('#language').val(selectedLanguageValue).attr("selected", "selected");

        }
  



         /*Will set the local storage key localLanguagesSelected to the array of category
        selections made by the user*/
        function setLocalStorageLanguages(translateLanguageTo){
            var languagesSelectedLocalStorage = localStorage.getItem("localLanguagesSelected");

        /*If the local storage key localLanguagesSelected does not exist - OR - the key does exist but
        the language selected by the user does not exist in the array returned*/
          if   (languagesSelectedLocalStorage === null || languagesSelected.indexOf(translateLanguageTo) === -1){
                //Add the user's language selection to the languagesSelected array.

                //For now we are just using the 0 index of the array i.e. One language is stored. 
                languagesSelected[0]= translateLanguageTo;

                //Set the drop down status 
                setLanguagesSelected(languagesSelected[0]);

                //If in the future we want to have multiple languages selected.
                //languagesSelected.push(userLanguagesSelection);

                //Add the languagesSelected array to local storage.
               localStorage.setItem("localLanguagesSelected", JSON.stringify(languagesSelected));
          }

        }
        
        getLocalStorageCategories();
        

    
    $(document).on("click", ".categoryButtons", function () {
        var $element = $(this);
        userCategorySelection = $element.attr('value');
        
        /*The selected language option from the Language drop down. 
        The .val() method is used to return the value assigned to the option.
        The value assigned to the option would the language code i.e. "en" for "English"
        if you wanted the language name, you could use .text().*/
        translateLanguageTo = $("#language option:selected" ).val();

        setLocalStorageCategories(userCategorySelection);

        setLocalStorageLanguages(translateLanguageTo);

        runProgram();
        
    });



    function runProgram(){




        /*Only translate if the language is NOT English (any other language other than English)
        The source language (language from) will always be English for this project.
        If the language selected is NOT English, set the translate variable to true.*/
        if (translateLanguageTo !== "en") {
            translate = true
        }
            
        showRecalls(userCategorySelection);

    }



    

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
            ////console.log("the summary object");
            ////console.log(response);

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
                    ////console.log("recall detail object is:");
                    ////console.log(detailData);

                    var $recallContainer = $('<div>');
                    $recallContainer.addClass('recallContainer');

                    var $recallID = $('<p>');
                    $recallID.html(recallDetailObjects[i].recallId);
                    $recallID.addClass('recallID');
                    $recallContainer.append($recallID);

                    var $recallTitle = $('<p>');
                    if (translate) {
                       // translateTextYandex(recallDetailObjects[i].title, "en", translateLanguageTo, "plain","recallTitle", $recallTitle, $recallContainer);
                    //console.log("title");
                       translateTextYandex(recallDetailObjects[i].title, "en", translateLanguageTo, "plain",function renderDivs (translatedText){

                        $recallID.text(translatedText);
                        $recallID.addClass('recallID');
                        $recallContainer.append($recallID);
                        });
                        
                        // $recallTitle.html(translatedText);
                    } else {
                        $recallTitle.html(recallDetailObjects[i].title);
                        $recallTitle.addClass('recallTitle');
                        $recallContainer.append($recallTitle);
                    }
                    

                    for (let j = 0; j < recallDetailObjects[i].panels.length; j++) {

                        var $panelContainer = $('<div>');
                        $panelContainer.addClass('panelContainer');

                        if (recallDetailObjects[i].panels[j].panelName === 'images') {
                            var $imageContainer = $('<div>')
                            $imageContainer.addClass('imageContainer');
                            for (let k = 0; k < recallDetailObjects[i].panels[j].data.length; k++) {

                                
                               

                                if (translate) {
                                   // translateTextYandex(recallDetailObjects[i].panels[j].data[k].title, "en", translateLanguageTo, "plain", 'imageTitle', $imageTitle, $imageContainer, $panelContainer);
                                  
                                   translateTextYandex(recallDetailObjects[i].panels[j].data[k].title, "en", translateLanguageTo, "plain",function renderDivs (translatedText){
                                    var fullUrl = baseURLimages + recallDetailObjects[i].panels[j].data[k].fullUrl;
                                    var $image = $('<img>');
                                    $image.addClass('image');
                                    $image.attr('src', fullUrl);
                                    $imageContainer.append($image);
                                    $panelContainer.append($imageContainer);
                                    $recallContainer.append($panelContainer);
    
                                    var $imageTitle = $('<p>');
                                    $imageTitle.addClass('imageTitle');
                                    $imageTitle.text(translatedText);
                                    $imageContainer.append($imageTitle);
                                    });
                                    
                                   
                                   
                                   
                                   
                                   
                                   // $imageTitle.html(translatedText);
                                } else {
                                    var fullUrl = baseURLimages + recallDetailObjects[i].panels[j].data[k].fullUrl;
                                    var $image = $('<img>');
                                    $image.addClass('image');
                                    $image.attr('src', fullUrl);
                                    $imageContainer.append($image);
                                    $panelContainer.append($imageContainer);
                                    $recallContainer.append($panelContainer);


                                    $imageTitle.html(recallDetailObjects[i].panels[j].data[k].title);
                                    $imageTitle.addClass('imageTitle');
                                    $imageContainer.append($imageTitle);
                                }

                                

                            }

                        } else {

                            var $panelTitle = $('<p>');
                            $panelTitle.addClass('panelTitle');
                            if (translate) {
                                //console.log("panel title");
                                //translateTextYandex(recallDetailObjects[i].panels[j].title, "en", translateLanguageTo, "plain", '',  $panelTitle, $panelContainer, "");
                                translateTextYandex(recallDetailObjects[i].panels[j].title, "en", translateLanguageTo, "plain", function renderDivs (translatedText){
                                   
                                $panelTitle.text(translatedText);
                                $panelContainer.append($panelTitle);
                                });
                                
                                
                                
                                // $panelTitle.html(translatedText);
                            } else {
                                $panelTitle.html(recallDetailObjects[i].panels[j].title);
                                $panelContainer.append($panelTitle);
                            }
                           

                            var $panelText = $('<p>');
                            $panelText.addClass('panelText');
                            if (translate) {
                                //console.log("panel text");
                               // translateTextYandex(recallDetailObjects[i].panels[j].text, "en", translateLanguageTo, "plain", '', $panelText, $panelContainer, $recallContainer);
                                
                               translateTextYandex(recallDetailObjects[i].panels[j].text, "en", translateLanguageTo, "plain",  function renderDivs (translatedText){

                                $panelText.text(translatedText);
                                $panelContainer.append($panelText);
                                $recallContainer.append($panelContainer);
                                });
                                
                               
                               //$panelText.html(translatedText);
                            } else {
                                $panelText.html(recallDetailObjects[i].panels[j].text);
                                 $panelContainer.append($panelText);
                            }
                            

                        }

                        if (translate===false) {
                             $recallContainer.append($panelContainer);
                        }
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


    var queryURL = "https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=" + apiKey + "&ui=" + getLanguagesDefaultLanguage;

    $.ajax({
      url: queryURL,
      method: "GET"
      }).then(function (response) {
          
      /*This will return an array of supported languages.  
      The entries variables will look like the following array
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
        if (entries===null){
            var option=$('<option>');
            //This will be the language code i.e. 'en'
            option.val('en');  
            //This will be the language name i.e. 'English'
            option.text('English');
            $('#language').append(option);   
        }
    
    entries.sort(function(arr1, arr2) {
        return arr1[1].charCodeAt(0) - arr2[1].charCodeAt(0);
      });


        //For each array element get the next array
      entries.forEach(function (lang) {

          var option=$('<option>');
          //This will be the language code i.e. 'en'
          option.val(lang[0]);  
          //This will be the language name i.e. 'English'
          option.text(lang[1]);
          $('#language').append(option);

        });

        getLocalStorageLanguages();

        }); //End of Then
    }

    /* 
    This function will use the Yandex (free) API to translate the text passed to it
    // *********************************************
    // This function accepts the following arguments
    textToTranslate: This is the source text to translate
    languageFrom: This is the source langauge.  For this project the source language will always be "en" (English).
    languageTo: This is the language that should be displayed to the user based on the user's language selection.
    format: This will be either "html" or "plain" depending on the text format required in the repsonse.  For this project we will always use "plain".
    divClass: This is the class to assign the divName (the div that will be created).
    divName: The div that will be created.  This div will contain the translated text.
    divContainer: A div container to hold the divName.
    divContainer2: A div container (an addional div container) to hold the previous div container. i.e. a conainer within a container
    // *********************************************
    */
    function translateTextYandex(textToTranslate, languageFrom, languageTo, format, renderDivs ) {
        


        //The Yandex queryURL string
        var queryURL = "https://translate.yandex.net/api/v1.5/tr.json/translate";

        /* This is to test Angelo's recommendation to force "clean" text without any HTML.
        Angelo recommended to create a temp div, assign it the text to translate 
        (which could contain HTML), then read the text back.  When the 
        textToTranslate is passed to the div i.e. tempDiv.text(textToTranslate), 
        any HTML is parsed out. */
        var tempDiv = $("<div>");
        tempDiv.html(textToTranslate); //<-- I'm not sure if this should be .html or .text.  Still have to test.
        textToTranslate = tempDiv.text();
        
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                key: apiKey,
                lang: languageFrom + "-" + languageTo,
                format: format,
                text: textToTranslate.substr(0, 8000)
            }
        }).then(function (response){
            //console.log("in translated text then");
            //console.log(response.text);

            renderDivs(response.text);


        });

    }


    

});