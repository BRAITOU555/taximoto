function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 48.8566, lng: 2.3522 } // Coordonnées de Paris
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    document.getElementById('estimate-fare').addEventListener('click', function() {
        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;

        if (!departure || !destination) {
            alert("Veuillez saisir à la fois l'adresse de départ et l'adresse de destination.");
            return;
        }

        calculateRouteWithTraffic(directionsService, directionsRenderer, departure, destination);
    });
}

function calculateRouteWithTraffic(directionsService, directionsRenderer, departure, destination) {
    const request = {
        origin: departure,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
            departureTime: new Date(),  // Calcul en fonction du trafic actuel
            trafficModel: 'bestguess'   // Modèle basé sur la meilleure estimation du trafic
        }
    };

    directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            const route = result.routes[0];
            const distanceInKm = route.legs[0].distance.value / 1000; // Distance en kilomètres
            const durationWithTraffic = route.legs[0].duration_in_traffic.text; // Durée avec le trafic

            const fare = calculateFare(distanceInKm);
            document.getElementById('fare').innerText = "Tarif estimé : " + fare + " €";
            document.getElementById('duration').innerText = "Durée estimée avec trafic : " + durationWithTraffic;
        } else {
            console.error("Erreur Google Maps Directions :", status);
            alert("Erreur lors du calcul de l'itinéraire. Veuillez vérifier les adresses.");
        }
    });
}

function calculateFare(distance) {
    const baseFare = 30; // Tarif de base
    const farePerKm = 1.5; // Prix par kilomètre
    return (baseFare + (farePerKm * distance)).toFixed(2); // Arrondir à deux décimales
}

window.onload = initMap;
