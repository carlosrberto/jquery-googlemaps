/*
* jQuery googlemaps
* https://github.com/carlosrberto/jquery-googlemaps
*
* Copyright (c) 2014 Carlos Roberto Gomes Junior
* http://carlosrberto.github.io/
*
* Licensed under MIT License
*
* Version: 0.1
*/

(function() {
    var defaults = {
        map: {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        center: null,
        autoCompleteInput: null,
        destinationMarkerImage: null,
        originMarkerImage: null
    };

    var GoogleMaps = function(el, options) {
        this.el = $(el);
        this.options = $.extend(true, {}, defaults, options);
        this.destinationLatLng = null;

        this.map = new google.maps.Map(this.el[0], this.options.map);

        this.geocoder = new google.maps.Geocoder();
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setOptions( { suppressMarkers: true } );

        this.destinationMarker = new google.maps.Marker({
            map: this.map
        });

        this.originMarker = new google.maps.Marker({
            map: this.map
        });

        if ( this.options.destinationMarkerImage ) {
            this.destinationMarker.setOptions({
                icon: new google.maps.MarkerImage(this.options.destinationMarkerImage)
            });
        }

        if ( this.options.originMarkerImage ) {
            this.originMarker.setOptions({
                icon: new google.maps.MarkerImage(this.options.originMarkerImage)
            });
        }

        if ( this.options.autoCompleteInput ) {
            this.autocompleteInput = new google.maps.places.Autocomplete(this.options.autoCompleteInput[0]);
        }

        // set inital addres
        this.setInitialAddress();
    };

    GoogleMaps.prototype = {
        setInitialAddress: function() {
            var dataAddress = this.el.data('address'),
                dataLat = this.el.data('lat'),
                dataLng = this.el.data('lng');

            if (dataAddress) {
                this.setAddress({ address: dataAddress });
            } else if( dataLat && dataLng ) {
                this.setAddress({ lat: dataLat, lng: dataLng });
            } else if ( this.options.center ) {
                this.setAddress(this.options.center);
            }
        },

        setAddress: function(o) {
            if ( typeof o === 'object' ) {
                if ( o.address ) {
                    this.codeAddress(o.address).done(function(latlng){
                        this.map.setCenter(latlng);
                        this.destinationMarker.setPosition(latlng);
                        this.destinationLatLng = latlng;
                    });
                } else if (o.lat && o.lng) {
                    var latlng = new google.maps.LatLng(o.lat, o.lng);
                    this.map.setCenter(latlng);
                    this.destinationMarker.setPosition(latlng);
                    this.destinationLatLng = latlng;
                }
            }
        },

        setMapOptions: function(options) {
            this.map.setOptions(options);
        },

        codeAddress: function(addr) {
            var that = this, deferred  = new $.Deferred();
            this.geocoder.geocode( { 'address': addr}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    deferred.resolveWith(that, [results[0].geometry.location, results, status]);
                } else {
                    deferred.rejectWith(that);
                }
            });

            deferred.done(function(){
                that.el.trigger('codeaddress');
            });

            return deferred.promise();
        },

        reverseGeocode: function(lat, lng) {
            var that = this, deferred  = new $.Deferred(), latlng = new google.maps.LatLng(lat, lng);

            this.geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    deferred.resolveWith(that, [results, status]);
                } else {
                    deferred.rejectWith(that, [status]);
                }
            });

            deferred.done(function(){
                that.el.trigger('reversegeocode');
            });

            return deferred.promise();
        },

        traceRoute: function(origin, destination) {
            destination = destination || this.destinationLatLng;

            if ( destination ) {
                var that = this,
                    request = {
                        origin: origin,
                        destination:destination,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                    };

                that.directionsService.route(request, function(result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        that.directionsDisplay.setDirections(result);
                        that.codeAddress(origin).done(function(latlng){
                            that.originMarker.setPosition(latlng);
                            that.el.trigger('traceroute');
                        });
                    }
                });
            }
        }
    };

    $.fn.googlemaps = function( method ) {
        var args = arguments;

        return this.each(function() {

            if ( !$.data(this, 'googlemaps') ) {
                $.data(this, 'googlemaps', new GoogleMaps(this, method));
                return;
            }

            var api = $.data(this, 'googlemaps');

            if ( typeof method === 'string' && method.charAt(0) !== '_' && api[ method ] ) {
                api[ method ].apply( api, Array.prototype.slice.call( args, 1 ) );
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.googlemaps' );
            }
        });
    };
})();
