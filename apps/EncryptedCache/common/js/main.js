/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var busyIndicator = null;

function wlCommonInit() {
	busyIndicator = new WL.BusyIndicator();
	
	$('#openCache').click(openCacheClicked);
	$('#closeCache').click(closeCacheClicked);
	$('#destroyCache').click(destroyCacheClicked);

	$('#encryptButton').click(encryptButtonClicked);
	$('#decryptButton').click(decryptButtonClicked);
	$('#removeButton').click(removeButtonClicked);
}

//Open
function openCacheClicked(){
	var key = $('#encryptionKey').val();	
	if (!key || key == "") 	{ 	
		alert("Invalid key");	
		return;	
	}
	
	busyIndicator.show();
	
	WL.EncryptedCache.open(key, true, onOpenComplete, onOpenError);
	function onOpenComplete(status){
		busyIndicator.hide();
		alert("Encrypted cache succesfully opened");
	}
	function onOpenError(status){
		busyIndicator.hide();
		switch(status){
			case WL.EncryptedCache.ERROR_KEY_CREATION_IN_PROGRESS:
				alert("ERROR: KEY CREATION IN PROGRESS");
				break;
			case WL.EncryptedCache.ERROR_LOCAL_STORAGE_NOT_SUPPORTED:
				alert("ERROR: LOCAL STORAGE NOT SUPPORTED");
				break;
			case WL.EncryptedCache.ERROR_NO_EOC:
				alert("ERROR: NO EOC");
				break;
			case WL.EncryptedCache.ERROR_COULD_NOT_GENERATE_KEY:
				alert("ERROR: COULD NOT GENERATE KEY");
				break;
			case WL.EncryptedCache.ERROR_CREDENTIALS_MISMATCH:
				alert("ERROR: CREDENTIALS MISMATCH");
				break;
			default:
				alert("AN ERROR HAS OCCURED. STATUS :: " + status);
		}
	}	
}

// Close
function closeCacheClicked(){
	WL.EncryptedCache.close(onCloseCompleteHandler, onCloseFailureHandler);
}
function onCloseCompleteHandler(status){
	alert("Encrypted cache closed successfuly");
}
function onCloseFailureHandler(status){
	alert("Could not close Encrypted cache");
}

// Destroy
function destroyCacheClicked(){
	WL.EncryptedCache.destroy(onDestroyCompleteHandler, onDestroyErrorHandler);
	//alert("Encrypted cache destroyed");
}
function onDestroyCompleteHandler(status){
	alert("Encrypted cache destroyed");
}
function onDestroyErrorHandler(status){
	alert("Error destroying Encrypted cache");
}

// Encrypt
function encryptButtonClicked(){
	var key = $("#key").val(); 
	var value = $("#value").val();
	
	if (!key || key == "") 	{ 
		alert("Invalid key");	
		return;	
	}
	
	if (!value|| value == "") {
		alert("Invalid value");	
		return;	
	}
	
	WL.EncryptedCache.write(key, value, onWriteSuccess, onWriteFailure);
	function onWriteSuccess(status){
		alert("Succesfully encrypted into cache.");
	}
	function onWriteFailure(status){
		if (status == WL.EncryptedCache.ERROR_EOC_CLOSED) 
			alert("Encrypted cache closed, write failed. error code= "+ status);
	}
}

// Decrypt
function decryptButtonClicked(){
	var key = $("#key").val(); 
	if (!key || key == "") 	{
		alert("Invalid key");
		return;	
	}
	
	WL.EncryptedCache.read(key, onDecryptReadSuccess, onDecryptReadFailure);
	function onDecryptReadSuccess(value){
		alert("Read success. Retrieved value :: " + key + " = " + value); 
	}
	function onDecryptReadFailure(status){
		alert("Encrypted cache closed, reading failed");
	}
}

// Remove
function removeButtonClicked(){
	var key = $("#key").val(); 
	if (!key || key == "") 	{ 
		alert("Invalid key");	
		return;	
	}
	
	WL.EncryptedCache.remove(key, onRemoveSuccess, onRemoveFailure);
	function onRemoveSuccess(status){
		alert("Succesfully removed from cache."); 
	}
	function onRemoveFailure(status){
		alert("Encrypted cache closed, remove failed");
	}
}
