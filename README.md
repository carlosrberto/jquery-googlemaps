# jQuery Google Maps

jQuery plugin to make maps using Google Maps

## Usage

```html
<script src="//maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>
<script src="jquery.googlemaps.js"></script>
```

### Example 1

```html
<div id="map-1" style="width: 600px; height: 300px" data-address="Avenida Paulista, São Paulo, Brasil"></div>
```

```javascript
$('#map-1').googlemaps({
    map: {
        zoom: 16,
        dragagble: false
    },
    destinationMarkerImage: 'map_pin.png'
});
```


### Example 2

```html
<div id="map-2" style="width: 600px; height: 300px" data-lat="0" data-lng="0"></div>
```

```javascript
$('#map-2').googlemaps({
	map: {
        zoom: 10
    }
});
```

### Example 3 (trace route)

```html
<div id="map-3" style="width: 600px; height: 300px" data-address="Avenida Presidente Vargas, 2121, Ribeirão Preto, Brasil"></div>
```

```javascript
$('#map-3').googlemaps({
	map: {
        zoom: 10
    }
});

$('#map-3').googlemaps('traceRoute', 'Rua Saldanha Marinho, Ribeirão Preto, Brasil', 'Avenida Presidente Vargas, 2121, Ribeirão Preto, Brasil');
```

## Default options

```javascript
{
	map: {
	    zoom: 15,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	},
	center: null,
	autoCompleteInput: null,
	destinationMarkerImage: null,
	originMarkerImage: null
}
```

## Demo

See a [demo](demo/).
