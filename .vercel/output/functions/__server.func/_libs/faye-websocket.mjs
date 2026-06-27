import require$$1 from "net";
import require$$2$1 from "tls";
import { g as getDefaultExportFromCjs } from "./react.mjs";
import require$$0$1 from "util";
import { r as requireDriver, a as requireHeaders } from "./websocket-driver.mjs";
import require$$0 from "stream";
import require$$2 from "url";
var event;
var hasRequiredEvent;
function requireEvent() {
  if (hasRequiredEvent) return event;
  hasRequiredEvent = 1;
  var Event = function(eventType, options) {
    this.type = eventType;
    for (var key in options)
      this[key] = options[key];
  };
  Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
    this.type = eventType;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
  };
  Event.prototype.stopPropagation = function() {
  };
  Event.prototype.preventDefault = function() {
  };
  Event.CAPTURING_PHASE = 1;
  Event.AT_TARGET = 2;
  Event.BUBBLING_PHASE = 3;
  event = Event;
  return event;
}
var event_target;
var hasRequiredEvent_target;
function requireEvent_target() {
  if (hasRequiredEvent_target) return event_target;
  hasRequiredEvent_target = 1;
  var Event = requireEvent();
  var EventTarget = {
    onopen: null,
    onmessage: null,
    onerror: null,
    onclose: null,
    addEventListener: function(eventType, listener, useCapture) {
      this.on(eventType, listener);
    },
    removeEventListener: function(eventType, listener, useCapture) {
      this.removeListener(eventType, listener);
    },
    dispatchEvent: function(event2) {
      event2.target = event2.currentTarget = this;
      event2.eventPhase = Event.AT_TARGET;
      if (this["on" + event2.type])
        this["on" + event2.type](event2);
      this.emit(event2.type, event2);
    }
  };
  event_target = EventTarget;
  return event_target;
}
var api;
var hasRequiredApi;
function requireApi() {
  if (hasRequiredApi) return api;
  hasRequiredApi = 1;
  var Stream = require$$0.Stream, util = require$$0$1, driver = requireDriver(), EventTarget = requireEvent_target(), Event = requireEvent();
  var API = function(options) {
    options = options || {};
    driver.validateOptions(options, ["headers", "extensions", "maxLength", "ping", "proxy", "tls", "ca"]);
    this.readable = this.writable = true;
    var headers = options.headers;
    if (headers) {
      for (var name in headers) this._driver.setHeader(name, headers[name]);
    }
    var extensions = options.extensions;
    if (extensions) {
      [].concat(extensions).forEach(this._driver.addExtension, this._driver);
    }
    this._ping = options.ping;
    this._pingId = 0;
    this.readyState = API.CONNECTING;
    this.bufferedAmount = 0;
    this.protocol = "";
    this.url = this._driver.url;
    this.version = this._driver.version;
    var self = this;
    this._driver.on("open", function(e) {
      self._open();
    });
    this._driver.on("message", function(e) {
      self._receiveMessage(e.data);
    });
    this._driver.on("close", function(e) {
      self._beginClose(e.reason, e.code);
    });
    this._driver.on("error", function(error) {
      self._emitError(error.message);
    });
    this.on("error", function() {
    });
    this._driver.messages.on("drain", function() {
      self.emit("drain");
    });
    if (this._ping)
      this._pingTimer = setInterval(function() {
        self._pingId += 1;
        self.ping(self._pingId.toString());
      }, this._ping * 1e3);
    this._configureStream();
    if (!this._proxy) {
      this._stream.pipe(this._driver.io);
      this._driver.io.pipe(this._stream);
    }
  };
  util.inherits(API, Stream);
  API.CONNECTING = 0;
  API.OPEN = 1;
  API.CLOSING = 2;
  API.CLOSED = 3;
  API.CLOSE_TIMEOUT = 3e4;
  var instance = {
    write: function(data) {
      return this.send(data);
    },
    end: function(data) {
      if (data !== void 0) this.send(data);
      this.close();
    },
    pause: function() {
      return this._driver.messages.pause();
    },
    resume: function() {
      return this._driver.messages.resume();
    },
    send: function(data) {
      if (this.readyState > API.OPEN) return false;
      if (!(data instanceof Buffer)) data = String(data);
      return this._driver.messages.write(data);
    },
    ping: function(message, callback) {
      if (this.readyState > API.OPEN) return false;
      return this._driver.ping(message, callback);
    },
    close: function(code, reason) {
      if (code === void 0) code = 1e3;
      if (reason === void 0) reason = "";
      if (code !== 1e3 && (code < 3e3 || code > 4999))
        throw new Error("Failed to execute 'close' on WebSocket: The code must be either 1000, or between 3000 and 4999. " + code + " is neither.");
      if (this.readyState < API.CLOSING) {
        var self = this;
        this._closeTimer = setTimeout(function() {
          self._beginClose("", 1006);
        }, API.CLOSE_TIMEOUT);
      }
      if (this.readyState !== API.CLOSED) this.readyState = API.CLOSING;
      this._driver.close(reason, code);
    },
    _configureStream: function() {
      var self = this;
      this._stream.setTimeout(0);
      this._stream.setNoDelay(true);
      ["close", "end"].forEach(function(event2) {
        this._stream.on(event2, function() {
          self._finalizeClose();
        });
      }, this);
      this._stream.on("error", function(error) {
        self._emitError("Network error: " + self.url + ": " + error.message);
        self._finalizeClose();
      });
    },
    _open: function() {
      if (this.readyState !== API.CONNECTING) return;
      this.readyState = API.OPEN;
      this.protocol = this._driver.protocol || "";
      var event2 = new Event("open");
      event2.initEvent("open", false, false);
      this.dispatchEvent(event2);
    },
    _receiveMessage: function(data) {
      if (this.readyState > API.OPEN) return false;
      if (this.readable) this.emit("data", data);
      var event2 = new Event("message", { data });
      event2.initEvent("message", false, false);
      this.dispatchEvent(event2);
    },
    _emitError: function(message) {
      if (this.readyState >= API.CLOSING) return;
      var event2 = new Event("error", { message });
      event2.initEvent("error", false, false);
      this.dispatchEvent(event2);
    },
    _beginClose: function(reason, code) {
      if (this.readyState === API.CLOSED) return;
      this.readyState = API.CLOSING;
      this._closeParams = [reason, code];
      if (this._stream) {
        this._stream.destroy();
        if (!this._stream.readable) this._finalizeClose();
      }
    },
    _finalizeClose: function() {
      if (this.readyState === API.CLOSED) return;
      this.readyState = API.CLOSED;
      if (this._closeTimer) clearTimeout(this._closeTimer);
      if (this._pingTimer) clearInterval(this._pingTimer);
      if (this._stream) this._stream.end();
      if (this.readable) this.emit("end");
      this.readable = this.writable = false;
      var reason = this._closeParams ? this._closeParams[0] : "", code = this._closeParams ? this._closeParams[1] : 1006;
      var event2 = new Event("close", { code, reason });
      event2.initEvent("close", false, false);
      this.dispatchEvent(event2);
    }
  };
  for (var method in instance) API.prototype[method] = instance[method];
  for (var key in EventTarget) API.prototype[key] = EventTarget[key];
  api = API;
  return api;
}
var client;
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client;
  hasRequiredClient = 1;
  var util = require$$0$1, net = require$$1, tls = require$$2$1, url = require$$2, driver = requireDriver(), API = requireApi();
  requireEvent();
  var DEFAULT_PORTS = { "http:": 80, "https:": 443, "ws:": 80, "wss:": 443 }, SECURE_PROTOCOLS = ["https:", "wss:"];
  var Client = function(_url, protocols, options) {
    options = options || {};
    this.url = _url;
    this._driver = driver.client(this.url, { maxLength: options.maxLength, protocols });
    ["open", "error"].forEach(function(event2) {
      this._driver.on(event2, function() {
        self.headers = self._driver.headers;
        self.statusCode = self._driver.statusCode;
      });
    }, this);
    var proxy = options.proxy || {}, endpoint = url.parse(proxy.origin || this.url), port = endpoint.port || DEFAULT_PORTS[endpoint.protocol], secure = SECURE_PROTOCOLS.indexOf(endpoint.protocol) >= 0, onConnect = function() {
      self._onConnect();
    }, netOptions = options.net || {}, originTLS = options.tls || {}, socketTLS = proxy.origin ? proxy.tls || {} : originTLS, self = this;
    netOptions.host = socketTLS.host = endpoint.hostname;
    netOptions.port = socketTLS.port = port;
    originTLS.ca = originTLS.ca || options.ca;
    socketTLS.servername = socketTLS.servername || endpoint.hostname;
    this._stream = secure ? tls.connect(socketTLS, onConnect) : net.connect(netOptions, onConnect);
    if (proxy.origin) this._configureProxy(proxy, originTLS);
    API.call(this, options);
  };
  util.inherits(Client, API);
  Client.prototype._onConnect = function() {
    var worker = this._proxy || this._driver;
    worker.start();
  };
  Client.prototype._configureProxy = function(proxy, originTLS) {
    var uri = url.parse(this.url), secure = SECURE_PROTOCOLS.indexOf(uri.protocol) >= 0, self = this, name;
    this._proxy = this._driver.proxy(proxy.origin);
    if (proxy.headers) {
      for (name in proxy.headers) this._proxy.setHeader(name, proxy.headers[name]);
    }
    this._proxy.pipe(this._stream, { end: false });
    this._stream.pipe(this._proxy);
    this._proxy.on("connect", function() {
      if (secure) {
        var options = { socket: self._stream, servername: uri.hostname };
        for (name in originTLS) options[name] = originTLS[name];
        self._stream = tls.connect(options);
        self._configureStream();
      }
      self._driver.io.pipe(self._stream);
      self._stream.pipe(self._driver.io);
      self._driver.start();
    });
    this._proxy.on("error", function(error) {
      self._driver.emit("error", error);
    });
  };
  client = Client;
  return client;
}
var eventsource;
var hasRequiredEventsource;
function requireEventsource() {
  if (hasRequiredEventsource) return eventsource;
  hasRequiredEventsource = 1;
  var Stream = require$$0.Stream, util = require$$0$1, driver = requireDriver(), Headers = requireHeaders(), API = requireApi(), EventTarget = requireEvent_target(), Event = requireEvent();
  var EventSource = function(request, response, options) {
    this.writable = true;
    options = options || {};
    this._stream = response.socket;
    this._ping = options.ping || this.DEFAULT_PING;
    this._retry = options.retry || this.DEFAULT_RETRY;
    var scheme = driver.isSecureRequest(request) ? "https:" : "http:";
    this.url = scheme + "//" + request.headers.host + request.url;
    this.lastEventId = request.headers["last-event-id"] || "";
    this.readyState = API.CONNECTING;
    var headers = new Headers(), self = this;
    if (options.headers) {
      for (var key2 in options.headers) headers.set(key2, options.headers[key2]);
    }
    if (!this._stream || !this._stream.writable) return;
    process.nextTick(function() {
      self._open();
    });
    this._stream.setTimeout(0);
    this._stream.setNoDelay(true);
    var handshake = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nCache-Control: no-cache, no-store\r\nConnection: close\r\n" + headers.toString() + "\r\nretry: " + Math.floor(this._retry * 1e3) + "\r\n\r\n";
    this._write(handshake);
    this._stream.on("drain", function() {
      self.emit("drain");
    });
    if (this._ping)
      this._pingTimer = setInterval(function() {
        self.ping();
      }, this._ping * 1e3);
    ["error", "end"].forEach(function(event2) {
      self._stream.on(event2, function() {
        self.close();
      });
    });
  };
  util.inherits(EventSource, Stream);
  EventSource.isEventSource = function(request) {
    if (request.method !== "GET") return false;
    var accept = (request.headers.accept || "").split(/\s*,\s*/);
    return accept.indexOf("text/event-stream") >= 0;
  };
  var instance = {
    DEFAULT_PING: 10,
    DEFAULT_RETRY: 5,
    _write: function(chunk) {
      if (!this.writable) return false;
      try {
        return this._stream.write(chunk, "utf8");
      } catch (e) {
        return false;
      }
    },
    _open: function() {
      if (this.readyState !== API.CONNECTING) return;
      this.readyState = API.OPEN;
      var event2 = new Event("open");
      event2.initEvent("open", false, false);
      this.dispatchEvent(event2);
    },
    write: function(message) {
      return this.send(message);
    },
    end: function(message) {
      if (message !== void 0) this.write(message);
      this.close();
    },
    send: function(message, options) {
      if (this.readyState > API.OPEN) return false;
      message = String(message).replace(/(\r\n|\r|\n)/g, "$1data: ");
      options = options || {};
      var frame = "";
      if (options.event) frame += "event: " + options.event + "\r\n";
      if (options.id) frame += "id: " + options.id + "\r\n";
      frame += "data: " + message + "\r\n\r\n";
      return this._write(frame);
    },
    ping: function() {
      return this._write(":\r\n\r\n");
    },
    close: function() {
      if (this.readyState > API.OPEN) return false;
      this.readyState = API.CLOSED;
      this.writable = false;
      if (this._pingTimer) clearInterval(this._pingTimer);
      if (this._stream) this._stream.end();
      var event2 = new Event("close");
      event2.initEvent("close", false, false);
      this.dispatchEvent(event2);
      return true;
    }
  };
  for (var method in instance) EventSource.prototype[method] = instance[method];
  for (var key in EventTarget) EventSource.prototype[key] = EventTarget[key];
  eventsource = EventSource;
  return eventsource;
}
var websocket;
var hasRequiredWebsocket;
function requireWebsocket() {
  if (hasRequiredWebsocket) return websocket;
  hasRequiredWebsocket = 1;
  var util = require$$0$1, driver = requireDriver(), API = requireApi();
  var WebSocket = function(request, socket, body, protocols, options) {
    options = options || {};
    this._stream = socket;
    this._driver = driver.http(request, { maxLength: options.maxLength, protocols });
    var self = this;
    if (!this._stream || !this._stream.writable) return;
    if (!this._stream.readable) return this._stream.end();
    var catchup = function() {
      self._stream.removeListener("data", catchup);
    };
    this._stream.on("data", catchup);
    API.call(this, options);
    process.nextTick(function() {
      self._driver.start();
      self._driver.io.write(body);
    });
  };
  util.inherits(WebSocket, API);
  WebSocket.isWebSocket = function(request) {
    return driver.isWebSocket(request);
  };
  WebSocket.validateOptions = function(options, validKeys) {
    driver.validateOptions(options, validKeys);
  };
  WebSocket.WebSocket = WebSocket;
  WebSocket.Client = requireClient();
  WebSocket.EventSource = requireEventsource();
  websocket = WebSocket;
  return websocket;
}
var websocketExports = requireWebsocket();
const Websocket = /* @__PURE__ */ getDefaultExportFromCjs(websocketExports);
export {
  Websocket as W
};
