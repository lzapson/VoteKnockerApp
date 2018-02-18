
var map;
var  filterObj = {party: "", status: ""};

function initMap() {
    console.log('at maps');
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: 40.7834338, lng: -74.2162569 },
        disableDefaultUI: true
    });
   
    $.post("/api/filter", filterObj, function (data) {
        loadMap(data);

    });
}

function loadMap(data) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: 40.7834338, lng: -74.2162569 },
        disableDefaultUI: true
    });
    for (var i = 0, length = data.length; i < length; i++) {
        // console.log(data[i]);
        var results = data[i],
            latLng = new google.maps.LatLng(results.lat, results.longitude);

        // Creating a marker and putting it on the map
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        
        if (results.party === "DEM"){
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                voterId: results.voterId,
                name: results.firstName + " " + results.lastName,
                address: results.streetNum + " "+ results.streetName,
                cityZip: results.city +", " + results.state + " " + results.zipcode,
                icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                getName: function(){
                    var text = `<p class="map-marker-popup">${this.name}<br>${this.address}<br>${this.cityZip}</p><a href="../status/${this.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                    return text;
                }

            });
        } else  if (results.party === "REP"){
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                voterId: results.voterId,
                name: results.firstName + " " + results.lastName,
                address: results.streetNum + " "+ results.streetName,
                cityZip: results.city +", " + results.state + " " + results.zipcode,
                icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                getName: function(){
                    var text = `<p class="map-marker-popup">${this.name}<br>${this.address}<br>${this.cityZip}</p><a href="../status/${this.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                    return text;
                }

            });
        } else  if (results.party === "UNA"){
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                voterId: results.voterId,
                name: results.firstName + " " + results.lastName,
                address: results.streetNum + " "+ results.streetName,
                cityZip: results.city +", " + results.state + " " + results.zipcode,
                icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                getName: function(){
                    var text = `<p class="map-marker-popup">${this.name}<br>${this.address}<br>${this.cityZip}</p><a href="../status/${this.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                    return text;
                }

            });
        } else{
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    voterId: results.voterId,
                    name: results.firstName + " " + results.lastName,
                    address: results.streetNum + " "+ results.streetName,
                    cityZip: results.city +", " + results.state + " " + results.zipcode,
                    icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    getName: function () {
                        var text = `<p class="map-marker-popup">${this.name}<br>${this.address}<br>${this.cityZip}</p><a href="../status/${this.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                        return text;
                    }
                });
        }
   
        //    info.push(marker.title);
        var infowindow = new google.maps.InfoWindow({});
        var contentString = marker.getName() + '<a href="../status/:id"><button type="button" class="btn btn-danger">Voter Status</button></a>';
        marker.addListener('click', function () {
            infowindow.setContent(this.getName());
            infowindow.open(map, this);
            map.setCenter(this.getPosition());
        });
        // console.log(info);
    }
}

$(document).ready(function () {
   
    // Filter Menu 

    $('.btn-expand-collapse').click(function (e) {
        $('.navbar-primary').toggleClass('collapsed');
        var filterMenu = $('#filter-menu-icon');
        if (filterMenu.attr("class") == "fa fa-caret-square-o-right") {
            filterMenu.attr("class", "fa fa-caret-square-o-left");
        } else {
            filterMenu.attr("class", "fa fa-caret-square-o-right");
        }
    });
    

    $("#filter-menu-submit").on("click", function () {
        loadMapWithFilter();
    });

    function loadMapWithFilter() {
        var status;
        if ($("#status").val().trim() == "") {
            status = "";
        }else {
            status = $("#status").val().trim() == "active" ? "Active" : "Inactive Confirmation";
        }
        
            filterObj = {
            county: $("#county").val().trim(),
            address: $("#address").val().trim(),
            city: $("#city").val().trim(),
            state: $("#state").val().trim(),
            zip: $("#zip").val().trim(),
            party: $("#party").val().trim(),
            status: status,
            ward: $("#ward").val().trim(),
            district: $("#district").val().trim(),
            cd: $("#cd").val().trim(),
            ld: $("#ld").val().trim(),
            freeholder: $("#freeholder").val().trim(),
            schoolDistrict: $("#school-district").val().trim(),
            regSchoolDistrict: $("#reg-school-district").val().trim(),
            fire: $("#fire-district").val().trim()
        }

        $.post("/api/filter", filterObj, function (data) {
            // close filter menu when open
            var filterMenu = $('#filter-menu-icon');
            if (filterMenu.attr("class") == "fa fa-caret-square-o-left") {
                $('.navbar-primary').toggleClass('collapsed');
                filterMenu.attr("class", "fa fa-caret-square-o-right");
            } 
            loadMap(data);
        });
    }



}); // document.ready





