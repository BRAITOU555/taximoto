function initMap() {
    // Initialisation de la carte centrée sur Paris
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 48.8566, lng: 2.3522 } // Coordonnées de Paris
    });

    // Autocomplétion pour les adresses de départ et de destination
    const autocompleteDeparture = new google.maps.places.Autocomplete(
        document.getElementById('departure')
    );
    const autocompleteDestination = new google.maps.places.Autocomplete(
        document.getElementById('destination')
    );

    // Fonction de géolocalisation pour centrer la carte sur la position de l'utilisateur
    document.getElementById('geolocate').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);

                // Ajouter un marqueur à l'emplacement de l'utilisateur
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Vous êtes ici"
                });
            }, function() {
                handleLocationError(true, map.getCenter());
            });
        } else {
            // Le navigateur ne supporte pas la géolocalisation
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    });

    // Fonction pour gérer les erreurs de géolocalisation
    function handleLocationError(browserHasGeolocation, pos) {
        const infoWindow = new google.maps.InfoWindow({
            position: pos,
            content: browserHasGeolocation
                ? "Erreur : Le service de géolocalisation a échoué."
                : "Erreur : Votre navigateur ne supporte pas la géolocalisation."
        });
        infoWindow.open(map);
    }

    // Estimation du tarif basé sur la distance entre les points de départ et de destination
    document.getElementById('estimate-fare').addEventListener('click', function() {
        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;

        if (departure && destination) {
            calculateFare(departure, destination, map);
        } else {
            alert("Veuillez saisir à la fois une adresse de départ et une destination.");
        }
    });
}

// Fonction pour calculer et afficher le tarif estimé en fonction de la distance
function calculateFare(departure, destination, map) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    // Afficher l'itinéraire sur la carte
    directionsRenderer.setMap(map);

    const request = {
        origin: departure,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);

            // Calculer la distance et le tarif estimé
            const distanceInKm = result.routes[0].legs[0].distance.value / 1000; // Distance en kilomètres
            const fare = calculateFareBasedOnDistance(distanceInKm);

            // Afficher le tarif estimé dans le DOM
            document.getElementById('fare').innerText = `Tarif estimé : ${fare} €`;
        } else {
            alert("Impossible de calculer l'itinéraire. Veuillez vérifier les adresses saisies.");
        }
    });
}

// Fonction pour calculer le tarif en fonction de la distance
function calculateFareBasedOnDistance(distance) {
    const baseFare = 30; // Tarif de base en euros
    const farePerKm = 1.5; // Coût par kilomètre en euros
    return (baseFare + (farePerKm * distance)).toFixed(2); // Retourne le tarif arrondi
}

// Charger la carte lorsque la page est chargée
window.onload = initMap;
