<?php

namespace alexantr\coordinates;

use yii\web\AssetBundle;

class CoordinatesAsset extends AssetBundle
{
    public $sourcePath = '@alexantr/coordinates/assets';
    public $css = [
        'coordinates.css',
    ];
    public $js = [
        'coordinates.js',
    ];
    /**
     * @var string Google API key
     * @see https://developers.google.com/maps/documentation/javascript/get-api-key
     */
    public $googleMapsApiKey;
    /**
     * @var string Yandex Maps language
     * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/localization-docpage/
     */
    public $yandexMapsLang;
    /**
     * @var array Initial coordinates for all maps
     */
    public $initialCoordinates;
    /**
     * @var int Initial zoom for all maps. Default is 10
     */
    public $initialZoom;
}
