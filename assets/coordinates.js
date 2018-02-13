if (typeof alexantr === 'undefined' || !alexantr) {
    var alexantr = {};
}

alexantr.coordinatesWidget = (function (d) {
    'use strict';

    var yandexMapsApiLoading = false,
        googleMapsApiLoading = false,
        yandexMapsCallbacks = [],
        googleMapsCallbacks = [];

    function initValues(inputId, coordinates) {
        var inputValue = d.getElementById(inputId).value;
        var lat = 0, lng = 0, zoom = 1, showMarker = false;
        // check input value
        if (inputValue) {
            var inputLatLng = inputValue.split(/\s*,\s*/);
            if (inputLatLng.length === 2) {
                lat = parseFloat(inputLatLng[0]) || 0;
                lng = parseFloat(inputLatLng[1]) || 0;
                showMarker = true;
                zoom = 14;
            }
        }
        // no input value
        if (!showMarker) {
            if ('lat' in coordinates && 'lng' in coordinates) {
                lat = coordinates.lat;
                lng = coordinates.lng;
                zoom = 10;
            }
        }
        return {
            lat: lat,
            lng: lng,
            zoom: zoom,
            showMarker: showMarker
        };
    }

    function changeInputValue(input, lat, lng) {
        input.value = lat.toFixed(6) + ', ' + lng.toFixed(6);
        input.setAttribute('data-changed', '1'); // prevent change event
        if ('createEvent' in d) {
            var evt = d.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            input.dispatchEvent(evt);
        } else {
            input.fireEvent('onchange');
        }
    }

    function runYandexMaps(inputId, mapId, coordinates) {
        var input = d.getElementById(inputId),
            values = initValues(inputId, coordinates),
            placemarkPreset = 'islands#redDotIcon';
        var lat = values.lat,
            lng = values.lng,
            zoom = values.zoom,
            showMarker = values.showMarker;
        var yMap = new ymaps.Map(mapId, {
            center: [lat, lng],
            zoom: zoom,
            controls: ['smallMapDefaultSet']
        });
        var yPlacemark;
        if (showMarker) {
            yPlacemark = new ymaps.Placemark([lat, lng], {}, {preset: placemarkPreset});
            yMap.geoObjects.add(yPlacemark);
        }
        yMap.events.add('click', function (e) {
            var coords = e.get('coords');
            if (typeof yPlacemark !== 'undefined') {
                yMap.geoObjects.remove(yPlacemark);
            }
            yPlacemark = new ymaps.Placemark(coords, {}, {preset: placemarkPreset});
            yMap.geoObjects.add(yPlacemark);
            changeInputValue(input, coords[0], coords[1]);
        });
        input.onchange = function () {
            if (input.getAttribute('data-changed')) {
                input.removeAttribute('data-changed');
            } else if (input.value) {
                var inputLatLng = input.value.split(/\s*,\s*/);
                if (inputLatLng.length === 2) {
                    var lat = parseFloat(inputLatLng[0]) || 0;
                    var lng = parseFloat(inputLatLng[1]) || 0;
                    yMap.setCenter([lat, lng], 14);
                    if (typeof yPlacemark !== 'undefined') {
                        yMap.geoObjects.remove(yPlacemark);
                    }
                    yPlacemark = new ymaps.Placemark([lat, lng], {}, {preset: placemarkPreset});
                    yMap.geoObjects.add(yPlacemark);
                }
            }
        };
    }

    function runGoogleMaps(inputId, mapId, coordinates) {
        var input = d.getElementById(inputId),
            map = d.getElementById(mapId),
            values = initValues(inputId, coordinates);
        var lat = values.lat,
            lng = values.lng,
            zoom = values.zoom,
            showMarker = values.showMarker;
        var latlng = new google.maps.LatLng(lat, lng);
        var options = {
            zoom: zoom,
            center: latlng
        };
        var gMap = new google.maps.Map(map, options);
        var marker;
        if (showMarker) {
            marker = new google.maps.Marker({
                position: latlng,
                map: gMap
            });
        }
        google.maps.event.addListener(gMap, 'click', function (e) {
            if (typeof marker !== 'undefined') {
                marker.setMap(null);
            }
            marker = new google.maps.Marker({
                position: e.latLng,
                map: gMap
            });
            changeInputValue(input, e.latLng.lat(), e.latLng.lng());
        });
        input.onchange = function () {
            if (input.getAttribute('data-changed')) {
                input.removeAttribute('data-changed');
            } else if (input.value) {
                var inputLatLng = input.value.split(/\s*,\s*/);
                if (inputLatLng.length === 2) {
                    lat = parseFloat(inputLatLng[0]) || 0;
                    lng = parseFloat(inputLatLng[1]) || 0;
                    var latlng = new google.maps.LatLng(lat, lng);
                    gMap.panTo(latlng);
                    gMap.setZoom(14);
                    if (typeof marker !== 'undefined') {
                        marker.setMap(null);
                    }
                    marker = new google.maps.Marker({
                        position: latlng,
                        map: gMap
                    });
                }
            }
        };
    }

    return {
        yandexMapsApiCallback: function () {
            yandexMapsApiLoading = false;
            for (var i = 0; i < yandexMapsCallbacks.length; i++) {
                runYandexMaps(yandexMapsCallbacks[i].inputId, yandexMapsCallbacks[i].mapId, yandexMapsCallbacks[i].coordinates);
            }
        },
        googleMapsApiCallback: function () {
            googleMapsApiLoading = false;
            for (var i = 0; i < googleMapsCallbacks.length; i++) {
                runGoogleMaps(googleMapsCallbacks[i].inputId, googleMapsCallbacks[i].mapId, googleMapsCallbacks[i].coordinates);
            }
        },
        initYandexMaps: function (inputId, mapId, coordinates, lang) {
            if (typeof ymaps !== 'undefined') {
                runYandexMaps(inputId, mapId, coordinates);
            } else {
                yandexMapsCallbacks.push({inputId: inputId, mapId: mapId, coordinates: coordinates});
                if (!yandexMapsApiLoading) {
                    yandexMapsApiLoading = true;
                    var script = d.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'https://api-maps.yandex.ru/2.1/?lang=' + lang + '&onload=alexantr.coordinatesWidget.yandexMapsApiCallback';
                    d.body.appendChild(script);
                }
            }
        },
        initGoogleMaps: function (inputId, mapId, coordinates, apiKey) {
            if (typeof google === 'object' && typeof google.maps === 'object') {
                runGoogleMaps(inputId, mapId, coordinates);
            } else {
                googleMapsCallbacks.push({inputId: inputId, mapId: mapId, coordinates: coordinates});
                if (!googleMapsApiLoading) {
                    googleMapsApiLoading = true;
                    var script = d.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=alexantr.coordinatesWidget.googleMapsApiCallback';
                    d.body.appendChild(script);
                }
            }
        }
    };
})(document);
