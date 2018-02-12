# Map coordinates input widget for Yii 2

This extension renders an input with Google map or Yandex map and allows to set coordinates quickly by clicking on the map.

## Installation

Install extension through [composer](http://getcomposer.org/):

```
composer require "alexantr/yii2-coordinates-input"
```

## Usage

Before use set [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) in application config:

```php
[
    'components' => [
        'assetManager' => [
            'bundles' => [
                'alexantr\coordinates\CoordinatesAsset' => [
                    'googleMapsApiKey' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // <- put here
                ],
            ],
        ],
    ],
]
```

The following code in a view file would render an input with Google map:

```php
<?= alexantr\coordinates\CoordinatesInput::widget(['name' => 'attributeName']) ?>
```

If you want to use this input widget in an ActiveForm, it can be done like this:

```php
<?= $form->field($model, 'attributeName')->widget(alexantr\coordinates\CoordinatesInput::className()) ?>
```

All widget options with default values:

```php
<?= alexantr\coordinates\CoordinatesInput::widget([
    'name' => 'attributeName',
    'options' => ['class' => 'form-control coordinates-form-control'],
    'mapOptions' => ['class' => 'coordinates-map-container'],
    'initialLatitude' => null,
    'initialLongitude' => null,
    'initialLatLngParamName' => 'coordinates.initialLatLng', // App param name with initial coordinates
    'yandexMaps' => false, // Set to true to use Yandex maps instead Google maps
]) ?>
```

Value of param for `initialLatLngParamName` option can be in two formats: `[53.923172, 27.540036]` or `['lat' => 53.923172, 'lng' => 27.540036]`.
