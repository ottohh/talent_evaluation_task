$("main").hide();


//Gets the id from the url
const query_string = window.location.search;
const url_params = new URLSearchParams(query_string);
var event_id = url_params.get("id");

    
    
    
var api_address = "https://api.hel.fi/linkedevents/v1/event/"+event_id+"/";
  
function get_language(Event){
    for(language in Event.name){
        return language;

    }

}

function has_image(Data){
    if(Data.images[0]==undefined||Data.images[0].url==undefined)return false;

    return true;
}


$.get(api_address,(Data,status)=>{
        

    //Kuva jos löytyy
    if(has_image(Data)){
        
        $("#EventImage").attr("src",Data["images"][0].url);

    }

    var lan = get_language(Data);
        
        
    $("#EventDescription").html(Data["description"][lan]);
    $(".entry-title").html(Data["name"][lan]);
    
    //infolinkki jos löytyy
    if(Data.info_url==null){

        $("#InfoLink").hide();

    }else {
        $("#InfoLink").attr("href",Data.info_url[lan]);

    }
        
    setTimeout(function(){ 

        $("main").show();
$(".loader-wrapper").fadeOut("slow");
    }, 10);

       
    
    
    
    
    
});


