<?php

namespace alexantr\coordinates;

use Yii;
use yii\helpers\Html;
use yii\helpers\Json;
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
     * @var array Map container options
     */
    public $mapOptions = ['class' => 'coordinates-map-container'];
    /**
     * @var array Initial map center. Has higher priority over $initialCoordinates from CoordinatesAsset
     */
    public $initialCoordinates;
    /**
     * @var bool Use Yandex Maps instead Google Maps
     */
    public $yandexMaps = false;

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
        if (!isset($this->mapOptions['id'])) {
            $this->mapOptions['id'] = $this->options['id'] . '-map';
        }
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
        $mapId = $this->mapOptions['id'];

        $coordinates = [];

        // set initial coordinates
        if ($this->initialCoordinates !== null) {
            if (isset($this->initialCoordinates['lat'], $this->initialCoordinates['lng'])) {
                $coordinates['lat'] = $this->initialCoordinates['lat'];
                $coordinates['lng'] = $this->initialCoordinates['lng'];
            } elseif (isset($this->initialCoordinates[0], $this->initialCoordinates[1])) {
                $coordinates['lat'] = $this->initialCoordinates[0];
                $coordinates['lng'] = $this->initialCoordinates[1];
            }
        } elseif ($bundle->initialCoordinates !== null) {
            if (isset($bundle->initialCoordinates['lat'], $bundle->initialCoordinates['lng'])) {
                $coordinates['lat'] = $bundle->initialCoordinates['lat'];
                $coordinates['lng'] = $bundle->initialCoordinates['lng'];
            } elseif (isset($bundle->initialCoordinates[0], $bundle->initialCoordinates[1])) {
                $coordinates['lat'] = $bundle->initialCoordinates[0];
                $coordinates['lng'] = $bundle->initialCoordinates[1];
            }
        }

        $encodedCoordinates = !empty($coordinates) ? Json::htmlEncode($coordinates) : '{}';

        if ($this->yandexMaps) {
            if (!empty($bundle->yandexMapsLang)) {
                $lang = $bundle->yandexMapsLang;
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
            $view->registerJs("alexantr.coordinatesWidget.initYandexMaps('$id', '$mapId', $encodedCoordinates, '$lang');", View::POS_END);
        } else {
            $view->registerJs("alexantr.coordinatesWidget.initGoogleMaps('$id', '$mapId', $encodedCoordinates, '{$bundle->googleMapsApiKey}');", View::POS_END);
        }
    }
}
