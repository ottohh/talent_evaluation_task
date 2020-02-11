

$("main").hide();

function has_image(Data){
    if(Data.images[0]==undefined||Data.images[0].url==undefined)return false;

    return true;
}


//Renderöidään data 
function render_events(render_count,render_start_index){
    
    var element_num =0;
    for(var i=render_start_index;i<render_start_index+4;i++){
        
        // Jos kyseiset tapahtumat pitää vielä renderöidä ne renderöidään, jos ei myöhempien tapahtumien kentät renderöidään näkymättömiksi.
        
        if(element_num<render_count){
            
            var lan = get_language(events_data[i]);
            console.log(i+" nimi:"+events_data[i].name[lan]);
            
            //asetetaan onclick handleri ja tapahtuman tiedot, tapahtumaa clikatessa pääsee katsomaan lisätietoja.
            event_sections[element_num].setAttribute("onclick","document.location.href='index.php/lisatiedot/?id="+events_data[i].id+"'");
            image_title_fields[element_num].innerText =events_data[i].name[lan];
            image_short_desc_fields[element_num].innerHTML=events_data[i].short_description[lan];
            document.images[element_num].src = "wp-content/plugins/elementor/assets/images/placeholder.png";

            if(has_image(events_data[i]))document.images[element_num].src = events_data[i].images[0].url;

            element_num++;
            continue;


        }
        
        
        
        //tapahtumat on loppu events_data muuttujasta, joten asetetaan loput kentistä tyhjiksi.
        image_title_fields[element_num].innerText ="";
        image_short_desc_fields[element_num].innerHTML="";
        document.images[element_num].src = "";

        element_num++;
        
    }
}


function link_click(clicked_link,render_start_index,render_count){

    //vaihdetaan linkkien värejä
    $("#current_page").css("color","rgb(226, 38, 88)");
    $("#current_page").attr("id","as");
    clicked_link.style.color="black";
    clicked_link.setAttribute("id","current_page");

    //renderöidään tapahtumat parametrien perusteella esim events_data[4] => 
    render_events(render_count,render_start_index);

}


function create_navigation_menu()
{   
    
    var link_count = Math.floor(events_data.length/4);
    console.log("Link count :"+link_count);

    var last_page_event_count = events_data.length%4;
    console.log("last_page_event_count :"+last_page_event_count);
    for(var i =0;i<link_count;i++){

        if(i==link_count){
            

            if(last_page_event_count!=0){
                $("#navigation").append(`<a 
                onclick="link_click(this,${i*4},${last_page_event_count})"
                class='post-page-numbers'><span class='page-number'>${i+1}</span></a>`);
            }

            
            break;


        }
        
        $("#navigation").append(`<a 
        onclick="link_click(this,${i*4},4)"
        class='post-page-numbers'><span class='page-number'>${i+1}</span></a>`);
        

    }

    
    document.querySelectorAll("#navigation a span")[navigation_menu_current_page_index].style.color="black";
    document.querySelectorAll("#navigation a span")[navigation_menu_current_page_index].id="current_page";
   

}


//Kysely apiin
function get_data_from_api(api_address){
    

    $.get(api_address,(Data,status)=>{
        console.log("data reveived---------")
        console.log(Data);
        
        


        /*Poistetaan dublikaatiot tapahtuman nimen perusteella.
        Oli pakko tehä ku jostai syystä niitä saman nimisiä ja samoilla tiedoilla olevia tapahtumia oli nii paljo.
        */
        for(var i=0;i<Data.data.length;i++)
        {  
            // kentän rakenne on muotoa Data.data[i].name.fi, Data.data[i].name.sv tai Data.data[i].name.en 
            var lan = get_language(Data.data[i]);
            var event_name = Data.data[i].name[lan];
            
            //Jos nimi löytyy jo listasta skipataan jos ei lisätään nimi listaan.
            if( undefined!=event_names.find((DuplicatedName)=>DuplicatedName==event_name))continue;
            
            event_names.push(event_name);
            events_data.push(Data.data[i]);
            
            
        }   
        

        //Luodaan nav valikko ja siihen edellinen sivu linkki jos on sellainen meta.previous kentästä löytyy.
        $("#navigation").html("<span class='label'>Sivut:</span>");
        if(Data.meta.previous!=null){
            api_address_previous=Data.meta.previous;
            $("#navigation").append(`<a 
            onclick="previous_page();"
            class='post-page-numbers'><span class='page-number'><<</span></a>`);
            navigation_menu_current_page_index=1;

        }
       
        
        
        
        console.log(event_names);
        console.log(events_data);
        console.log(api_address);
        console.log("--------------------------------------------")
        console.log("Vastauksen pituus:"+Data.data.length+" toistamattomien pituus:"+events_data.length);
        
        // Jos tapahtumia ei ole yli neljää voidaan suoraan renderöidä kaikki.
        if(events_data.length<=4){
            render_events(events_data.length,0);
            

        }else {
            render_events(4,0);
        }

        //Jos tuloksia ei ole.
        if(Data.data.length==0)image_title_fields[0].innerText = "Ei tuloksia.";

        
        create_navigation_menu();

        //Luodaan seuraava linkki.
        if(Data.meta.next!=null){
            api_address_next=Data.meta.next;
            $("#navigation").append(`<a 
            onclick="next_page();"
            class='post-page-numbers'><span class='page-number'>>></span></a>`);

        }
    
        
        
        
        
        
    });
    

}


function previous_page(){
    
    document.location.href="?api="+escape(api_address_previous);


}
function next_page(){
    document.location.href="?api="+escape(api_address_next);

}



function form_submit(){
    document.location.href="?api="+escape("https://api.hel.fi/linkedevents/v1/search/?type=event&q="+document.getElementById("q").value+"&start=today&language=fi");
    
    return false;
}


function get_language(Event){
    for(language in Event.name){
        return language;

    }

}



// Taulukko tapahtumien tieto objekteista joista filtteröiti pois dublikaatiot
var events_data = [];
var event_names = [];
var navigation_menu_current_page_index=0;



var image_title_fields =document.querySelectorAll(".elementor-image-box-title");
var image_short_desc_fields = document.querySelectorAll(".elementor-image-box-description");
var event_sections = document.querySelectorAll("section");


var api_address_next = "";
var api_address_previous ="";
//Entry point


get_data_from_api(api_address);


setTimeout(function(){ 

        $("main").show();
$(".loader-wrapper").fadeOut("slow");
    }, 100);



