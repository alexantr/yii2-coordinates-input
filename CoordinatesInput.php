<?php

namespace alexantr\coordinates;

use Yii;
use yii\helpers\Html;
use yii\widgets\InputWidget;

class CoordinatesInput extends InputWidget
{
    /**
     * @inheritdoc
     */
    public $options = ['class' => 'form-control coordinates-form-control'];
    /**
     * @var array Map tag options
     */
    public $mapOptions = ['class' => 'coordinates-map-container'];
    /**
     * @var float|string Initial map center latitude
     */
    public $initialLatitude;
    /**
     * @var float|string Initial map center longitude
     */
    public $initialLongitude;
    /**
     * @var string App param name contains initial coordinates
     */
    public $initialLatLngParamName = 'coordinates.initialLatLng';
    /**
     * @var bool Use Yandex Maps instead Google Maps
     */
    public $yandexMaps = false;

    private $mapId;

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
        $this->mapId = $this->options['id'] . uniqid('_map');
    }

    /**
     * @inheritdoc
     */
    public function run()
    {
        if ($this->hasModel()) {
            echo Html::activeTextInput($this->model, $this->attribute, $this->options);
        } else {
            echo Html::textInput($this->name, $this->value, $this->options);
        }
        $this->mapOptions['id'] = $this->mapId;
        if ($this->initialLatitude !== null && $this->initialLongitude !== null) {
            $this->mapOptions['data-lat'] = $this->initialLatitude;
            $this->mapOptions['data-lng'] = $this->initialLongitude;
        } elseif (isset(Yii::$app->params[$this->initialLatLngParamName][0], Yii::$app->params[$this->initialLatLngParamName][1])) {
            $this->mapOptions['data-lat'] = Yii::$app->params[$this->initialLatLngParamName][0];
            $this->mapOptions['data-lng'] = Yii::$app->params[$this->initialLatLngParamName][1];
        }
        echo Html::tag('div', '', $this->mapOptions);
        $this->registerClientScript();
    }

    /**
     * Registers map scripts
     */
    protected function registerClientScript()
    {
        $view = $this->getView();

        if ($this->yandexMaps) {
            YandexMapsAsset::register($view);
        } else {
            GoogleMapsAsset::register($view);
        }
        CoordinatesAsset::register($view);

        $id = $this->options['id'];
        $mapId = $this->mapId;

        $js = "alexantr.coordinatesWidget." . ($this->yandexMaps ? 'initYandexMap' : 'initGoogleMap') . "('$id', '$mapId');";

        $view->registerJs($js);
    }
}
