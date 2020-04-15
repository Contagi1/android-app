// params

var cfg = [];
cfg['timeToScan'] = 5000;																								// ms, time to stop scanning for BT devices

// main cycle

var ippocrate = {
	
		cfg: [],																														// List of config parameters, to be set during initialization
		idlog: [],																													// List of advertising buffers, saved on scanning success callbacks
	
    initialize: function(cfg) {																					// Initialization of Ippocrate (BT, cache, ledger, etc etc)
        console.log("Ippocrate is starting!");
        ippocrate.cfg = cfg;
    },
    
    btCheck: function() {																								// Checks if the Bluetooth is currently enabled
				ble.isEnabled(
						function() {																								// success callback
								console.log("Bluetooth is enabled");
						},
						function() {																								// error callback
								console.log("Bluetooth is *not* enabled");
						}
				);
		},
        
    btEnable: function() {																							// Prompts the user to enable the Bluetooth
				ble.enable(
						function() {																								// success callback
								console.log("Bluetooth is enabled");
						},
						function() {																								// error callback
								console.log("The user did *not* enable Bluetooth");
						}
				);
		},
    
    bleStartScan: function() {																					// Performs BLE scan for a given amount of time

				console.log("scanning...");
				ble.startScan([], 
						function(scanResult) { ippocrate.idlogUpdate(scanResult); },// success callback
						function() { console.log("scan start failed"); }						// error callback
				);
				setTimeout(ble.stopScan,
						ippocrate.cfg['timeToScan'],
						function() { console.log("scan complete"); },								// success callback
						function() { console.log("scan stop failed"); }							// error callback
				);
		},
		
		idlogUpdate: function(scanResult) {																	// Updates the log of IDs with new scan results
				
				// normalizes the found-device object, depending on the OS
				if (cordova.platformId == "android") {
						scanResultParsed = ippocrate.bleParseAdvertisingData(scanResult);
						scanResultParsed.rssi = scanResult.rssi;
					
						// TODO: disambiguates insert/update of values
						ippocrate.idlog.push(scanResultParsed);
						console.log("result just added to idlog list [tech debt here!]");
					
				} else if (cordova.platformId == "ios") {
						console.log("iOS found-object normalization is TO DO");
				}
		},
		
		idlogShow: function() {																							// Updates the UI to show the log of IDs
				console.log("Here is the log of IDs:");
				console.log(ippocrate.idlog);
		},
		
		bleParseAdvertisingData: function(scanResult) {											// Parses BLE advertising data into a normalized map - Android

				// converts the arrayBuffer object into an array of hex bytes
				buffer = new Uint8Array(scanResult.advertising);
				byteArray = [];
				for (i=0; i<buffer.byteLength; i++) {
						byte = parseInt(buffer.slice(i,(i+1)));
						byteArray.push( ('0'+byte.toString(16)).slice(-2) );
				}
				
				// slices the bytes array into a map
				scanResultParsed = {
						"macAddress": scanResult.id,
						"rawAdvertisement": byteArray.join(''),
						"UUID": byteArray.join('').slice(12,44),
						"packetLength": buffer[0],
						"packetType": byteArray[1],
						"manufacturerId": byteArray[2]+byteArray[3],
						"subtype": byteArray[4],
						"subtypeLength": buffer[5],
						"major": buffer[22]+buffer[23],
						"minor": buffer[24]+buffer[25],
						"signalPower": buffer[26]-256
				}
					
				return scanResultParsed;
		}
}



//experiments

bluetoothle.initializePeripheral(
		function(obj){
				console.log("init success");
				console.log(obj);
		},
		function(obj){
				console.log("init error");
				console.log(obj);
		},
		{
				"request": true,
				"restoreKey": "bluetoothleplugin"
		}
);


bluetoothle.addService(
		function(obj){
				console.log("addService success");
				console.log(obj);
		},
		function(obj){
				console.log("addService error");
				console.log(obj);
		},
		{
				service: "0215",
				characteristics: [
				{
						uuid: "1234",
						permissions: {
							read: true,
							write: false,
							//readEncryptionRequired: true,
							//writeEncryptionRequired: true,
						},
						properties : {
							read: true,
							writeWithoutResponse: false,
							write: false,
							notify: true,
							indicate: true,
							//authenticatedSignedWrites: true,
							//notifyEncryptionRequired: true,
							//indicateEncryptionRequired: true,
						}
				}]
		}
);


bluetoothle.removeService(
		function(obj){
				console.log("removeService success");
				console.log(obj);
		},
		function(obj){
				console.log("removeService error");
				console.log(obj);
		},
		{
			service: "ABCD",
		}
);

bluetoothle.removeAllServices(		function(obj){
				console.log("removeAllServices success");
				console.log(obj);
		},
		function(obj){
				console.log("removeAllServices error");
				console.log(obj);
		}
);
		
			
bluetoothle.startAdvertising(
		function(obj){
				console.log("adv success");
				console.log(obj);
		},
		function(obj){
				console.log("adv error");
				console.log(obj);
		},
		{
				"services":["ABCD"], //iOS
				"service":"ABCD", //Android
				"name":"Hello World",
		}
);
		
		
		
		
		
