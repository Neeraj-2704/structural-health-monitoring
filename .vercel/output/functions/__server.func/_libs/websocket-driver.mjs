import require$$1 from "events";
import require$$2 from "url";
import { r as requireSafeBuffer } from "./safe-buffer.mjs";
import require$$0$1 from "util";
import require$$0 from "stream";
import require$$1$1 from "crypto";
import { r as requireHttpParser } from "./http-parser-js.mjs";
import { r as requireWebsocket_extensions } from "./websocket-extensions.mjs";
var streams = {};
var hasRequiredStreams;
function requireStreams() {
  if (hasRequiredStreams) return streams;
  hasRequiredStreams = 1;
  var Stream = require$$0.Stream, util = require$$0$1;
  var IO = function(driver2) {
    this.readable = this.writable = true;
    this._paused = false;
    this._driver = driver2;
  };
  util.inherits(IO, Stream);
  IO.prototype.pause = function() {
    this._paused = true;
    this._driver.messages._paused = true;
  };
  IO.prototype.resume = function() {
    this._paused = false;
    this.emit("drain");
    var messages = this._driver.messages;
    messages._paused = false;
    messages.emit("drain");
  };
  IO.prototype.write = function(chunk) {
    if (!this.writable) return false;
    this._driver.parse(chunk);
    return !this._paused;
  };
  IO.prototype.end = function(chunk) {
    if (!this.writable) return;
    if (chunk !== void 0) this.write(chunk);
    this.writable = false;
    var messages = this._driver.messages;
    if (messages.readable) {
      messages.readable = messages.writable = false;
      messages.emit("end");
    }
  };
  IO.prototype.destroy = function() {
    this.end();
  };
  var Messages = function(driver2) {
    this.readable = this.writable = true;
    this._paused = false;
    this._driver = driver2;
  };
  util.inherits(Messages, Stream);
  Messages.prototype.pause = function() {
    this._driver.io._paused = true;
  };
  Messages.prototype.resume = function() {
    this._driver.io._paused = false;
    this._driver.io.emit("drain");
  };
  Messages.prototype.write = function(message2) {
    if (!this.writable) return false;
    if (typeof message2 === "string") this._driver.text(message2);
    else this._driver.binary(message2);
    return !this._paused;
  };
  Messages.prototype.end = function(message2) {
    if (message2 !== void 0) this.write(message2);
  };
  Messages.prototype.destroy = function() {
  };
  streams.IO = IO;
  streams.Messages = Messages;
  return streams;
}
var headers;
var hasRequiredHeaders;
function requireHeaders() {
  if (hasRequiredHeaders) return headers;
  hasRequiredHeaders = 1;
  var Headers = function() {
    this.clear();
  };
  Headers.prototype.ALLOWED_DUPLICATES = ["set-cookie", "set-cookie2", "warning", "www-authenticate"];
  Headers.prototype.clear = function() {
    this._sent = {};
    this._lines = [];
  };
  Headers.prototype.set = function(name, value) {
    if (value === void 0) return;
    name = this._strip(name);
    value = this._strip(value);
    var key = name.toLowerCase();
    if (!this._sent.hasOwnProperty(key) || this.ALLOWED_DUPLICATES.indexOf(key) >= 0) {
      this._sent[key] = true;
      this._lines.push(name + ": " + value + "\r\n");
    }
  };
  Headers.prototype.toString = function() {
    return this._lines.join("");
  };
  Headers.prototype._strip = function(string) {
    return string.toString().replace(/^ */, "").replace(/ *$/, "");
  };
  headers = Headers;
  return headers;
}
var stream_reader;
var hasRequiredStream_reader;
function requireStream_reader() {
  if (hasRequiredStream_reader) return stream_reader;
  hasRequiredStream_reader = 1;
  var Buffer = requireSafeBuffer().Buffer;
  var StreamReader = function() {
    this._queue = [];
    this._queueSize = 0;
    this._offset = 0;
  };
  StreamReader.prototype.put = function(buffer) {
    if (!buffer || buffer.length === 0) return;
    if (!Buffer.isBuffer(buffer)) buffer = Buffer.from(buffer);
    this._queue.push(buffer);
    this._queueSize += buffer.length;
  };
  StreamReader.prototype.read = function(length) {
    if (length > this._queueSize) return null;
    if (length === 0) return Buffer.alloc(0);
    this._queueSize -= length;
    var queue = this._queue, remain = length, first = queue[0], buffers, buffer;
    if (first.length >= length) {
      if (first.length === length) {
        return queue.shift();
      } else {
        buffer = first.slice(0, length);
        queue[0] = first.slice(length);
        return buffer;
      }
    }
    for (var i = 0, n = queue.length; i < n; i++) {
      if (remain < queue[i].length) break;
      remain -= queue[i].length;
    }
    buffers = queue.splice(0, i);
    if (remain > 0 && queue.length > 0) {
      buffers.push(queue[0].slice(0, remain));
      queue[0] = queue[0].slice(remain);
    }
    return Buffer.concat(buffers, length);
  };
  StreamReader.prototype.eachByte = function(callback, context) {
    var buffer, n, index;
    while (this._queue.length > 0) {
      buffer = this._queue[0];
      n = buffer.length;
      while (this._offset < n) {
        index = this._offset;
        this._offset += 1;
        callback.call(context, buffer[index]);
      }
      this._offset = 0;
      this._queue.shift();
    }
  };
  stream_reader = StreamReader;
  return stream_reader;
}
var base;
var hasRequiredBase;
function requireBase() {
  if (hasRequiredBase) return base;
  hasRequiredBase = 1;
  var Buffer = requireSafeBuffer().Buffer, Emitter = require$$1.EventEmitter, util = require$$0$1, streams2 = requireStreams(), Headers = requireHeaders(), Reader = requireStream_reader();
  var Base = function(request, url, options) {
    Emitter.call(this);
    Base.validateOptions(options || {}, ["maxLength", "masking", "requireMasking", "protocols"]);
    this._request = request;
    this._reader = new Reader();
    this._options = options || {};
    this._maxLength = this._options.maxLength || this.MAX_LENGTH;
    this._headers = new Headers();
    this.__queue = [];
    this.readyState = 0;
    this.url = url;
    this.io = new streams2.IO(this);
    this.messages = new streams2.Messages(this);
    this._bindEventListeners();
  };
  util.inherits(Base, Emitter);
  Base.isWebSocket = function(request) {
    var connection = request.headers.connection || "", upgrade = request.headers.upgrade || "";
    return request.method === "GET" && connection.toLowerCase().split(/ *, */).indexOf("upgrade") >= 0 && upgrade.toLowerCase() === "websocket";
  };
  Base.validateOptions = function(options, validKeys) {
    for (var key2 in options) {
      if (validKeys.indexOf(key2) < 0)
        throw new Error("Unrecognized option: " + key2);
    }
  };
  var instance = {
    // This is 64MB, small enough for an average VPS to handle without
    // crashing from process out of memory
    MAX_LENGTH: 67108863,
    STATES: ["connecting", "open", "closing", "closed"],
    _bindEventListeners: function() {
      var self = this;
      this.messages.on("error", function() {
      });
      this.on("message", function(event) {
        var messages = self.messages;
        if (messages.readable) messages.emit("data", event.data);
      });
      this.on("error", function(error) {
        var messages = self.messages;
        if (messages.readable) messages.emit("error", error);
      });
      this.on("close", function() {
        var messages = self.messages;
        if (!messages.readable) return;
        messages.readable = messages.writable = false;
        messages.emit("end");
      });
    },
    getState: function() {
      return this.STATES[this.readyState] || null;
    },
    addExtension: function(extension) {
      return false;
    },
    setHeader: function(name, value) {
      if (this.readyState > 0) return false;
      this._headers.set(name, value);
      return true;
    },
    start: function() {
      if (this.readyState !== 0) return false;
      if (!Base.isWebSocket(this._request))
        return this._failHandshake(new Error("Not a WebSocket request"));
      var response;
      try {
        response = this._handshakeResponse();
      } catch (error) {
        return this._failHandshake(error);
      }
      this._write(response);
      if (this._stage !== -1) this._open();
      return true;
    },
    _failHandshake: function(error) {
      var headers2 = new Headers();
      headers2.set("Content-Type", "text/plain");
      headers2.set("Content-Length", Buffer.byteLength(error.message, "utf8"));
      headers2 = ["HTTP/1.1 400 Bad Request", headers2.toString(), error.message];
      this._write(Buffer.from(headers2.join("\r\n"), "utf8"));
      this._fail("protocol_error", error.message);
      return false;
    },
    text: function(message2) {
      return this.frame(message2);
    },
    binary: function(message2) {
      return false;
    },
    ping: function() {
      return false;
    },
    pong: function() {
      return false;
    },
    close: function(reason, code) {
      if (this.readyState !== 1) return false;
      this.readyState = 3;
      this.emit("close", new Base.CloseEvent(null, null));
      return true;
    },
    _open: function() {
      this.readyState = 1;
      this.__queue.forEach(function(args) {
        this.frame.apply(this, args);
      }, this);
      this.__queue = [];
      this.emit("open", new Base.OpenEvent());
    },
    _queue: function(message2) {
      this.__queue.push(message2);
      return true;
    },
    _write: function(chunk) {
      var io = this.io;
      if (io.readable) io.emit("data", chunk);
    },
    _fail: function(type, message2) {
      this.readyState = 2;
      this.emit("error", new Error(message2));
      this.close();
    }
  };
  for (var key in instance)
    Base.prototype[key] = instance[key];
  Base.ConnectEvent = function() {
  };
  Base.OpenEvent = function() {
  };
  Base.CloseEvent = function(code, reason) {
    this.code = code;
    this.reason = reason;
  };
  Base.MessageEvent = function(data) {
    this.data = data;
  };
  Base.PingEvent = function(data) {
    this.data = data;
  };
  Base.PongEvent = function(data) {
    this.data = data;
  };
  base = Base;
  return base;
}
var http_parser;
var hasRequiredHttp_parser;
function requireHttp_parser() {
  if (hasRequiredHttp_parser) return http_parser;
  hasRequiredHttp_parser = 1;
  var NodeHTTPParser = requireHttpParser().HTTPParser, Buffer = requireSafeBuffer().Buffer;
  var TYPES = {
    request: NodeHTTPParser.REQUEST || "request",
    response: NodeHTTPParser.RESPONSE || "response"
  };
  var HttpParser = function(type) {
    this._type = type;
    this._parser = new NodeHTTPParser(TYPES[type]);
    this._complete = false;
    this.headers = {};
    var current = null, self = this;
    this._parser.onHeaderField = function(b, start, length) {
      current = b.toString("utf8", start, start + length).toLowerCase();
    };
    this._parser.onHeaderValue = function(b, start, length) {
      var value = b.toString("utf8", start, start + length);
      if (self.headers.hasOwnProperty(current))
        self.headers[current] += ", " + value;
      else
        self.headers[current] = value;
    };
    this._parser.onHeadersComplete = this._parser[NodeHTTPParser.kOnHeadersComplete] = function(majorVersion, minorVersion, headers2, method, pathname, statusCode) {
      var info = arguments[0];
      if (typeof info === "object") {
        method = info.method;
        pathname = info.url;
        statusCode = info.statusCode;
        headers2 = info.headers;
      }
      self.method = typeof method === "number" ? HttpParser.METHODS[method] : method;
      self.statusCode = statusCode;
      self.url = pathname;
      if (!headers2) return;
      for (var i = 0, n = headers2.length, key, value; i < n; i += 2) {
        key = headers2[i].toLowerCase();
        value = headers2[i + 1];
        if (self.headers.hasOwnProperty(key))
          self.headers[key] += ", " + value;
        else
          self.headers[key] = value;
      }
      self._complete = true;
    };
  };
  HttpParser.METHODS = {
    0: "DELETE",
    1: "GET",
    2: "HEAD",
    3: "POST",
    4: "PUT",
    5: "CONNECT",
    6: "OPTIONS",
    7: "TRACE",
    8: "COPY",
    9: "LOCK",
    10: "MKCOL",
    11: "MOVE",
    12: "PROPFIND",
    13: "PROPPATCH",
    14: "SEARCH",
    15: "UNLOCK",
    16: "BIND",
    17: "REBIND",
    18: "UNBIND",
    19: "ACL",
    20: "REPORT",
    21: "MKACTIVITY",
    22: "CHECKOUT",
    23: "MERGE",
    24: "M-SEARCH",
    25: "NOTIFY",
    26: "SUBSCRIBE",
    27: "UNSUBSCRIBE",
    28: "PATCH",
    29: "PURGE",
    30: "MKCALENDAR",
    31: "LINK",
    32: "UNLINK"
  };
  var VERSION = process.version ? process.version.match(/[0-9]+/g).map(function(n) {
    return parseInt(n, 10);
  }) : [];
  if (VERSION[0] === 0 && VERSION[1] === 12) {
    HttpParser.METHODS[16] = "REPORT";
    HttpParser.METHODS[17] = "MKACTIVITY";
    HttpParser.METHODS[18] = "CHECKOUT";
    HttpParser.METHODS[19] = "MERGE";
    HttpParser.METHODS[20] = "M-SEARCH";
    HttpParser.METHODS[21] = "NOTIFY";
    HttpParser.METHODS[22] = "SUBSCRIBE";
    HttpParser.METHODS[23] = "UNSUBSCRIBE";
    HttpParser.METHODS[24] = "PATCH";
    HttpParser.METHODS[25] = "PURGE";
  }
  HttpParser.prototype.isComplete = function() {
    return this._complete;
  };
  HttpParser.prototype.parse = function(chunk) {
    var consumed = this._parser.execute(chunk, 0, chunk.length);
    if (typeof consumed !== "number") {
      this.error = consumed;
      this._complete = true;
      return;
    }
    if (this._complete)
      this.body = consumed < chunk.length ? chunk.slice(consumed) : Buffer.alloc(0);
  };
  http_parser = HttpParser;
  return http_parser;
}
var frame;
var hasRequiredFrame;
function requireFrame() {
  if (hasRequiredFrame) return frame;
  hasRequiredFrame = 1;
  var Frame = function() {
  };
  var instance = {
    final: false,
    rsv1: false,
    rsv2: false,
    rsv3: false,
    opcode: null,
    masked: false,
    maskingKey: null,
    lengthBytes: 1,
    length: 0,
    payload: null
  };
  for (var key in instance)
    Frame.prototype[key] = instance[key];
  frame = Frame;
  return frame;
}
var message;
var hasRequiredMessage;
function requireMessage() {
  if (hasRequiredMessage) return message;
  hasRequiredMessage = 1;
  var Buffer = requireSafeBuffer().Buffer;
  var Message = function() {
    this.rsv1 = false;
    this.rsv2 = false;
    this.rsv3 = false;
    this.opcode = null;
    this.length = 0;
    this._chunks = [];
  };
  var instance = {
    read: function() {
      return this.data = this.data || Buffer.concat(this._chunks, this.length);
    },
    pushFrame: function(frame2) {
      this.rsv1 = this.rsv1 || frame2.rsv1;
      this.rsv2 = this.rsv2 || frame2.rsv2;
      this.rsv3 = this.rsv3 || frame2.rsv3;
      if (this.opcode === null) this.opcode = frame2.opcode;
      this._chunks.push(frame2.payload);
      this.length += frame2.length;
    }
  };
  for (var key in instance)
    Message.prototype[key] = instance[key];
  message = Message;
  return message;
}
var hybi;
var hasRequiredHybi;
function requireHybi() {
  if (hasRequiredHybi) return hybi;
  hasRequiredHybi = 1;
  var Buffer = requireSafeBuffer().Buffer, crypto = require$$1$1, util = require$$0$1, Extensions = requireWebsocket_extensions(), Base = requireBase(), Frame = requireFrame(), Message = requireMessage();
  var Hybi = function(request, url, options) {
    Base.apply(this, arguments);
    this._extensions = new Extensions();
    this._stage = 0;
    this._masking = this._options.masking;
    this._protocols = this._options.protocols || [];
    this._requireMasking = this._options.requireMasking;
    this._pingCallbacks = {};
    if (typeof this._protocols === "string")
      this._protocols = this._protocols.split(/ *, */);
    if (!this._request) return;
    var protos = this._request.headers["sec-websocket-protocol"], supported = this._protocols;
    if (protos !== void 0) {
      if (typeof protos === "string") protos = protos.split(/ *, */);
      this.protocol = protos.filter(function(p) {
        return supported.indexOf(p) >= 0;
      })[0];
    }
    this.version = "hybi-" + Hybi.VERSION;
  };
  util.inherits(Hybi, Base);
  Hybi.VERSION = "13";
  Hybi.mask = function(payload, mask, offset) {
    if (!mask || mask.length === 0) return payload;
    offset = offset || 0;
    for (var i = 0, n = payload.length - offset; i < n; i++) {
      payload[offset + i] = payload[offset + i] ^ mask[i % 4];
    }
    return payload;
  };
  Hybi.generateAccept = function(key2) {
    var sha1 = crypto.createHash("sha1");
    sha1.update(key2 + Hybi.GUID);
    return sha1.digest("base64");
  };
  Hybi.GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
  var instance = {
    FIN: 128,
    MASK: 128,
    RSV1: 64,
    RSV2: 32,
    RSV3: 16,
    OPCODE: 15,
    LENGTH: 127,
    OPCODES: {
      continuation: 0,
      text: 1,
      binary: 2,
      close: 8,
      ping: 9,
      pong: 10
    },
    OPCODE_CODES: [0, 1, 2, 8, 9, 10],
    MESSAGE_OPCODES: [0, 1, 2],
    OPENING_OPCODES: [1, 2],
    ERRORS: {
      normal_closure: 1e3,
      going_away: 1001,
      protocol_error: 1002,
      unacceptable: 1003,
      encoding_error: 1007,
      policy_violation: 1008,
      too_large: 1009,
      extension_error: 1010,
      unexpected_condition: 1011
    },
    ERROR_CODES: [1e3, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011],
    DEFAULT_ERROR_CODE: 1e3,
    MIN_RESERVED_ERROR: 3e3,
    MAX_RESERVED_ERROR: 4999,
    // http://www.w3.org/International/questions/qa-forms-utf-8.en.php
    UTF8_MATCH: /^([\x00-\x7F]|[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|\xF0[\x90-\xBF][\x80-\xBF]{2}|[\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2})*$/,
    addExtension: function(extension) {
      this._extensions.add(extension);
      return true;
    },
    parse: function(chunk) {
      this._reader.put(chunk);
      var buffer = true;
      while (buffer) {
        switch (this._stage) {
          case 0:
            buffer = this._reader.read(1);
            if (buffer) this._parseOpcode(buffer[0]);
            break;
          case 1:
            buffer = this._reader.read(1);
            if (buffer) this._parseLength(buffer[0]);
            break;
          case 2:
            buffer = this._reader.read(this._frame.lengthBytes);
            if (buffer) this._parseExtendedLength(buffer);
            break;
          case 3:
            buffer = this._reader.read(4);
            if (buffer) {
              this._stage = 4;
              this._frame.maskingKey = buffer;
            }
            break;
          case 4:
            buffer = this._reader.read(this._frame.length);
            if (buffer) {
              this._stage = 0;
              this._emitFrame(buffer);
            }
            break;
          default:
            buffer = null;
        }
      }
    },
    text: function(message2) {
      if (this.readyState > 1) return false;
      return this.frame(message2, "text");
    },
    binary: function(message2) {
      if (this.readyState > 1) return false;
      return this.frame(message2, "binary");
    },
    ping: function(message2, callback) {
      if (this.readyState > 1) return false;
      message2 = message2 || "";
      if (callback) this._pingCallbacks[message2] = callback;
      return this.frame(message2, "ping");
    },
    pong: function(message2) {
      if (this.readyState > 1) return false;
      message2 = message2 || "";
      return this.frame(message2, "pong");
    },
    close: function(reason, code) {
      reason = reason || "";
      code = code || this.ERRORS.normal_closure;
      if (this.readyState <= 0) {
        this.readyState = 3;
        this.emit("close", new Base.CloseEvent(code, reason));
        return true;
      } else if (this.readyState === 1) {
        this.readyState = 2;
        this._extensions.close(function() {
          this.frame(reason, "close", code);
        }, this);
        return true;
      } else {
        return false;
      }
    },
    frame: function(buffer, type, code) {
      if (this.readyState <= 0) return this._queue([buffer, type, code]);
      if (this.readyState > 2) return false;
      if (buffer instanceof Array) buffer = Buffer.from(buffer);
      if (typeof buffer === "number") buffer = buffer.toString();
      var message2 = new Message(), isText = typeof buffer === "string", payload, copy;
      message2.rsv1 = message2.rsv2 = message2.rsv3 = false;
      message2.opcode = this.OPCODES[type || (isText ? "text" : "binary")];
      payload = isText ? Buffer.from(buffer, "utf8") : buffer;
      if (code) {
        copy = payload;
        payload = Buffer.allocUnsafe(2 + copy.length);
        payload.writeUInt16BE(code, 0);
        copy.copy(payload, 2);
      }
      message2.data = payload;
      var onMessageReady = function(message3) {
        var frame2 = new Frame();
        frame2.final = true;
        frame2.rsv1 = message3.rsv1;
        frame2.rsv2 = message3.rsv2;
        frame2.rsv3 = message3.rsv3;
        frame2.opcode = message3.opcode;
        frame2.masked = !!this._masking;
        frame2.length = message3.data.length;
        frame2.payload = message3.data;
        if (frame2.masked) frame2.maskingKey = crypto.randomBytes(4);
        this._sendFrame(frame2);
      };
      if (this.MESSAGE_OPCODES.indexOf(message2.opcode) >= 0)
        this._extensions.processOutgoingMessage(message2, function(error, message3) {
          if (error) return this._fail("extension_error", error.message);
          onMessageReady.call(this, message3);
        }, this);
      else
        onMessageReady.call(this, message2);
      return true;
    },
    _sendFrame: function(frame2) {
      var length = frame2.length, header = length <= 125 ? 2 : length <= 65535 ? 4 : 10, offset = header + (frame2.masked ? 4 : 0), buffer = Buffer.allocUnsafe(offset + length), masked = frame2.masked ? this.MASK : 0;
      buffer[0] = (frame2.final ? this.FIN : 0) | (frame2.rsv1 ? this.RSV1 : 0) | (frame2.rsv2 ? this.RSV2 : 0) | (frame2.rsv3 ? this.RSV3 : 0) | frame2.opcode;
      if (length <= 125) {
        buffer[1] = masked | length;
      } else if (length <= 65535) {
        buffer[1] = masked | 126;
        buffer.writeUInt16BE(length, 2);
      } else {
        buffer[1] = masked | 127;
        buffer.writeUInt32BE(Math.floor(length / 4294967296), 2);
        buffer.writeUInt32BE(length % 4294967296, 6);
      }
      frame2.payload.copy(buffer, offset);
      if (frame2.masked) {
        frame2.maskingKey.copy(buffer, header);
        Hybi.mask(buffer, frame2.maskingKey, offset);
      }
      this._write(buffer);
    },
    _handshakeResponse: function() {
      var secKey = this._request.headers["sec-websocket-key"], version = this._request.headers["sec-websocket-version"];
      if (version !== Hybi.VERSION)
        throw new Error("Unsupported WebSocket version: " + version);
      if (typeof secKey !== "string")
        throw new Error("Missing handshake request header: Sec-WebSocket-Key");
      this._headers.set("Upgrade", "websocket");
      this._headers.set("Connection", "Upgrade");
      this._headers.set("Sec-WebSocket-Accept", Hybi.generateAccept(secKey));
      if (this.protocol) this._headers.set("Sec-WebSocket-Protocol", this.protocol);
      var extensions = this._extensions.generateResponse(this._request.headers["sec-websocket-extensions"]);
      if (extensions) this._headers.set("Sec-WebSocket-Extensions", extensions);
      var start = "HTTP/1.1 101 Switching Protocols", headers2 = [start, this._headers.toString(), ""];
      return Buffer.from(headers2.join("\r\n"), "utf8");
    },
    _shutdown: function(code, reason, error) {
      delete this._frame;
      delete this._message;
      this._stage = 5;
      var sendCloseFrame = this.readyState === 1;
      this.readyState = 2;
      this._extensions.close(function() {
        if (sendCloseFrame) this.frame(reason, "close", code);
        this.readyState = 3;
        if (error) this.emit("error", new Error(reason));
        this.emit("close", new Base.CloseEvent(code, reason));
      }, this);
    },
    _fail: function(type, message2) {
      if (this.readyState > 1) return;
      this._shutdown(this.ERRORS[type], message2, true);
    },
    _parseOpcode: function(octet) {
      var rsvs = [this.RSV1, this.RSV2, this.RSV3].map(function(rsv) {
        return (octet & rsv) === rsv;
      });
      var frame2 = this._frame = new Frame();
      frame2.final = (octet & this.FIN) === this.FIN;
      frame2.rsv1 = rsvs[0];
      frame2.rsv2 = rsvs[1];
      frame2.rsv3 = rsvs[2];
      frame2.opcode = octet & this.OPCODE;
      this._stage = 1;
      if (!this._extensions.validFrameRsv(frame2))
        return this._fail(
          "protocol_error",
          "One or more reserved bits are on: reserved1 = " + (frame2.rsv1 ? 1 : 0) + ", reserved2 = " + (frame2.rsv2 ? 1 : 0) + ", reserved3 = " + (frame2.rsv3 ? 1 : 0)
        );
      if (this.OPCODE_CODES.indexOf(frame2.opcode) < 0)
        return this._fail("protocol_error", "Unrecognized frame opcode: " + frame2.opcode);
      if (this.MESSAGE_OPCODES.indexOf(frame2.opcode) < 0 && !frame2.final)
        return this._fail("protocol_error", "Received fragmented control frame: opcode = " + frame2.opcode);
      if (this._message && this.OPENING_OPCODES.indexOf(frame2.opcode) >= 0)
        return this._fail("protocol_error", "Received new data frame but previous continuous frame is unfinished");
    },
    _parseLength: function(octet) {
      var frame2 = this._frame;
      frame2.masked = (octet & this.MASK) === this.MASK;
      frame2.length = octet & this.LENGTH;
      if (frame2.length >= 0 && frame2.length <= 125) {
        this._stage = frame2.masked ? 3 : 4;
        if (!this._checkFrameLength()) return;
      } else {
        this._stage = 2;
        frame2.lengthBytes = frame2.length === 126 ? 2 : 8;
      }
      if (this._requireMasking && !frame2.masked)
        return this._fail("unacceptable", "Received unmasked frame but masking is required");
    },
    _parseExtendedLength: function(buffer) {
      var frame2 = this._frame;
      frame2.length = this._readUInt(buffer);
      this._stage = frame2.masked ? 3 : 4;
      if (this.MESSAGE_OPCODES.indexOf(frame2.opcode) < 0 && frame2.length > 125)
        return this._fail("protocol_error", "Received control frame having too long payload: " + frame2.length);
      if (!this._checkFrameLength()) return;
    },
    _checkFrameLength: function() {
      var length = this._message ? this._message.length : 0;
      if (length + this._frame.length > this._maxLength) {
        this._fail("too_large", "WebSocket frame length too large");
        return false;
      } else {
        return true;
      }
    },
    _emitFrame: function(buffer) {
      var frame2 = this._frame, payload = frame2.payload = Hybi.mask(buffer, frame2.maskingKey), opcode = frame2.opcode, message2, code, reason, callbacks, callback;
      delete this._frame;
      if (opcode === this.OPCODES.continuation) {
        if (!this._message) return this._fail("protocol_error", "Received unexpected continuation frame");
        this._message.pushFrame(frame2);
      }
      if (opcode === this.OPCODES.text || opcode === this.OPCODES.binary) {
        this._message = new Message();
        this._message.pushFrame(frame2);
      }
      if (frame2.final && this.MESSAGE_OPCODES.indexOf(opcode) >= 0)
        return this._emitMessage(this._message);
      if (opcode === this.OPCODES.close) {
        code = payload.length >= 2 ? payload.readUInt16BE(0) : null;
        reason = payload.length > 2 ? this._encode(payload.slice(2)) : null;
        if (!(payload.length === 0) && !(code !== null && code >= this.MIN_RESERVED_ERROR && code <= this.MAX_RESERVED_ERROR) && this.ERROR_CODES.indexOf(code) < 0)
          code = this.ERRORS.protocol_error;
        if (payload.length > 125 || payload.length > 2 && !reason)
          code = this.ERRORS.protocol_error;
        this._shutdown(code || this.DEFAULT_ERROR_CODE, reason || "");
      }
      if (opcode === this.OPCODES.ping) {
        this.frame(payload, "pong");
        this.emit("ping", new Base.PingEvent(payload.toString()));
      }
      if (opcode === this.OPCODES.pong) {
        callbacks = this._pingCallbacks;
        message2 = this._encode(payload);
        callback = callbacks[message2];
        delete callbacks[message2];
        if (callback) callback();
        this.emit("pong", new Base.PongEvent(payload.toString()));
      }
    },
    _emitMessage: function(message2) {
      var message2 = this._message;
      message2.read();
      delete this._message;
      this._extensions.processIncomingMessage(message2, function(error, message3) {
        if (error) return this._fail("extension_error", error.message);
        var payload = message3.data;
        if (payload.length > this._maxLength)
          return this._fail("too_large", "WebSocket frame length too large");
        if (message3.opcode === this.OPCODES.text)
          payload = this._encode(payload);
        if (payload === null)
          return this._fail("encoding_error", "Could not decode a text frame as UTF-8");
        else
          this.emit("message", new Base.MessageEvent(payload));
      }, this);
    },
    _encode: function(buffer) {
      try {
        var string = buffer.toString("binary", 0, buffer.length);
        if (!this.UTF8_MATCH.test(string)) return null;
      } catch (e) {
      }
      return buffer.toString("utf8", 0, buffer.length);
    },
    _readUInt: function(buffer) {
      if (buffer.length === 2) return buffer.readUInt16BE(0);
      return buffer.readUInt32BE(0) * 4294967296 + buffer.readUInt32BE(4);
    }
  };
  for (var key in instance)
    Hybi.prototype[key] = instance[key];
  hybi = Hybi;
  return hybi;
}
var proxy;
var hasRequiredProxy;
function requireProxy() {
  if (hasRequiredProxy) return proxy;
  hasRequiredProxy = 1;
  var Buffer = requireSafeBuffer().Buffer, Stream = require$$0.Stream, url = require$$2, util = require$$0$1, Base = requireBase(), Headers = requireHeaders(), HttpParser = requireHttp_parser();
  var PORTS = { "ws:": 80, "wss:": 443 };
  var Proxy = function(client2, origin, options) {
    this._client = client2;
    this._http = new HttpParser("response");
    this._origin = typeof client2.url === "object" ? client2.url : url.parse(client2.url);
    this._url = typeof origin === "object" ? origin : url.parse(origin);
    this._options = options || {};
    this._state = 0;
    this.readable = this.writable = true;
    this._paused = false;
    this._headers = new Headers();
    this._headers.set("Host", this._origin.host);
    this._headers.set("Connection", "keep-alive");
    this._headers.set("Proxy-Connection", "keep-alive");
    var auth = this._url.auth && Buffer.from(this._url.auth, "utf8").toString("base64");
    if (auth) this._headers.set("Proxy-Authorization", "Basic " + auth);
  };
  util.inherits(Proxy, Stream);
  var instance = {
    setHeader: function(name, value) {
      if (this._state !== 0) return false;
      this._headers.set(name, value);
      return true;
    },
    start: function() {
      if (this._state !== 0) return false;
      this._state = 1;
      var origin = this._origin, port = origin.port || PORTS[origin.protocol], start = "CONNECT " + origin.hostname + ":" + port + " HTTP/1.1";
      var headers2 = [start, this._headers.toString(), ""];
      this.emit("data", Buffer.from(headers2.join("\r\n"), "utf8"));
      return true;
    },
    pause: function() {
      this._paused = true;
    },
    resume: function() {
      this._paused = false;
      this.emit("drain");
    },
    write: function(chunk) {
      if (!this.writable) return false;
      this._http.parse(chunk);
      if (!this._http.isComplete()) return !this._paused;
      this.statusCode = this._http.statusCode;
      this.headers = this._http.headers;
      if (this.statusCode === 200) {
        this.emit("connect", new Base.ConnectEvent());
      } else {
        var message2 = "Can't establish a connection to the server at " + this._origin.href;
        this.emit("error", new Error(message2));
      }
      this.end();
      return !this._paused;
    },
    end: function(chunk) {
      if (!this.writable) return;
      if (chunk !== void 0) this.write(chunk);
      this.readable = this.writable = false;
      this.emit("close");
      this.emit("end");
    },
    destroy: function() {
      this.end();
    }
  };
  for (var key in instance)
    Proxy.prototype[key] = instance[key];
  proxy = Proxy;
  return proxy;
}
var client;
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client;
  hasRequiredClient = 1;
  var Buffer = requireSafeBuffer().Buffer, crypto = require$$1$1, url = require$$2, util = require$$0$1, HttpParser = requireHttp_parser(), Base = requireBase(), Hybi = requireHybi(), Proxy = requireProxy();
  var Client = function(_url, options) {
    this.version = "hybi-" + Hybi.VERSION;
    Hybi.call(this, null, _url, options);
    this.readyState = -1;
    this._key = Client.generateKey();
    this._accept = Hybi.generateAccept(this._key);
    this._http = new HttpParser("response");
    var uri = url.parse(this.url), auth = uri.auth && Buffer.from(uri.auth, "utf8").toString("base64");
    if (this.VALID_PROTOCOLS.indexOf(uri.protocol) < 0)
      throw new Error(this.url + " is not a valid WebSocket URL");
    this._pathname = (uri.pathname || "/") + (uri.search || "");
    this._headers.set("Host", uri.host);
    this._headers.set("Upgrade", "websocket");
    this._headers.set("Connection", "Upgrade");
    this._headers.set("Sec-WebSocket-Key", this._key);
    this._headers.set("Sec-WebSocket-Version", Hybi.VERSION);
    if (this._protocols.length > 0)
      this._headers.set("Sec-WebSocket-Protocol", this._protocols.join(", "));
    if (auth)
      this._headers.set("Authorization", "Basic " + auth);
  };
  util.inherits(Client, Hybi);
  Client.generateKey = function() {
    return crypto.randomBytes(16).toString("base64");
  };
  var instance = {
    VALID_PROTOCOLS: ["ws:", "wss:"],
    proxy: function(origin, options) {
      return new Proxy(this, origin, options);
    },
    start: function() {
      if (this.readyState !== -1) return false;
      this._write(this._handshakeRequest());
      this.readyState = 0;
      return true;
    },
    parse: function(chunk) {
      if (this.readyState === 3) return;
      if (this.readyState > 0) return Hybi.prototype.parse.call(this, chunk);
      this._http.parse(chunk);
      if (!this._http.isComplete()) return;
      this._validateHandshake();
      if (this.readyState === 3) return;
      this._open();
      this.parse(this._http.body);
    },
    _handshakeRequest: function() {
      var extensions = this._extensions.generateOffer();
      if (extensions)
        this._headers.set("Sec-WebSocket-Extensions", extensions);
      var start = "GET " + this._pathname + " HTTP/1.1", headers2 = [start, this._headers.toString(), ""];
      return Buffer.from(headers2.join("\r\n"), "utf8");
    },
    _failHandshake: function(message2) {
      message2 = "Error during WebSocket handshake: " + message2;
      this.readyState = 3;
      this.emit("error", new Error(message2));
      this.emit("close", new Base.CloseEvent(this.ERRORS.protocol_error, message2));
    },
    _validateHandshake: function() {
      this.statusCode = this._http.statusCode;
      this.headers = this._http.headers;
      if (this._http.error)
        return this._failHandshake(this._http.error.message);
      if (this._http.statusCode !== 101)
        return this._failHandshake("Unexpected response code: " + this._http.statusCode);
      var headers2 = this._http.headers, upgrade = headers2["upgrade"] || "", connection = headers2["connection"] || "", accept = headers2["sec-websocket-accept"] || "", protocol = headers2["sec-websocket-protocol"] || "";
      if (upgrade === "")
        return this._failHandshake("'Upgrade' header is missing");
      if (upgrade.toLowerCase() !== "websocket")
        return this._failHandshake("'Upgrade' header value is not 'WebSocket'");
      if (connection === "")
        return this._failHandshake("'Connection' header is missing");
      if (connection.toLowerCase() !== "upgrade")
        return this._failHandshake("'Connection' header value is not 'Upgrade'");
      if (accept !== this._accept)
        return this._failHandshake("Sec-WebSocket-Accept mismatch");
      this.protocol = null;
      if (protocol !== "") {
        if (this._protocols.indexOf(protocol) < 0)
          return this._failHandshake("Sec-WebSocket-Protocol mismatch");
        else
          this.protocol = protocol;
      }
      try {
        this._extensions.activate(this.headers["sec-websocket-extensions"]);
      } catch (e) {
        return this._failHandshake(e.message);
      }
    }
  };
  for (var key in instance)
    Client.prototype[key] = instance[key];
  client = Client;
  return client;
}
var draft75;
var hasRequiredDraft75;
function requireDraft75() {
  if (hasRequiredDraft75) return draft75;
  hasRequiredDraft75 = 1;
  var Buffer = requireSafeBuffer().Buffer, Base = requireBase(), util = require$$0$1;
  var Draft75 = function(request, url, options) {
    Base.apply(this, arguments);
    this._stage = 0;
    this.version = "hixie-75";
    this._headers.set("Upgrade", "WebSocket");
    this._headers.set("Connection", "Upgrade");
    this._headers.set("WebSocket-Origin", this._request.headers.origin);
    this._headers.set("WebSocket-Location", this.url);
  };
  util.inherits(Draft75, Base);
  var instance = {
    close: function() {
      if (this.readyState === 3) return false;
      this.readyState = 3;
      this.emit("close", new Base.CloseEvent(null, null));
      return true;
    },
    parse: function(chunk) {
      if (this.readyState > 1) return;
      this._reader.put(chunk);
      this._reader.eachByte(function(octet) {
        var message2;
        switch (this._stage) {
          case -1:
            this._body.push(octet);
            this._sendHandshakeBody();
            break;
          case 0:
            this._parseLeadingByte(octet);
            break;
          case 1:
            this._length = (octet & 127) + 128 * this._length;
            if (this._length > this._maxLength) return this.close();
            if (this._closing && this._length === 0) {
              return this.close();
            } else if ((octet & 128) !== 128) {
              if (this._length === 0) {
                this._stage = 0;
              } else {
                this._skipped = 0;
                this._stage = 2;
              }
            }
            break;
          case 2:
            if (octet === 255) {
              this._stage = 0;
              message2 = Buffer.from(this._buffer).toString("utf8", 0, this._buffer.length);
              this.emit("message", new Base.MessageEvent(message2));
            } else {
              if (this._length) {
                this._skipped += 1;
                if (this._skipped === this._length)
                  this._stage = 0;
              } else {
                this._buffer.push(octet);
                if (this._buffer.length > this._maxLength) return this.close();
              }
            }
            break;
        }
      }, this);
    },
    frame: function(buffer) {
      if (this.readyState === 0) return this._queue([buffer]);
      if (this.readyState > 1) return false;
      if (typeof buffer !== "string") buffer = buffer.toString();
      var length = Buffer.byteLength(buffer), frame2 = Buffer.allocUnsafe(length + 2);
      frame2[0] = 0;
      frame2.write(buffer, 1);
      frame2[frame2.length - 1] = 255;
      this._write(frame2);
      return true;
    },
    _handshakeResponse: function() {
      var start = "HTTP/1.1 101 Web Socket Protocol Handshake", headers2 = [start, this._headers.toString(), ""];
      return Buffer.from(headers2.join("\r\n"), "utf8");
    },
    _parseLeadingByte: function(octet) {
      if ((octet & 128) === 128) {
        this._length = 0;
        this._stage = 1;
      } else {
        delete this._length;
        delete this._skipped;
        this._buffer = [];
        this._stage = 2;
      }
    }
  };
  for (var key in instance)
    Draft75.prototype[key] = instance[key];
  draft75 = Draft75;
  return draft75;
}
var draft76;
var hasRequiredDraft76;
function requireDraft76() {
  if (hasRequiredDraft76) return draft76;
  hasRequiredDraft76 = 1;
  var Buffer = requireSafeBuffer().Buffer, Base = requireBase(), Draft75 = requireDraft75(), crypto = require$$1$1, util = require$$0$1;
  var numberFromKey = function(key2) {
    return parseInt((key2.match(/[0-9]/g) || []).join(""), 10);
  };
  var spacesInKey = function(key2) {
    return (key2.match(/ /g) || []).length;
  };
  var Draft76 = function(request, url, options) {
    Draft75.apply(this, arguments);
    this._stage = -1;
    this._body = [];
    this.version = "hixie-76";
    this._headers.clear();
    this._headers.set("Upgrade", "WebSocket");
    this._headers.set("Connection", "Upgrade");
    this._headers.set("Sec-WebSocket-Origin", this._request.headers.origin);
    this._headers.set("Sec-WebSocket-Location", this.url);
  };
  util.inherits(Draft76, Draft75);
  var instance = {
    BODY_SIZE: 8,
    start: function() {
      if (!Draft75.prototype.start.call(this)) return false;
      this._started = true;
      this._sendHandshakeBody();
      return true;
    },
    close: function() {
      if (this.readyState === 3) return false;
      if (this.readyState === 1) this._write(Buffer.from([255, 0]));
      this.readyState = 3;
      this.emit("close", new Base.CloseEvent(null, null));
      return true;
    },
    _handshakeResponse: function() {
      var headers2 = this._request.headers, key1 = headers2["sec-websocket-key1"], key2 = headers2["sec-websocket-key2"];
      if (!key1) throw new Error("Missing required header: Sec-WebSocket-Key1");
      if (!key2) throw new Error("Missing required header: Sec-WebSocket-Key2");
      var number1 = numberFromKey(key1), spaces1 = spacesInKey(key1), number2 = numberFromKey(key2), spaces2 = spacesInKey(key2);
      if (number1 % spaces1 !== 0 || number2 % spaces2 !== 0)
        throw new Error("Client sent invalid Sec-WebSocket-Key headers");
      this._keyValues = [number1 / spaces1, number2 / spaces2];
      var start = "HTTP/1.1 101 WebSocket Protocol Handshake", headers2 = [start, this._headers.toString(), ""];
      return Buffer.from(headers2.join("\r\n"), "binary");
    },
    _handshakeSignature: function() {
      if (this._body.length < this.BODY_SIZE) return null;
      var md5 = crypto.createHash("md5"), buffer = Buffer.allocUnsafe(8 + this.BODY_SIZE);
      buffer.writeUInt32BE(this._keyValues[0], 0);
      buffer.writeUInt32BE(this._keyValues[1], 4);
      Buffer.from(this._body).copy(buffer, 8, 0, this.BODY_SIZE);
      md5.update(buffer);
      return Buffer.from(md5.digest("binary"), "binary");
    },
    _sendHandshakeBody: function() {
      if (!this._started) return;
      var signature = this._handshakeSignature();
      if (!signature) return;
      this._write(signature);
      this._stage = 0;
      this._open();
      if (this._body.length > this.BODY_SIZE)
        this.parse(this._body.slice(this.BODY_SIZE));
    },
    _parseLeadingByte: function(octet) {
      if (octet !== 255)
        return Draft75.prototype._parseLeadingByte.call(this, octet);
      this._closing = true;
      this._length = 0;
      this._stage = 1;
    }
  };
  for (var key in instance)
    Draft76.prototype[key] = instance[key];
  draft76 = Draft76;
  return draft76;
}
var server;
var hasRequiredServer;
function requireServer() {
  if (hasRequiredServer) return server;
  hasRequiredServer = 1;
  var util = require$$0$1, HttpParser = requireHttp_parser(), Base = requireBase(), Draft75 = requireDraft75(), Draft76 = requireDraft76(), Hybi = requireHybi();
  var Server = function(options) {
    Base.call(this, null, null, options);
    this._http = new HttpParser("request");
  };
  util.inherits(Server, Base);
  var instance = {
    EVENTS: ["open", "message", "error", "close", "ping", "pong"],
    _bindEventListeners: function() {
      this.messages.on("error", function() {
      });
      this.on("error", function() {
      });
    },
    parse: function(chunk) {
      if (this._delegate) return this._delegate.parse(chunk);
      this._http.parse(chunk);
      if (!this._http.isComplete()) return;
      this.method = this._http.method;
      this.url = this._http.url;
      this.headers = this._http.headers;
      this.body = this._http.body;
      var self = this;
      this._delegate = Server.http(this, this._options);
      this._delegate.messages = this.messages;
      this._delegate.io = this.io;
      this._open();
      this.EVENTS.forEach(function(event) {
        this._delegate.on(event, function(e) {
          self.emit(event, e);
        });
      }, this);
      this.protocol = this._delegate.protocol;
      this.version = this._delegate.version;
      this.parse(this._http.body);
      this.emit("connect", new Base.ConnectEvent());
    },
    _open: function() {
      this.__queue.forEach(function(msg) {
        this._delegate[msg[0]].apply(this._delegate, msg[1]);
      }, this);
      this.__queue = [];
    }
  };
  ["addExtension", "setHeader", "start", "frame", "text", "binary", "ping", "close"].forEach(function(method) {
    instance[method] = function() {
      if (this._delegate) {
        return this._delegate[method].apply(this._delegate, arguments);
      } else {
        this.__queue.push([method, arguments]);
        return true;
      }
    };
  });
  for (var key in instance)
    Server.prototype[key] = instance[key];
  Server.isSecureRequest = function(request) {
    if (request.connection && request.connection.authorized !== void 0) return true;
    if (request.socket && request.socket.secure) return true;
    var headers2 = request.headers;
    if (!headers2) return false;
    if (headers2["https"] === "on") return true;
    if (headers2["x-forwarded-ssl"] === "on") return true;
    if (headers2["x-forwarded-scheme"] === "https") return true;
    if (headers2["x-forwarded-proto"] === "https") return true;
    return false;
  };
  Server.determineUrl = function(request) {
    var scheme = this.isSecureRequest(request) ? "wss:" : "ws:";
    return scheme + "//" + request.headers.host + request.url;
  };
  Server.http = function(request, options) {
    options = options || {};
    if (options.requireMasking === void 0) options.requireMasking = true;
    var headers2 = request.headers, version = headers2["sec-websocket-version"], key2 = headers2["sec-websocket-key"], key1 = headers2["sec-websocket-key1"], key22 = headers2["sec-websocket-key2"], url = this.determineUrl(request);
    if (version || key2)
      return new Hybi(request, url, options);
    else if (key1 || key22)
      return new Draft76(request, url, options);
    else
      return new Draft75(request, url, options);
  };
  server = Server;
  return server;
}
var driver;
var hasRequiredDriver;
function requireDriver() {
  if (hasRequiredDriver) return driver;
  hasRequiredDriver = 1;
  var Base = requireBase(), Client = requireClient(), Server = requireServer();
  var Driver = {
    client: function(url, options) {
      options = options || {};
      if (options.masking === void 0) options.masking = true;
      return new Client(url, options);
    },
    server: function(options) {
      options = options || {};
      if (options.requireMasking === void 0) options.requireMasking = true;
      return new Server(options);
    },
    http: function() {
      return Server.http.apply(Server, arguments);
    },
    isSecureRequest: function(request) {
      return Server.isSecureRequest(request);
    },
    isWebSocket: function(request) {
      return Base.isWebSocket(request);
    },
    validateOptions: function(options, validKeys) {
      Base.validateOptions(options, validKeys);
    }
  };
  driver = Driver;
  return driver;
}
export {
  requireHeaders as a,
  requireDriver as r
};
