if (typeof alexantr === "undefined" || !alexantr) {
    var alexantr = {};
}

alexantr.coordinatesWidget = {
    _initValues: function (inputId, mapId) {
        var inputValue = document.getElementById(inputId).value,
            map = document.getElementById(mapId);
        var mapLat = map.getAttribute('data-lat'),
            mapLng = map.getAttribute('data-lng');
        var lat = 0, lng = 0, zoom = 1;
        if (mapLat && mapLng) {
            lat = parseFloat(mapLat) || 0;
            lng = parseFloat(mapLng) || 0;
        }
        var showMarker = false;
        if (inputValue) {
            var inputLatLng = inputValue.split(/\s*,\s*/);
            if (inputLatLng.length === 2) {
                lat = parseFloat(inputLatLng[0]) || 0;
                lng = parseFloat(inputLatLng[1]) || 0;
                showMarker = true;
            }
        }
        if (lat !== 0 && lng !== 0) {
            zoom = showMarker ? 14 : 10;
        }
        return {
            lat: lat,
            lng: lng,
            zoom: zoom,
            showMarker: showMarker
        };
    },
    _changeInputValue: function (input, lat, lng) {
        input.value = lat.toFixed(6) + ', ' + lng.toFixed(6);
        input.setAttribute('data-changed', '1'); // prevent change event
        if ('createEvent' in document) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            input.dispatchEvent(evt);
        } else {
            input.fireEvent('onchange');
        }
    },
    initYandexMap: function (inputId, mapId) {
        var _this = this,
            input = document.getElementById(inputId),
            initValues = _this._initValues(inputId, mapId),
            placemarkPreset = 'islands#redDotIcon';
        var lat = initValues.lat,
            lng = initValues.lng,
            zoom = initValues.zoom,
            showMarker = initValues.showMarker;
        ymaps.ready(function () {
            var yMap = new ymaps.Map(mapId, {
                center: [lat, lng],
                zoom: zoom,
                controls: ['smallMapDefaultSet']
            });
            yMap.behaviors.disable(['scrollZoom']);
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
                _this._changeInputValue(input, coords[0], coords[1]);
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
        });
    },
    initGoogleMap: function (inputId, mapId) {
        var _this = this,
            input = document.getElementById(inputId),
            map = document.getElementById(mapId),
            initValues = _this._initValues(inputId, mapId);
        var lat = initValues.lat,
            lng = initValues.lng,
            zoom = initValues.zoom,
            showMarker = initValues.showMarker;
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
            _this._changeInputValue(input, e.latLng.lat(), e.latLng.lng());
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
                    if (typeof marker !== 'undefined') marker.setMap(null);
                    marker = new google.maps.Marker({
                        position: latlng,
                        map: gMap
                    });
                }
            }
        };
    }
};