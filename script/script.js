function initMap() {
    // Initialisation de la carte centrée sur Paris
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

        calculateRoute(directionsService, directionsRenderer, departure, destination);
    });
}

// Fonction pour calculer l'itinéraire sans prendre en compte la circulation
function calculateRoute(directionsService, directionsRenderer, departure, destination) {
    const request = {
        origin: departure,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            const route = result.routes[0];
            const distanceInKm = route.legs[0].distance.value / 1000; // Distance en kilomètres

            const fare = calculateFare(distanceInKm);
            document.getElementById('fare').innerText = "Tarif estimé : " + fare + " €";
        } else {
            alert("Impossible de calculer l'itinéraire, veuillez vérifier les adresses.");
        }
    });
}

// Fonction de calcul du tarif selon la distance
function calculateFare(distance) {
    const baseFare = 30; // Tarif de base
    const farePerKm = 1.5; // Prix par kilomètre
    return (baseFare + (farePerKm * distance)).toFixed(2); // Arrondir à deux décimales
}

window.onload = initMap;
