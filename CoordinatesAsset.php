<?php

namespace alexantr\coordinates;

use yii\web\AssetBundle;

class CoordinatesAsset extends AssetBundle
{
    public $sourcePath = '@alexantr/coordinates/assets';
    public $css = [
        'coordinates.widget.css',
    ];
    public $js = [
        'coordinates.widget.js',
    ];
}
