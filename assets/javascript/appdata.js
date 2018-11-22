var $categoryButtons=$('#categoryButtons');

var $allBtn=$("<button>");
$allBtn.addClass("categoryButtons");
$allBtn.attr('value','ALL');
$allBtn.text('All');
$categoryButtons.append($allBtn);

var $cpsBtn=$("<button>");
$cpsBtn.addClass("categoryButtons");
$cpsBtn.attr('value','CPS');
$cpsBtn.text('Consumer Products');
$categoryButtons.append($cpsBtn);

var $foodBtn=$("<button>");
$foodBtn.addClass("categoryButtons");
$foodBtn.attr('value','FOOD');
$foodBtn.text('Food');
$categoryButtons.append($foodBtn);

var $healthBtn=$("<button>");
$healthBtn.addClass("categoryButtons");
$healthBtn.attr('value','HEALTH');
$healthBtn.text('Health Products');
$categoryButtons.append($healthBtn);

var $vehicleBtn=$("<button>");
$vehicleBtn.addClass("categoryButtons");
$vehicleBtn.attr('value','VEHICLE');
$vehicleBtn.text('Vehicle');
$categoryButtons.append($vehicleBtn);

var userCategorySelection;
$(document).on("click",".categoryButtons",function(){
    var $element = $(this);
    userCategorySelection = $element.attr('value');
    console.log(userCategorySelection);
    showRecalls(userCategorySelection);
});

function showRecalls(category){
    $("#resultsContainer").empty();

    var recallIDs=[];
    var recallDetailObjects=[];
    var baseURL = 'http://healthycanadians.gc.ca/recall-alert-rappel-avis';
    var baseURLimages = 'http://healthycanadians.gc.ca';
    var queryURL = baseURL + '/api/recent/english';
    $.ajax({
        url:queryURL,
        type:'GET',
        Accept:"application/json",
        dataType: 'json'
    }).then(function(response){
        console.log("the summary object");
        console.log(response);

        // userCategorySelection can be set to one of: ALL, CPS, FOOD, HEALTH, VEHICLE... note CPS is Consumer Goods
        for (let i=0; i<response.results[category].length; i++) {
            recallIDs[i]=response.results[category][i].recallId;
            queryURL=baseURL + '/api/'+recallIDs[i];
            $.ajax({
                url:queryURL,
                type:'GET',
                Accept:"application/json",
                dataType: 'json'
            }).then(function(detailData){

                recallDetailObjects[i]=detailData;
                console.log("recall detail object is:");
                console.log(detailData);

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

}