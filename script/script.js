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
            // Demande la permission de géolocalisation
            navigator.geolocation.getCurrentPosition(function(position) {
                // Si la géolocalisation est autorisée, récupère la position
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                // Centre la carte sur la position actuelle
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
                            // Remplit le champ d'adresse de départ avec l'adresse géolocalisée
                            document.getElementById('departure').value = results[0].formatted_address;
                        } else {
                            alert("Aucune adresse trouvée.");
                        }
                    } else {
                        alert("Échec de la géolocalisation : " + status);
                    }
                });
            }, function(error) {
                // Gestion des erreurs de géolocalisation
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("La géolocalisation a été refusée. Veuillez autoriser la géolocalisation pour utiliser cette fonctionnalité.");
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
            // Si le navigateur ne supporte pas la géolocalisation
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    });
}

// Charger la carte et initialiser les fonctionnalités de géolocalisation au chargement de la page
window.onload = initMap;
