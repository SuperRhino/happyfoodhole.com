(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
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
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],2:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _ApiRequest=require('./ApiRequest');var _ApiRequest2=_interopRequireDefault(_ApiRequest);var _Constants=require('../Utils/Constants');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var AccessToken=function(){function AccessToken(){_classCallCheck(this,AccessToken);}_createClass(AccessToken,null,[{key:'get',value:function get(verify){if(typeof verify==='undefined'){verify=false;}return new Promise(function(resolve,reject){if(AccessToken._accessToken){return resolve(AccessToken._accessToken);}var access_token=localStorage.getItem(_Constants.Config.Storage.ACCESS_TOKEN);if(access_token===null){AccessToken.clear();return reject(new Error({code:403,message:'Unauthorized'}));}AccessToken.set(access_token,true).then(resolve);});}},{key:'set',value:function set(access_token,dontUpdateStorage){AccessToken._accessToken=access_token;return new Promise(function(resolve,reject){if(!dontUpdateStorage){localStorage.setItem(_Constants.Config.Storage.ACCESS_TOKEN,access_token);}resolve(access_token);});}},{key:'clear',value:function clear(){AccessToken._accessToken=null;return localStorage.removeItem(_Constants.Config.Storage.ACCESS_TOKEN);}}]);return AccessToken;}();exports.default=AccessToken;

},{"../Utils/Constants":14,"./ApiRequest":5}],5:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _Utils=require('../Utils/Utils');var _Utils2=_interopRequireDefault(_Utils);var _Actions=require('../Utils/Actions');var _Actions2=_interopRequireDefault(_Actions);var _ApiUtils=require('./ApiUtils');var _ApiUtils2=_interopRequireDefault(_ApiUtils);var _AccessToken=require('./AccessToken');var _AccessToken2=_interopRequireDefault(_AccessToken);var _superagent=require('superagent');var _superagent2=_interopRequireDefault(_superagent);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var ApiRequest=function(){_createClass(ApiRequest,null,[{key:'updateNetworkIndicator',value:function updateNetworkIndicator(){var dir=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'-';if(dir==='+'){ApiRequest.activeRequests++;}else{ApiRequest.activeRequests--;}if(ApiRequest.activeRequests<=0){ApiRequest.activeRequests=0;}else{}}},{key:'create',value:function create(method,endpoint){return new this(method,endpoint);}},{key:'createAnon',value:function createAnon(method,endpoint){var request=new this(method,endpoint);request.setAnonymous(true);return request;}},{key:'get',value:function get(endpoint){return new this('get',endpoint);}},{key:'post',value:function post(endpoint){return new this('post',endpoint);}},{key:'put',value:function put(endpoint){return new this('put',endpoint);}},{key:'delete',value:function _delete(endpoint){return new this('delete',endpoint);}}]);function ApiRequest(method,endpoint){_classCallCheck(this,ApiRequest);if(endpoint===undefined){endpoint=method;method='get';}else{method=method.toLowerCase();}if(endpoint.indexOf('?')!==-1){throw new Error('You must set query string data via the `query` function');}this.isAnonymous=false;this.handleErrors=true;this.ignoreNetworkError=false;this.url=_ApiUtils2.default.buildUrl(endpoint);this._setupRequest(method);}_createClass(ApiRequest,[{key:'setAnonymous',value:function setAnonymous(isAnonymous){this.isAnonymous=isAnonymous;return this;}},{key:'setHandleErrors',value:function setHandleErrors(handleErrors){this.handleErrors=handleErrors;return this;}},{key:'setIgnoreNetworkError',value:function setIgnoreNetworkError(ignoreNetworkError){this.ignoreNetworkError=ignoreNetworkError;return this;}},{key:'configure',value:function configure(callback){callback(this.request);return this;}},{key:'send',value:function send(callback,errCallback){var _this=this;if(this.isAnonymous){return this._sendIt(callback,errCallback);}_AccessToken2.default.get().then(function(token){_this.query({token:token});_this._sendIt(callback,errCallback);});}},{key:'data',value:function data(_data){this.requestBody=JSON.stringify(_data);return this;}},{key:'query',value:function query(data){this.queryData=Object.assign(this.queryData,data);return this;}},{key:'header',value:function header(_header,value){this.requestHeaders[_header]=value;return this;}},{key:'headers',value:function headers(_headers){this.requestHeaders=Object.assign(this.requestHeaders,_headers);return this;}},{key:'_setupRequest',value:function _setupRequest(method){this.requestMethod=!method?'get':method;this.requestHeaders={'Accept':'application/json','Content-Type':'application/json'};this.queryData={};this.requestBody={};this.request=null;}},{key:'_sendIt',value:function _sendIt(callback,errCallback){var _this2=this;ApiRequest.updateNetworkIndicator('+');this.request=_superagent2.default[this.requestMethod](this.url);if(!_Utils2.default.isEmpty(this.queryData)){this.request.query(this.queryData);}if(!_Utils2.default.isEmpty(this.requestHeaders)){this.request.set(this.requestHeaders);}this.request.send(this.requestBody).end(function(err,res){ApiRequest.updateNetworkIndicator();if(res.ok){callback(res.body);}else if(res.unauthorized){_AccessToken2.default.clear();_Actions2.default.noauth();}else{if(_this2.handleErrors){_ApiUtils2.default.handleError(res.body.error);}if(errCallback)errCallback(res.body.error);}});}}]);return ApiRequest;}();ApiRequest.activeRequests=0;exports.default=ApiRequest;

},{"../Utils/Actions":13,"../Utils/Utils":17,"./AccessToken":4,"./ApiUtils":6,"superagent":"superagent"}],6:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _Utils=require('../Utils/Utils');var _Utils2=_interopRequireDefault(_Utils);var _Constants=require('../Utils/Constants');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var DEFAULT_ERROR='There was a problem with your request';var ApiUtils=function(){function ApiUtils(){_classCallCheck(this,ApiUtils);}_createClass(ApiUtils,null,[{key:'handleError',value:function handleError(err){console.warn(err);_Utils2.default.showError(err.message||DEFAULT_ERROR);}},{key:'handleNetworkError',value:function handleNetworkError(err){console.warn(err);}},{key:'buildUrl',value:function buildUrl(endpoint){endpoint=_Utils2.default.trimChar(endpoint,'/');if(endpoint.indexOf(_Constants.Config.api_root)===-1){endpoint=_Constants.Config.api_root+endpoint;}return endpoint;}}]);return ApiUtils;}();exports.default=ApiUtils;

},{"../Utils/Constants":14,"../Utils/Utils":17}],7:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require("react");var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var BlogSearch=function(_React$Component){_inherits(BlogSearch,_React$Component);function BlogSearch(props){_classCallCheck(this,BlogSearch);var _this=_possibleConstructorReturn(this,(BlogSearch.__proto__||Object.getPrototypeOf(BlogSearch)).call(this,props));_this.state={};_this._onSubmit=_this._onSubmit.bind(_this);return _this;}_createClass(BlogSearch,[{key:"render",value:function render(){return _react2.default.createElement("div",{className:"well"},_react2.default.createElement("h4",null,"Blog Search"),_react2.default.createElement("form",{role:"form",onSubmit:this._onSubmit},_react2.default.createElement("div",{className:"input-group"},_react2.default.createElement("input",{ref:"searchTerm",type:"text",className:"form-control",defaultValue:this.props.term}),_react2.default.createElement("span",{className:"input-group-btn"},_react2.default.createElement("button",{className:"btn btn-default",type:"submit"},_react2.default.createElement("span",{className:"glyphicon glyphicon-search"}))))));}},{key:"_onSubmit",value:function _onSubmit(e){e.preventDefault();if(this.refs.searchTerm.value){window.location="/search?term="+this.refs.searchTerm.value;}}}]);return BlogSearch;}(_react2.default.Component);BlogSearch.propTypes={term:_react2.default.PropTypes.string};BlogSearch.defaultProps={term:null};exports.default=BlogSearch;

},{"react":"react"}],8:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);var _Actions=require('../Utils/Actions');var _Actions2=_interopRequireDefault(_Actions);var _ApiRequest=require('../Api/ApiRequest');var _ApiRequest2=_interopRequireDefault(_ApiRequest);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var LoginForm=function(_React$Component){_inherits(LoginForm,_React$Component);function LoginForm(props){_classCallCheck(this,LoginForm);var _this=_possibleConstructorReturn(this,(LoginForm.__proto__||Object.getPrototypeOf(LoginForm)).call(this,props));_this.state={};_this.onSubmit=_this.onSubmit.bind(_this);return _this;}_createClass(LoginForm,[{key:'render',value:function render(){return _react2.default.createElement('form',{className:'navbar-form navbar-right',role:'form',onSubmit:this.onSubmit},_react2.default.createElement('div',{className:'form-group',style:styles.formField},_react2.default.createElement('input',{ref:'username',type:'text',placeholder:'username',className:'form-control'})),_react2.default.createElement('div',{className:'form-group',style:styles.formField},_react2.default.createElement('input',{ref:'password',type:'password',placeholder:'password',className:'form-control'})),_react2.default.createElement('button',{type:'submit',className:'btn btn-default'},'Sign in'));}},{key:'onSubmit',value:function onSubmit(e){e.preventDefault();var data={username:this.refs.username.value,password:this.refs.password.value};_Actions2.default.login(data);}}]);return LoginForm;}(_react2.default.Component);LoginForm.propTypes={};LoginForm.defaultProps={};exports.default=LoginForm;var styles={formField:{margin:3}};

},{"../Api/ApiRequest":5,"../Utils/Actions":13,"react":"react"}],9:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);var _dropzone=require('dropzone');var _dropzone2=_interopRequireDefault(_dropzone);var _Constants=require('../Utils/Constants');var _Utils=require('../Utils/Utils');var _Utils2=_interopRequireDefault(_Utils);var _ApiUtils=require('../Api/ApiUtils');var _ApiUtils2=_interopRequireDefault(_ApiUtils);var _AccessToken=require('../Api/AccessToken');var _AccessToken2=_interopRequireDefault(_AccessToken);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var SRDropzone=function(_React$Component){_inherits(SRDropzone,_React$Component);function SRDropzone(props){_classCallCheck(this,SRDropzone);var _this=_possibleConstructorReturn(this,(SRDropzone.__proto__||Object.getPrototypeOf(SRDropzone)).call(this,props));_this.dropzone=null;_this.state={};return _this;}_createClass(SRDropzone,[{key:'componentDidMount',value:function componentDidMount(){var _this2=this;_AccessToken2.default.get().then(function(token){var dzOptions={url:_ApiUtils2.default.buildUrl('/upload-file?token='+token),dictDefaultMessage:"<h3>Dragon Drop Images</h3><p> or Click to Upload</p>",init:function init(){this.on("success",function(file,response){console.log(file,response);});this.on("addedfile",function(file){var dzName=file.previewElement.querySelector('[data-dz-name]');dzName.innerHTML=_Constants.Config.uploads_dir+file.name;});}};_this2.dropzone=new _dropzone2.default(_this2.refs.dropzone,dzOptions);});}},{key:'render',value:function render(){return _react2.default.createElement('div',{ref:'dropzone',style:this.props.style,className:'dropzone'},this.props.children);}}]);return SRDropzone;}(_react2.default.Component);SRDropzone.propTypes={style:_react2.default.PropTypes.object,activeStyle:_react2.default.PropTypes.object,multiple:_react2.default.PropTypes.bool};SRDropzone.defaultProps={style:{},activeStyle:{},multiple:true};exports.default=SRDropzone;

},{"../Api/AccessToken":4,"../Api/ApiUtils":6,"../Utils/Constants":14,"../Utils/Utils":17,"dropzone":"dropzone","react":"react"}],10:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);var _Actions=require('../Utils/Actions');var _Actions2=_interopRequireDefault(_Actions);var _CurrentUser=require('../Stores/CurrentUser');var _CurrentUser2=_interopRequireDefault(_CurrentUser);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var UserMenu=function(_React$Component){_inherits(UserMenu,_React$Component);function UserMenu(props){_classCallCheck(this,UserMenu);var _this=_possibleConstructorReturn(this,(UserMenu.__proto__||Object.getPrototypeOf(UserMenu)).call(this,props));_this.state={user:_this.props.user};return _this;}_createClass(UserMenu,[{key:'componentWillMount',value:function componentWillMount(){this.stopListening=_CurrentUser2.default.listen(this._onUserChange.bind(this));this.setState({user:_CurrentUser2.default.get()});}},{key:'componentWillUnmount',value:function componentWillUnmount(){this.stopListening();}},{key:'render',value:function render(){return _react2.default.createElement('ul',{className:'nav navbar-nav navbar-right'},_react2.default.createElement('li',{className:'dropdown'},_react2.default.createElement('a',{href:'#',className:'dropdown-toggle','data-toggle':'dropdown',role:'button','aria-haspopup':'true','aria-expanded':'false'},this.state.user.username,_react2.default.createElement('span',{className:'caret'})),_react2.default.createElement('ul',{className:'dropdown-menu'},_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'/admin/page-editor'},_react2.default.createElement('span',{className:'glyphicon glyphicon-plus','aria-hidden':'true',style:styles.icon}),'Add Page')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'/admin/page-inventory'},_react2.default.createElement('span',{className:'glyphicon glyphicon-edit','aria-hidden':'true',style:styles.icon}),'Edit Articles')),_react2.default.createElement('li',{role:'separator',className:'divider'}),_react2.default.createElement('li',{className:'dropdown-header'},'My Account'),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#',onClick:this._onLogoutPress},_react2.default.createElement('span',{className:'glyphicon glyphicon-log-out','aria-hidden':'true',style:styles.icon}),'Sign Out')))));}},{key:'_onLogoutPress',value:function _onLogoutPress(e){e.preventDefault();_Actions2.default.logout();}},{key:'_onUserChange',value:function _onUserChange(user){this.setState({user:user});}}]);return UserMenu;}(_react2.default.Component);UserMenu.propTypes={user:_react2.default.PropTypes.object};UserMenu.defaultProps={user:{}};exports.default=UserMenu;var styles={icon:{paddingRight:'5px'}};

},{"../Stores/CurrentUser":12,"../Utils/Actions":13,"react":"react"}],11:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);var _Actions=require('../Utils/Actions');var _Actions2=_interopRequireDefault(_Actions);var _CurrentUser=require('../Stores/CurrentUser');var _CurrentUser2=_interopRequireDefault(_CurrentUser);var _LoginForm=require('./LoginForm');var _LoginForm2=_interopRequireDefault(_LoginForm);var _UserMenu=require('./UserMenu');var _UserMenu2=_interopRequireDefault(_UserMenu);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var UserNav=function(_React$Component){_inherits(UserNav,_React$Component);function UserNav(props){_classCallCheck(this,UserNav);var _this=_possibleConstructorReturn(this,(UserNav.__proto__||Object.getPrototypeOf(UserNav)).call(this,props));_this.state={loading:true,user:{}};return _this;}_createClass(UserNav,[{key:'componentWillMount',value:function componentWillMount(){var _this2=this;this.stopListening=_CurrentUser2.default.listen(this._onUserChange.bind(this));this.stopAuthListen=_Actions2.default.noauth.listen(function(){return _this2.setState({loading:false});});this.setState({user:_CurrentUser2.default.get()});}},{key:'componentWillUnmount',value:function componentWillUnmount(){this.stopListening();this.stopAuthListen();}},{key:'renderLoginForm',value:function renderLoginForm(){return _react2.default.createElement(_LoginForm2.default,null);}},{key:'renderUserMenu',value:function renderUserMenu(){return _react2.default.createElement(_UserMenu2.default,{user:this.state.user});}},{key:'render',value:function render(){if(this.state.loading){return null;}return _react2.default.createElement('div',{style:styles.container},this.state.user.id?this.renderUserMenu():this.renderLoginForm());}},{key:'_onUserChange',value:function _onUserChange(user){this.setState({user:user,loading:false});}}]);return UserNav;}(_react2.default.Component);UserNav.propTypes={};UserNav.defaultProps={};exports.default=UserNav;var styles={container:{height:'56px'},username:{margin:3,lineHeight:'44px',color:'white'}};

},{"../Stores/CurrentUser":12,"../Utils/Actions":13,"./LoginForm":8,"./UserMenu":10,"react":"react"}]