function initMap() {
    // Initialisation de la carte centrée sur Paris
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 48.8566, lng: 2.3522 }, // Coordonnées de Paris
    });

    // Auto-complétion pour les adresses de départ et de destination
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
                // Centrer la carte sur la position actuelle
                map.setCenter(pos);
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Vous êtes ici",
                });
                // Remplir le champ "Adresse de départ" avec la position
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: pos }, function(results, status) {
                    if (status === "OK") {
                        if (results[0]) {
                            document.getElementById('departure').value = results[0].formatted_address;
                        } else {
                            window.alert("Pas de résultats trouvés.");
                        }
                    } else {
                        window.alert("Geocoder a échoué en raison de : " + status);
                    }
                });
            });
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    });
}

// Charger la carte quand la page est chargée
window.onload = initMap;
