function initMap() {
    // Initialisation de la carte centrée sur Paris
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 48.8566, lng: 2.3522 } // Coordonnées valides de Paris
    });

    // Autocomplétion pour les adresses de départ et de destination
    const autocompleteDeparture = new google.maps.places.Autocomplete(
        document.getElementById('departure')
    );
    const autocompleteDestination = new google.maps.places.Autocomplete(
        document.getElementById('destination')
    );

    // Géolocalisation : récupérer la position actuelle de l'utilisateur
    document.getElementById('geolocate').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Vous êtes ici",
                });

                // Utiliser le Geocoder pour obtenir l'adresse basée sur la position géolocalisée
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: pos }, function(results, status) {
                    if (status === "OK") {
                        if (results[0]) {
                            document.getElementById('departure').value = results[0].formatted_address;
                        } else {
                            alert("Aucune adresse trouvée.");
                        }
                    } else {
                        alert("Échec de la géolocalisation : " + status);
                    }
                });
            }, function(error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("La géolocalisation a été refusée. Veuillez autoriser la géolocalisation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Les informations de position ne sont pas disponibles.");
                        break;
                    case error.TIMEOUT:
                        alert("La demande de géolocalisation a expiré.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("Une erreur inconnue s'est produite.");
                        break;
                }
            });
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    });

    // Estimation du tarif en fonction de la distance
    document.getElementById('estimate-fare').addEventListener('click', function() {
        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;

        if (departure && destination) {
            const directionsService = new google.maps.DirectionsService();

            const request = {
                origin: departure,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    const route = result.routes[0];
                    const distanceInKm = route.legs[0].distance.value / 1000; // Distance en kilomètres

                    const fare = calculateFare(distanceInKm);
                    document.getElementById('fare').innerText = "Tarif estimé : " + fare + " €";
                } else {
                    alert("Impossible de calculer l'itinéraire : " + status);
                }
            });
        } else {
            alert("Veuillez remplir les adresses de départ et de destination.");
        }
    });
}

// Fonction pour calculer le tarif en fonction de la distance
function calculateFare(distance) {
    const baseFare = 30; // Tarif de base
    const farePerKm = 1.5; // Prix par kilomètre supplémentaire
    return (baseFare + (farePerKm * distance)).toFixed(2);
}

window.onload = initMap;
