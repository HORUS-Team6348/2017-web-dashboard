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
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50', '100',
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined
  });

	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('purple');
});

app.controller('uiCtrl', function($scope){
		$scope.modeStyle = {"color": "", "display": "inline"}
    $scope.data = {
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
            VRM: 2.4,
        },
        rio:{
            cpu: 63,
            ram: 48,
            current: 1.2,
        },
        match: {
            time: 0,
            phase: 'not started'
        },
        sensors: {
            gyroAngle: 42,
        },
        autoMode:{
            selectedMode: 'forward',
            availibleModes: {}
        },
				drive:{
					a: 0.4,
					x: 0.6,
					y: 0.8,
					lt: 0.5,
					rt: 0.5,
				},
        connected: false
    };

    $scope.onConnection = function(connected){
			$scope.data.connected = connected
			console.log("connected!")
    }

		$scope.getMode = function(){
	  	if($scope.data.match.phase == "climb"){
	  		if($scope.data.match.time % 2 == 0){
	  			$scope.modeStyle = {"color": "red", "display": "inline"}
	  		} else{
	  			$scope.modeStyle = {"color": "red", "display": "none"}
	  		}
	  		return "climb!" //data.match.phase
	  	} else{
				$scope.modeStyle = {"color": "", "display": "inline"}
	  		return $scope.data.match.phase
	  	}
	  }

		$scope.updateDrive = function(){
			NetworkTables.putValue("/data/drive/a", $scope.data.drive.a)
			NetworkTables.putValue("/data/drive/x", $scope.data.drive.x)
			NetworkTables.putValue("/data/drive/y", $scope.data.drive.y)
			NetworkTables.putValue("/data/drive/lt", $scope.data.drive.lt)
			NetworkTables.putValue("/data/drive/rt", $scope.data.drive.rt)
		}

    $scope.onValueChanged = function(key, value, isNew){
				if(key.startsWith("/data/")){
					var a = key.split('/');
			    $scope.data[a[2]][a[3]] = value
				}
				$scope.$apply()
    }

		$scope.select = function(autoMode){
			$scope.data.autoMode.selectedMode = autoMode
			NetworkTables.putValue("/data/autoMode/selectedMode", autoMode)
		}

    $scope.getStatus = function(){
        if($scope.data.connected){
            return 'connected'
        } else {
            return 'disconnected'
        }
    }


    NetworkTables.addRobotConnectionListener($scope.onConnection, true);
    NetworkTables.addGlobalListener($scope.onValueChanged, true);
});
