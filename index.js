// Key = AIzaSyDJsw56Pe-TX7YOw9l2XQlREtw6zKqeeA0

let map;
const infowindow = new google.maps.InfoWindow();

const json = (() => {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "./Map-api/Waterfall.json", //Json file location
        'dataType': "json",
        'success': function(data) {
        json = data;
    }
    });
    return json;
})();


var waterfalls = json.waterfalls

function initMap() {

    var mapProp = {
        center: new google.maps.LatLng(35.591040, -81.797546), // North Carolina
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapProp);

      //  $.getJSON(json, function(json1) {


    $.each(waterfalls, function(key, data) {

        var latLng = new google.maps.LatLng(data.lat, data.lng); // Combine lat and lng for use

        // Marker showing 
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
          // icon: icon,
            title: data.title
        });
        // When Marker clicked
        //TODO (later) Make pretty
        var details = `<strong><h3>${data.title}</h3></strong> 
                        <br> Beauty Rating: <strong>${data.beauty}</strong> Photo Rating: <strong>${data.photo}</strong>
                        <br> Hike Difficulty: <strong>${data.hDifficulty}</strong> Hike Distance: <strong>${data.hDistance}</strong>
                        <br> Compass Heading: <strong>${data.compass}</strong> Elevation: <strong>${data.elevation}</strong>
                        <br> Page Number: <strong>page ${data.pageNumber}</strong> Canopy: <strong>${data.canopy}</strong>
                        `

        bindInfoWindow(marker, map, infowindow, details);
    });
}

function bindInfoWindow(marker, map, infowindow, strDescription) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(strDescription);
        infowindow.open(map, marker);
    });
}

google.maps.event.addDomListener(window, 'load', initMap);

window.onload=function(){
    function logSubmit(event) {
        let bR = document.getElementById("beautyRating_input").value
        let pR = document.getElementById("photoRating_input").value
        let hD = document.getElementById("hikeDifficulty_input").value
        let elv = document.getElementById("elevation_input").value
        let can = document.getElementById("canopy_input").value
        let hDis = document.getElementById("hikeDistance_input").value
        let comp = document.getElementById("compass_input").value

        const filteredList = array => array
            .filter(location => location.beauty >= bR)
            .filter(location => location.photo >= pR)
            .filter(location => location.hDifficulty <= hD)
            .filter(location => location.elevation <= elv)
            // .filter(location => location.canopy = can)

        const filteredListCan = array => array
            .filter(location => location.beauty >= bR)
            .filter(location => location.photo >= pR)
            .filter(location => location.hDifficulty <= hD)
            .filter(location => location.elevation <= elv)
            .filter(location => location.canopy == can)

        let finalList = []

        if (can == 'all') {
            finalList = filteredList(json.waterfalls)
        } else {
            finalList = filteredListCan(json.waterfalls)
        }

        //Hike Distance
        switch (hDis) {
            case "1":
                finalList = lessThanTenth(finalList)
                break
            case "2":
                finalList = lessThanQuarter(finalList)
                break
            case "3":
                finalList = lessThanHalf(finalList)
                break
            case "4":
                finalList = lessThanThreeQuarter(finalList)
                break
            case "5":
                finalList = lessThanOne(finalList)
                break
            case "6":
                finalList = lessThanTwo(finalList)
                break
            case "10":
                finalList = moreThanTwo(finalList)
                break
            default:
                finalList = finalList
        };

        // Compass Heading 
        switch (comp) {
            case 'N':
                finalList = N(finalList)
                break
            case 'NE':
                finalList = NE(finalList)
                break
            case 'E':
                finalList = E(finalList)
                break
            case 'SE':
                finalList = SE(finalList)
                break
            case 'S':
                finalList = S(finalList)
                break
            case 'SW':
                finalList = SW(finalList)
                break
            case 'W':
                finalList = W(finalList)
                break
            case 'NW':
                finalList = NW(finalList)
                break
            default:
                finalList = finalList
        }

        console.log(finalList)

        event.preventDefault()

        // function reloadMap() {
        //     var mapProp = {
        //         center: new google.maps.LatLng(35.591040, -81.797546), // North Carolina
        //         zoom: 7,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     };
        
        //     map = new google.maps.Map(document.getElementById("map"), mapProp);
        
        //       //  $.getJSON(json, function(json1) {
        
        
        //     $.each(filteredList(finalList), function(key, data) {
        
        //         var latLng = new google.maps.LatLng(data.lat, data.lng); // Combine lat and lng for use
        
        //         // Marker showing 
        //         var marker = new google.maps.Marker({
        //             position: latLng,
        //             map: map,
        //           // icon: icon,
        //             title: data.title
        //         });
        //         // When Marker clicked
        //         //TODO (later) Make pretty
        //         var details = ``
        
        //         bindInfoWindow(marker, map, infowindow, details);
        //     })
        // };

        waterfalls = finalList
        initMap()

    }
    const form = document.getElementById('form')
    form.addEventListener('submit', logSubmit);
}


//* For Compass Heading
const N = array => array.filter(location => location.compass >=338 || location.compass <=22)
const NE = array => array.filter(location => location.compass >=23 && location.compass <=67)
const E = array => array.filter(location => location.compass >=68 && location.compass <=112)
const SE = array => array.filter(location => location.compass >=113 && location.compass <=157)
const S = array => array.filter(location => location.compass >=158 && location.compass <=202)
const SW = array => array.filter(location => location.compass >=203 && location.compass <=247)
const W = array => array.filter(location => location.compass >=248 && location.compass <=292)
const NW = array => array.filter(location => location.compass >=293 && location.compass <=337)

//* For Hike Distance
const lessThanTenth = array => array.filter(location => location.hDistance.split(' ')[1] == "yards" || location.hDistance.split(' ')[1] == "feet" || location.hDistance.split(' ')[0] <= 0.1)
const lessThanQuarter = array => array.filter(location => location.hDistance.split(' ')[1] == "yards" || location.hDistance.split(' ')[1] == "feet" || location.hDistance.split(' ')[0] <= 0.25)
const lessThanHalf = array => array.filter(location => location.hDistance.split(' ')[1] == "yards" || location.hDistance.split(' ')[1] == "feet" || location.hDistance.split(' ')[0] <= 0.5)
const lessThanThreeQuarter = array => array.filter(location => location.hDistance.split(' ')[1] == "yards" || location.hDistance.split(' ')[1] == "feet" || location.hDistance.split(' ')[0] <= 0.75)
const lessThanOne = array => array.filter(location => location.hDistance.split(' ')[1] == "yards" || location.hDistance.split(' ')[1] == "feet" || location.hDistance.split(' ')[0] <= 1)
const lessThanTwo = array => array.filter(location => location.hDistance.split(' ')[1] == "yards" || location.hDistance.split(' ')[1] == "feet" || location.hDistance.split(' ')[0] <= 2)
const moreThanTwo = array => array.filter(location => location.hDistance.split(' ')[0] > 2.0 && location.hDistance.toLowerCase().split(' ')[1] != "yards" && location.hDistance.toLowerCase().split(' ')[1] != "feet")




//TODO 4. Make the Waterfall Names Searchable 
