
var app = angular.module("Dashboard", ['ngMaterial', 'nvd3']);

app.config(function($mdThemingProvider) {

	$mdThemingProvider.definePalette('purple', {
    '50': '8D48AB',
    '100': '8D48AB',
    '200': '8D48AB',
    '300': '8D48AB',
    '400': '8D48AB',
    '500': '8D48AB',
    '600': '8D48AB',
    '700': '8D48AB',
    '800': '8D48AB',
    '900': '8D48AB',
    'A100': '8D48AB',
    'A200': '8D48AB',
    'A400': '8D48AB',
    'A700': '8D48AB',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('purple');
});

app.factory('updateService', function(){
	updateService = {};

	updateService.data = {
		motors: {
			left: 0,
			right: 0,
			climber: 0
		},
		power: {
			batteryVoltage: 10.8,
			totalCurrent: 28.6,
			left: 12.34,
			right: 6.3,
			climber: 4.8,
			VRM: 2.3,
		},
	    rio:{
	    	cpu: 63,
	    	ram: 48,
	    	current: 0,
	    },
		match: {
			time: 0,
			phase: 'not started'
		},
		cameras: {

		},
		sensors: {
			gyroAngle: 42,
		},
		autoMode:{
			selectedMode: 'forward',
			availibleModes: {}
		},
		connected: false
	};

	updateService.sendValue = function(key, value){
		NetworkTables.putValue(key, value);
	};

	updateService.getValue = function(key){
		NetworkTables.getValue(key);
	};

  updateService.getProperty = function(data, keyName, assign) {
    keyName = keyName.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    keyName = keyName.replace(/^\./, '');           // strip a leading dot
    
    var a = keyName.split('/');
    
    data[a[2]][a[3]] = assign
    return data[a[2]][a[3]]
  };

	updateService.onValueChanged = function(key, value, isNew){
		if (value == 'true') {
			value = true;
		} else if (value == 'false') {
			value = false;
		}

		if(key.startsWith("/data/")){
			var a = key.split('/');
	    	prop = updateService.getProperty(updateService.data, key, value)

		}

	    
	};

	updateService.onConnection = function(connected){
		updateService.data.connected = connected;
	};

	NetworkTables.addRobotConnectionListener(updateService.onConnection, true);
	NetworkTables.addGlobalListener(updateService.onValueChanged, true);

	return updateService;
});

app.controller('uiCtrl', function($scope, updateService){
  $scope.us = updateService
  $scope.data = $scope.us.data
  data = $scope.data
  scope = $scope
  window.setInterval(function(){
  	console.log("update!")
  	$scope.$idcodigest()
  }, 500)
});

app.controller('clockCtrl', function($scope, updateService){
  var data = updateService.data;
  $scope.data = data;
  $scope.modeStyle = {"color": "", "display": "inline"}

  $scope.getTime = function(){
    return data.match.time
  };
  $scope.getStatus = function(){
    if(data.connected)
      return 'connected';
    else
      return 'disconnected';
  };
  $scope.getMode = function(){
  	if(data.match.phase == "climb"){
  		if(data.match.time % 2 == 0){
  			$scope.modeStyle = {"color": "red", "display": "inline"}
  		} else{
  			$scope.modeStyle = {"color": "red", "display": "none"}
  		}
  		return "climb!" //data.match.phase
  	} else{
  		return data.match.phase
  	}
  }

});

app.controller('angleLockCtrl', function($scope, updateService){
	$scope.info = {
		selected: 'off'
	};

	$scope.select = function(name){
		$scope.info.selected = name;
		updateService.sendValue('autoMode/selectedMode', name);
	};
});

app.controller('fieldOrientedCtrl', function($scope, updateService){
	$scope.info = {
		fieldOriented: true
	};

	$scope.toggleFieldOriented = function(){
		$scope.info.fieldOriented = !$scope.info.fieldOriented;
	};
});

app.controller('autoCtrl', function($scope, updateService){
	$scope.info = {
		selected: 'forward'
	};

	$scope.select = function(name){
		$scope.info.selected = name;
	};
});

app.controller('autoGearCtrl', function($scope, updateService){
		$scope.info = {

		};
});

app.controller('compassCtrl', function($scope, updateService){
  $scope.info = {
    value: updateService.data.sensors.gyroAngle * Math.PI / 180
  };
});
