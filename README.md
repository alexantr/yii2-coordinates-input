# Map coordinates input widget for Yii 2

This extension renders an input with Google map or Yandex map and allows to set coordinates quickly by clicking on the map.

## Installation

Install extension through [composer](http://getcomposer.org/):

```
composer require alexantr/yii2-coordinates-input
```

## Configuring

At first set [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) in application config.
Additionally you can set [Yandex Maps language](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/localization-docpage/)
and initial coordinates for all maps.

```php
[
    'components' => [
        'assetManager' => [
            'bundles' => [
                'alexantr\coordinates\CoordinatesAsset' => [
                    'googleMapsApiKey' => 'UBcsRlxWxBjmZBvrW154fXJ4eJeeO4TFMp9pRLi', // <- put api key here
                    'yandexMapsLang' => 'en_US',
                    'initialCoordinates' => [-53.106392, 73.528748], // [latitude, longitude]
                ],
            ],
        ],
    ],
]
```

## Usage

The following code in a view file would render an input with Google map:

```php
<?= alexantr\coordinates\CoordinatesInput::widget(['name' => 'attributeName']) ?>
```

If you want to use this input widget in an ActiveForm, it can be done like this:

```php
<?= $form->field($model, 'attributeName')->widget(alexantr\coordinates\CoordinatesInput::className(), ['yandexMaps' => true]) ?>
```

All widget options with default values:

```php
<?= alexantr\coordinates\CoordinatesInput::widget([
    'name' => 'attributeName',
    // there is
    'options' => ['class' => 'form-control coordinates-input'],
    'mapOptions' => ['class' => 'coordinates-map-container'],
    'initialCoordinates' => null,
    'yandexMaps' => false, // Set to true to use Yandex maps instead Google maps
]) ?>
```

Value of `initialCoordinates` can be in two formats: `[53.923172, 27.540036]` or `['lat' => 53.923172, 'lng' => 27.540036]`.
