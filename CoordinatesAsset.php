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
}
