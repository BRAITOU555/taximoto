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

    // Service Geocoder pour convertir les coordonnées en adresse
    const geocoder = new google.maps.Geocoder();

    // Géolocalisation : récupérer la position actuelle de l'utilisateur
    document.getElementById('geolocate').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                
                // Centrer la carte sur la position géolocalisée
                map.setCenter(pos);

                // Ajouter un marqueur à la position géolocalisée
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Vous êtes ici"
                });

                // Utiliser Geocoder pour obtenir l'adresse et la remplir dans le champ "Adresse de départ"
                geocoder.geocode({ location: pos }, function(results, status) {
                    if (status === "OK") {
                        if (results[0]) {
                            document.getElementById('departure').value = results[0].formatted_address;
                        } else {
                            alert("Aucune adresse trouvée.");
                        }
                    } else {
                        alert("Le géocodage a échoué en raison de : " + status);
                    }
                });
            }, function() {
                alert("Échec de la géolocalisation.");
            });
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    });
}

window.onload = initMap;
