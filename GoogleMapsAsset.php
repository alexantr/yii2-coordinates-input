<?php

namespace alexantr\coordinates;

use yii\web\AssetBundle;

class GoogleMapsAsset extends AssetBundle
{
    /**
     * @var string Google api key
     * @see https://developers.google.com/maps/documentation/javascript/get-api-key
     */
    public $apiKey = '';

    public $basePath = '@webroot';
    public $baseUrl = '@web';

    public function init()
    {
        $this->js[] = 'https://maps.googleapis.com/maps/api/js?key=' . $this->apiKey;
        parent::init();
    }
}
