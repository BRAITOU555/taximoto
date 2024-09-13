function initMap() {
    console.log("Carte Google Maps initialisée.");

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 48.8566, lng: 2.3522 }, // Coordonnées de Paris
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Auto-complétion des adresses de départ et de destination
    const autocompleteDeparture = new google.maps.places.Autocomplete(
        document.getElementById('departure')
    );
    const autocompleteDestination = new google.maps.places.Autocomplete(
        document.getElementById('destination')
    );

    // Géolocalisation : récupérer la position actuelle de l'utilisateur
    document.getElementById('geolocate').addEventListener('click', function() {
        console.log("Bouton Géolocalisation cliqué.");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                console.log("Position de l'utilisateur récupérée :", pos);

                // Centrer la carte sur la position actuelle
                map.setCenter(pos);
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Vous êtes ici",
                });

                // Remplir le champ "Adresse de départ" avec la position actuelle
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: pos }, function(results, status) {
                    if (status === "OK") {
                        if (results[0]) {
                            document.getElementById('departure').value = results[0].formatted_address;
                            console.log("Adresse de départ auto-remplie :", results[0].formatted_address);
                        } else {
                            window.alert("Pas de résultats trouvés.");
                        }
                    } else {
                        window.alert("Le Geocoder a échoué en raison de : " + status);
                    }
                });
            });
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    });

    // Estimer le tarif lorsque l'utilisateur clique sur "Estimation du tarif"
    document.getElementById('estimate-fare').addEventListener('click', function() {
        console.log("Bouton Estimation du tarif cliqué.");

        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;

        console.log("Adresse de départ :", departure);
        console.log("Adresse de destination :", destination);

        if (!departure || !destination) {
            alert("Veuillez saisir à la fois l'adresse de départ et l'adresse de destination.");
            return;
        }

        // Appeler la fonction de calcul d'itinéraire
        console.log("Appel de la fonction calculateRoute()");
        calculateRoute(directionsService, directionsRenderer, departure, destination);
    });
}

// Fonction pour calculer l'itinéraire et afficher le tarif
function calculateRoute(directionsService, directionsRenderer, departure, destination) {
    console.log("Calcul de l'itinéraire entre :", departure, "et", destination);

    const request = {
        origin: departure,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        console.log("Status de l'appel à Directions API :", status);
        if (status === google.maps.DirectionsStatus.OK) {
            console.log("Itinéraire trouvé.");
            directionsRenderer.setDirections(result);
            const route = result.routes[0];
            const distanceInKm = route.legs[0].distance.value / 1000; // Distance en kilomètres

            console.log("Distance en km :", distanceInKm);

            const fare = calculateFare(distanceInKm);
            document.getElementById('fare').innerText = "Tarif estimé : " + fare + " €";
        } else {
            console.log("Erreur Google Maps Directions :", status);
            alert("L'itinéraire ne peut pas être calculé. Veuillez vérifier les adresses.");
        }
    });
}

// Fonction pour calculer le tarif en fonction de la distance
function calculateFare(distance) {
    const baseFare = 30; // Tarif de base en €
    const farePerKm = 1.5; // Prix par kilomètre en €
    return (baseFare + (farePerKm * distance)).toFixed(2); // Arrondir à deux décimales
}

// Charger la carte quand la page est chargée
window.onload = initMap;
