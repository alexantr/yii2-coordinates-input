<?php

namespace alexantr\coordinates;

use Yii;
use yii\helpers\Html;
use yii\web\View;
use yii\widgets\InputWidget;

/**
 * CoordinatesInput
 * @link https://developers.google.com/maps/documentation/javascript/tutorial
 * @link https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/index-docpage/
 */
class CoordinatesInput extends InputWidget
{
    /**
     * @inheritdoc
     */
    public $options = ['class' => 'form-control coordinates-input'];
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
        $this->registerClientScript();
        return $this->renderContent();
    }

    /**
     * Renders tags
     * @return string
     */
    protected function renderContent()
    {
        if ($this->hasModel()) {
            $content = Html::activeTextInput($this->model, $this->attribute, $this->options) . "\n";
        } else {
            $content = Html::textInput($this->name, $this->value, $this->options) . "\n";
        }

        // append map
        $this->mapOptions['id'] = $this->mapId;
        if ($this->initialLatitude !== null && $this->initialLongitude !== null) {
            $this->mapOptions['data-lat'] = $this->initialLatitude;
            $this->mapOptions['data-lng'] = $this->initialLongitude;
        } elseif (isset(Yii::$app->params[$this->initialLatLngParamName])) {
            $initial = Yii::$app->params[$this->initialLatLngParamName];
            if (isset($initial['lat'], $initial['lng'])) {
                $this->mapOptions['data-lat'] = $initial['lat'];
                $this->mapOptions['data-lng'] = $initial['lng'];
            } elseif (isset($initial[0], $initial[1])) {
                $this->mapOptions['data-lat'] = $initial[0];
                $this->mapOptions['data-lng'] = $initial[1];
            }
        }
        $content .= Html::tag('div', '', $this->mapOptions);

        return $content;
    }

    /**
     * Registers map scripts
     */
    protected function registerClientScript()
    {
        $view = $this->getView();
        $bundle = CoordinatesAsset::register($view);

        $id = $this->options['id'];
        $mapId = $this->mapId;

        if ($this->yandexMaps) {
            if (!empty($bundle->mapLang)) {
                $lang = $bundle->mapLang;
            } else {
                $appLang = substr(Yii::$app->language, 0, 2);
                if ($appLang == 'en') {
                    $lang = 'en_US';
                } elseif ($appLang == 'uk') {
                    $lang = 'uk_UA';
                } elseif ($appLang == 'tr') {
                    $lang = 'tr_TR';
                } else {
                    $lang = 'ru_RU';
                }
            }
            $view->registerJs("alexantr.coordinatesWidget.initYandexMaps('$id', '$mapId', '$lang');", View::POS_END);
        } else {
            $view->registerJs("alexantr.coordinatesWidget.initGoogleMap('$id', '$mapId', '{$bundle->googleMapsApiKey}');", View::POS_END);
        }
    }
}
