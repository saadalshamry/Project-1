var recallIDs=[];
var recallDetailObjects=[];
var baseURL = 'https://healthycanadians.gc.ca/recall-alert-rappel-avis';
var baseURLimages = 'https://healthycanadians.gc.ca';
var queryURL = baseURL + '/api/recent/english';
$.ajax({
    url:queryURL,
    type:'GET',
    Accept:"application/json",
    dataType: 'json'
}).then(function(response){
    for (let i=0; i<response.results.ALL.length; i++) {
        recallIDs[i]=response.results.ALL[i].recallId;
        queryURL=baseURL + '/api/'+recallIDs[i];
        $.ajax({
            url:queryURL,
            type:'GET',
            Accept:"application/json",
            dataType: 'json'
        }).then(function(detailData){

            recallDetailObjects[i]=detailData;

            var $recallContainer=$('<div>');
            $recallContainer.addClass('recallContainer');
            
            var $recallID=$('<p>');
            $recallID.html(recallDetailObjects[i].recallId);
            $recallID.addClass('recallID');
            $recallContainer.append($recallID);

            var $recallTitle=$('<p>');
            $recallTitle.html(recallDetailObjects[i].title);
            $recallTitle.addClass('recallTitle');
            $recallContainer.append($recallTitle);
           
            for(let j=0;j<recallDetailObjects[i].panels.length;j++){
                var $panelContainer=$('<div>');
                $panelContainer.addClass('panelContainer');

                if(recallDetailObjects[i].panels[j].panelName==='images'){
                    var $imageContainer=$('<div>')
                    $imageContainer.addClass('imageContainer');
                    for(let k=0;k<recallDetailObjects[i].panels[j].data.length;k++){

                        var fullUrl=baseURLimages+recallDetailObjects[i].panels[j].data[k].fullUrl;
                        var $image=$('<img>');
                        $image.addClass('image');
                        $image.attr('src',fullUrl);
                        $imageContainer.append($image);

                        var $imageTitle=$('<p>');
                        $imageTitle.html(recallDetailObjects[i].panels[j].data[k].title);
                        $imageTitle.addClass('imageTitle');
                        $imageContainer.append($imageTitle);
                    
                    }
                    $panelContainer.append($imageContainer);

                }else{

                    var $panelName=$('<p>');
                    $panelName.addClass('panelName');
                    $panelName.html(recallDetailObjects[i].panels[j].panelName);
                    $panelContainer.append($panelName);

                    var $panelTitle=$('<p>');
                    $panelTitle.addClass('panelTitle');
                    $panelTitle.html(recallDetailObjects[i].panels[j].title);
                    $panelContainer.append($panelTitle);

                    var $panelText=$('<p>');
                    $panelText.addClass('panelText');
                    $panelText.html(recallDetailObjects[i].panels[j].text);
                    $panelContainer.append($panelText);

                }
                $recallContainer.append($panelContainer);
            }
            
            $('#resultsContainer').append($recallContainer);

        });
       }
    });