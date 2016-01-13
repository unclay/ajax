;(function(win, doc){
	var __ajax = function() {
        return new __ajax.prototype.init.call(this, arguments);
    }
    __ajax.prototype = {
        init : function() {

        }
    }
    __ajax.prototype.init.prototype = __ajax.prototype;
    // deal ajax conflict
    __ajax.noconflict = function(name){
    	win.ajax = null;
    	if( !!name ) win[name] = __ajax;
    	return __ajax;
    }
    // Get path from URL
    __ajax.getPath = function(url){
    	var _u = /^((?:(\w+:)\/\/)?((\w+):?(\w+)?@)?(([^\/\?:]+)(?:\:(\d+))?))(\/[^\?#]+)?(\?[^#]+)?(#.*)?/;
    	_u = _u.exec(url);
    	_u = !!_u ? _u[9] : '/bz/callback';
    	_u = _u.replace(/^\//gi, '');
    	_u = _u.lastIndexOf('.') <= 0 ? _u : _u.substr( 0, _u.lastIndexOf('.') );
    	return _u;
    }
    // Convert path into callback function name
    __ajax.getCallbackName = function(url){
		return __ajax.getPath(url).replace(/\//gi, '_');
	}
	// Get data from interface (JSONP)
	__ajax.getJsonp = function(url, query, cb_success, cb_fail, cb_error){
		var _query = '';
		var callbackFuncName = '';
		var script = doc.createElement('script');
		// Get callback function name from URL
		var name = __ajax.getCallbackName(url);
		// api query params
		query = Object.prototype.toString.call(query) === '[object Object]' ? query : {};
		// Update callback function number
		this.callbackSerial = this.callbackSerial || {};
		this.callbackSerial[name] = this.callbackSerial[name] || 0;
		this.callbackSerial[name]++;
		// Set the name of the callback function
		callbackFuncName = name + '_' + this.callbackSerial[name];
		// After the interface callback function is executed, and then delete the callback function;
		if( !!cb_success ){
			window[callbackFuncName] = function(data){
				// The following logic depends on bozhong's api
				if( data.error_code == 0 ){
					cb_success && cb_success(data);
				} else {
					cb_fail && cb_fail(data);
				}
				delete window[callbackFuncName];
				doc.body.removeChild( doc.querySelector('#JS_' + callbackFuncName) );
			}
		}
		// When the interface does no exist, delete the callback function 
		script.onerror = function(){
			cb_error && cb_error();
			delete window[callbackFuncName];
			doc.body.removeChild( doc.querySelector('#JS_' + callbackFuncName) );
		}
		// Script adds ID to delete script elements
		script.id = 'JS_' + callbackFuncName;
		// Set query params
		_query = '?__c=' + callbackFuncName;
		for( var i in query ){
			_query += ('&' + i + '=' + query[i]);
		}
		script.src = url + _query;
		doc.body.appendChild(script);
	}
	__ajax.get = __ajax.getJsonp;
	win.ajax = __ajax;
}(window, document));