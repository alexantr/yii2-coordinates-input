if (typeof alexantr === 'undefined' || !alexantr) {
    var alexantr = {};
}

alexantr.coordinatesWidget = (function (d) {
    'use strict';

    var yandexMapsApiLoading = false,
        googleMapsApiLoading = false,
        yandexMapsCallbacks = [],
        googleMapsCallbacks = [];

    function initOptions(inputId, options) {
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
            if ('lat' in options && 'lng' in options) {
                lat = options.lat;
                lng = options.lng;
                zoom = ('zoom' in options) ? options.zoom : 10;
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

    function runYandexMaps(inputId, mapId, options) {
        var input = d.getElementById(inputId),
            opt = initOptions(inputId, options),
            placemarkPreset = 'islands#redDotIcon';
        var yMap = new ymaps.Map(mapId, {
            center: [opt.lat, opt.lng],
            zoom: opt.zoom,
            controls: ['smallMapDefaultSet']
        });
        var marker;
        if (opt.showMarker) {
            marker = new ymaps.Placemark([opt.lat, opt.lng], {}, {preset: placemarkPreset});
            yMap.geoObjects.add(marker);
        }
        yMap.events.add('click', function (e) {
            var coords = e.get('coords');
            if (typeof marker !== 'undefined') {
                yMap.geoObjects.remove(marker);
            }
            marker = new ymaps.Placemark(coords, {}, {preset: placemarkPreset});
            yMap.geoObjects.add(marker);
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
                    if (typeof marker !== 'undefined') {
                        yMap.geoObjects.remove(marker);
                    }
                    marker = new ymaps.Placemark([lat, lng], {}, {preset: placemarkPreset});
                    yMap.geoObjects.add(marker);
                }
            }
        };
    }

    function runGoogleMaps(inputId, mapId, options) {
        var input = d.getElementById(inputId),
            map = d.getElementById(mapId),
            opt = initOptions(inputId, options);
        var latlng = new google.maps.LatLng(opt.lat, opt.lng);
        var gMap = new google.maps.Map(map, {
            zoom: opt.zoom,
            center: latlng
        });
        var marker;
        if (opt.showMarker) {
            marker = new google.maps.Marker({position: latlng, map: gMap});
        }
        google.maps.event.addListener(gMap, 'click', function (e) {
            if (typeof marker !== 'undefined') {
                marker.setMap(null);
            }
            marker = new google.maps.Marker({position: e.latLng, map: gMap});
            changeInputValue(input, e.latLng.lat(), e.latLng.lng());
        });
        input.onchange = function () {
            if (input.getAttribute('data-changed')) {
                input.removeAttribute('data-changed');
            } else if (input.value) {
                var inputLatLng = input.value.split(/\s*,\s*/);
                if (inputLatLng.length === 2) {
                    var lat = parseFloat(inputLatLng[0]) || 0;
                    var lng = parseFloat(inputLatLng[1]) || 0;
                    var latlng = new google.maps.LatLng(lat, lng);
                    gMap.panTo(latlng);
                    gMap.setZoom(14);
                    if (typeof marker !== 'undefined') {
                        marker.setMap(null);
                    }
                    marker = new google.maps.Marker({position: latlng, map: gMap});
                }
            }
        };
    }

    return {
        yandexMapsApiCallback: function () {
            yandexMapsApiLoading = false;
            setTimeout(function () {
                for (var i = 0; i < yandexMapsCallbacks.length; i++) {
                    runYandexMaps(yandexMapsCallbacks[i].inputId, yandexMapsCallbacks[i].mapId, yandexMapsCallbacks[i].options);
                }
            }, 1000);
        },
        googleMapsApiCallback: function () {
            googleMapsApiLoading = false;
            setTimeout(function () {
                for (var i = 0; i < googleMapsCallbacks.length; i++) {
                    runGoogleMaps(googleMapsCallbacks[i].inputId, googleMapsCallbacks[i].mapId, googleMapsCallbacks[i].options);
                }
            }, 1000);
        },
        initYandexMaps: function (inputId, mapId, options, lang) {
            if (typeof ymaps !== 'undefined') {
                setTimeout(function () {
                    runYandexMaps(inputId, mapId, options);
                }, 1000);
            } else {
                yandexMapsCallbacks.push({inputId: inputId, mapId: mapId, options: options});
                if (!yandexMapsApiLoading) {
                    yandexMapsApiLoading = true;
                    var script = d.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'https://api-maps.yandex.ru/2.1/?lang=' + lang + '&onload=alexantr.coordinatesWidget.yandexMapsApiCallback';
                    script.async = true;
                    var scriptTag = d.getElementsByTagName('script')[0];
                    scriptTag.parentNode.insertBefore(script, scriptTag);
                }
            }
        },
        initGoogleMaps: function (inputId, mapId, options, apiKey) {
            if (typeof google === 'object' && typeof google.maps === 'object') {
                setTimeout(function () {
                    runGoogleMaps(inputId, mapId, options);
                }, 1000);
            } else {
                googleMapsCallbacks.push({inputId: inputId, mapId: mapId, options: options});
                if (!googleMapsApiLoading) {
                    googleMapsApiLoading = true;
                    var script = d.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=alexantr.coordinatesWidget.googleMapsApiCallback';
                    script.async = true;
                    var scriptTag = d.getElementsByTagName('script')[0];
                    scriptTag.parentNode.insertBefore(script, scriptTag);
                }
            }
        }
    };
})(document);
