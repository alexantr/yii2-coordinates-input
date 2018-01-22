# Map coordinates input widget for Yii 2

This extension renders a text input with Google map or Yandex map and allows to set coordinates quickly by clicking on this map.

[![Latest Stable Version](https://img.shields.io/packagist/v/alexantr/yii2-coordinates-input.svg)](https://packagist.org/packages/alexantr/yii2-coordinates-input)
[![Total Downloads](https://img.shields.io/packagist/dt/alexantr/yii2-coordinates-input.svg)](https://packagist.org/packages/alexantr/yii2-coordinates-input)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/alexantr/yii2-coordinates-input/master/LICENSE)

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
                'alexantr\coordinates\GoogleMapsAsset' => [
                    'apiKey' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // <- put here
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

All widget params with default values:

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

If you want to use this input widget in an ActiveForm, it can be done like this:

```php
<?= $form->field($model, 'attributeName')->widget(alexantr\coordinates\CoordinatesInput::className()) ?>
```
