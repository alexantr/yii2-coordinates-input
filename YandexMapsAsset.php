<?php

namespace alexantr\coordinates;

use Yii;
use yii\web\AssetBundle;

class YandexMapsAsset extends AssetBundle
{
    /**
     * @var string Yandex maps language
     * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/localization-docpage/
     */
    public $mapLang;

    public $basePath = '@webroot';
    public $baseUrl = '@web';

    public function init()
    {
        if (!empty($this->mapLang)) {
            $lang = $this->mapLang;
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
        $this->js[] = 'https://api-maps.yandex.ru/2.1/?lang=' . $lang;
        parent::init();
    }
}
