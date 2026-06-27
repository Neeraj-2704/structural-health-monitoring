var parser;
var hasRequiredParser;
function requireParser() {
  if (hasRequiredParser) return parser;
  hasRequiredParser = 1;
  var TOKEN = /([!#\$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+)/, NOTOKEN = /([^!#\$%&'\*\+\-\.\^_`\|~0-9A-Za-z])/g, QUOTED = /"((?:\\[\x00-\x7f]|[^\x00-\x08\x0a-\x1f\x7f"\\])*)"/, PARAM = new RegExp(TOKEN.source + "(?:=(?:" + TOKEN.source + "|" + QUOTED.source + "))?"), EXT = new RegExp(TOKEN.source + "(?: *; *" + PARAM.source + ")*", "g"), EXT_LIST = new RegExp("^" + EXT.source + "(?: *, *" + EXT.source + ")*$"), NUMBER = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var Parser = {
    parseHeader: function(header) {
      var offers = new Offers();
      if (header === "" || header === void 0) return offers;
      if (!EXT_LIST.test(header))
        throw new SyntaxError("Invalid Sec-WebSocket-Extensions header: " + header);
      var values = header.match(EXT);
      values.forEach(function(value) {
        var params = value.match(new RegExp(PARAM.source, "g")), name = params.shift(), offer = {};
        params.forEach(function(param) {
          var args = param.match(PARAM), key = args[1], data;
          if (args[2] !== void 0) {
            data = args[2];
          } else if (args[3] !== void 0) {
            data = args[3].replace(/\\/g, "");
          } else {
            data = true;
          }
          if (NUMBER.test(data)) data = parseFloat(data);
          if (hasOwnProperty.call(offer, key)) {
            offer[key] = [].concat(offer[key]);
            offer[key].push(data);
          } else {
            offer[key] = data;
          }
        }, this);
        offers.push(name, offer);
      }, this);
      return offers;
    },
    serializeParams: function(name, params) {
      var values = [];
      var print = function(key2, value) {
        if (value instanceof Array) {
          value.forEach(function(v) {
            print(key2, v);
          });
        } else if (value === true) {
          values.push(key2);
        } else if (typeof value === "number") {
          values.push(key2 + "=" + value);
        } else if (NOTOKEN.test(value)) {
          values.push(key2 + '="' + value.replace(/"/g, '\\"') + '"');
        } else {
          values.push(key2 + "=" + value);
        }
      };
      for (var key in params) print(key, params[key]);
      return [name].concat(values).join("; ");
    }
  };
  var Offers = function() {
    this._byName = {};
    this._inOrder = [];
  };
  Offers.prototype.push = function(name, params) {
    if (!hasOwnProperty.call(this._byName, name))
      this._byName[name] = [];
    this._byName[name].push(params);
    this._inOrder.push({ name, params });
  };
  Offers.prototype.eachOffer = function(callback, context) {
    var list = this._inOrder;
    for (var i = 0, n = list.length; i < n; i++)
      callback.call(context, list[i].name, list[i].params);
  };
  Offers.prototype.byName = function(name) {
    return this._byName[name] || [];
  };
  Offers.prototype.toArray = function() {
    return this._inOrder.slice();
  };
  parser = Parser;
  return parser;
}
var ring_buffer;
var hasRequiredRing_buffer;
function requireRing_buffer() {
  if (hasRequiredRing_buffer) return ring_buffer;
  hasRequiredRing_buffer = 1;
  var RingBuffer = function(bufferSize) {
    this._bufferSize = bufferSize;
    this.clear();
  };
  RingBuffer.prototype.clear = function() {
    this._buffer = new Array(this._bufferSize);
    this._ringOffset = 0;
    this._ringSize = this._bufferSize;
    this._head = 0;
    this._tail = 0;
    this.length = 0;
  };
  RingBuffer.prototype.push = function(value) {
    var expandBuffer = false, expandRing = false;
    if (this._ringSize < this._bufferSize) {
      expandBuffer = this._tail === 0;
    } else if (this._ringOffset === this._ringSize) {
      expandBuffer = true;
      expandRing = this._tail === 0;
    }
    if (expandBuffer) {
      this._tail = this._bufferSize;
      this._buffer = this._buffer.concat(new Array(this._bufferSize));
      this._bufferSize = this._buffer.length;
      if (expandRing)
        this._ringSize = this._bufferSize;
    }
    this._buffer[this._tail] = value;
    this.length += 1;
    if (this._tail < this._ringSize) this._ringOffset += 1;
    this._tail = (this._tail + 1) % this._bufferSize;
  };
  RingBuffer.prototype.peek = function() {
    if (this.length === 0) return void 0;
    return this._buffer[this._head];
  };
  RingBuffer.prototype.shift = function() {
    if (this.length === 0) return void 0;
    var value = this._buffer[this._head];
    this._buffer[this._head] = void 0;
    this.length -= 1;
    this._ringOffset -= 1;
    if (this._ringOffset === 0 && this.length > 0) {
      this._head = this._ringSize;
      this._ringOffset = this.length;
      this._ringSize = this._bufferSize;
    } else {
      this._head = (this._head + 1) % this._ringSize;
    }
    return value;
  };
  ring_buffer = RingBuffer;
  return ring_buffer;
}
var functor;
var hasRequiredFunctor;
function requireFunctor() {
  if (hasRequiredFunctor) return functor;
  hasRequiredFunctor = 1;
  var RingBuffer = requireRing_buffer();
  var Functor = function(session, method) {
    this._session = session;
    this._method = method;
    this._queue = new RingBuffer(Functor.QUEUE_SIZE);
    this._stopped = false;
    this.pending = 0;
  };
  Functor.QUEUE_SIZE = 8;
  Functor.prototype.call = function(error, message, callback, context) {
    if (this._stopped) return;
    var record = { error, message, callback, context, done: false }, called = false, self = this;
    this._queue.push(record);
    if (record.error) {
      record.done = true;
      this._stop();
      return this._flushQueue();
    }
    var handler = function(err, msg) {
      if (!(called ^ (called = true))) return;
      if (err) {
        self._stop();
        record.error = err;
        record.message = null;
      } else {
        record.message = msg;
      }
      record.done = true;
      self._flushQueue();
    };
    try {
      this._session[this._method](message, handler);
    } catch (err) {
      handler(err);
    }
  };
  Functor.prototype._stop = function() {
    this.pending = this._queue.length;
    this._stopped = true;
  };
  Functor.prototype._flushQueue = function() {
    var queue = this._queue, record;
    while (queue.length > 0 && queue.peek().done) {
      record = queue.shift();
      if (record.error) {
        this.pending = 0;
        queue.clear();
      } else {
        this.pending -= 1;
      }
      record.callback.call(record.context, record.error, record.message);
    }
  };
  functor = Functor;
  return functor;
}
var pledge;
var hasRequiredPledge;
function requirePledge() {
  if (hasRequiredPledge) return pledge;
  hasRequiredPledge = 1;
  var RingBuffer = requireRing_buffer();
  var Pledge = function() {
    this._complete = false;
    this._callbacks = new RingBuffer(Pledge.QUEUE_SIZE);
  };
  Pledge.QUEUE_SIZE = 4;
  Pledge.all = function(list) {
    var pledge2 = new Pledge(), pending = list.length, n = pending;
    if (pending === 0) pledge2.done();
    while (n--) list[n].then(function() {
      pending -= 1;
      if (pending === 0) pledge2.done();
    });
    return pledge2;
  };
  Pledge.prototype.then = function(callback) {
    if (this._complete) callback();
    else this._callbacks.push(callback);
  };
  Pledge.prototype.done = function() {
    this._complete = true;
    var callbacks = this._callbacks, callback;
    while (callback = callbacks.shift()) callback();
  };
  pledge = Pledge;
  return pledge;
}
var cell;
var hasRequiredCell;
function requireCell() {
  if (hasRequiredCell) return cell;
  hasRequiredCell = 1;
  var Functor = requireFunctor(), Pledge = requirePledge();
  var Cell = function(tuple) {
    this._ext = tuple[0];
    this._session = tuple[1];
    this._functors = {
      incoming: new Functor(this._session, "processIncomingMessage"),
      outgoing: new Functor(this._session, "processOutgoingMessage")
    };
  };
  Cell.prototype.pending = function(direction) {
    var functor2 = this._functors[direction];
    if (!functor2._stopped) functor2.pending += 1;
  };
  Cell.prototype.incoming = function(error, message, callback, context) {
    this._exec("incoming", error, message, callback, context);
  };
  Cell.prototype.outgoing = function(error, message, callback, context) {
    this._exec("outgoing", error, message, callback, context);
  };
  Cell.prototype.close = function() {
    this._closed = this._closed || new Pledge();
    this._doClose();
    return this._closed;
  };
  Cell.prototype._exec = function(direction, error, message, callback, context) {
    this._functors[direction].call(error, message, function(err, msg) {
      if (err) err.message = this._ext.name + ": " + err.message;
      callback.call(context, err, msg);
      this._doClose();
    }, this);
  };
  Cell.prototype._doClose = function() {
    var fin = this._functors.incoming, fout = this._functors.outgoing;
    if (!this._closed || fin.pending + fout.pending !== 0) return;
    if (this._session) this._session.close();
    this._session = null;
    this._closed.done();
  };
  cell = Cell;
  return cell;
}
var pipeline;
var hasRequiredPipeline;
function requirePipeline() {
  if (hasRequiredPipeline) return pipeline;
  hasRequiredPipeline = 1;
  var Cell = requireCell(), Pledge = requirePledge();
  var Pipeline = function(sessions) {
    this._cells = sessions.map(function(session) {
      return new Cell(session);
    });
    this._stopped = { incoming: false, outgoing: false };
  };
  Pipeline.prototype.processIncomingMessage = function(message, callback, context) {
    if (this._stopped.incoming) return;
    this._loop("incoming", this._cells.length - 1, -1, -1, message, callback, context);
  };
  Pipeline.prototype.processOutgoingMessage = function(message, callback, context) {
    if (this._stopped.outgoing) return;
    this._loop("outgoing", 0, this._cells.length, 1, message, callback, context);
  };
  Pipeline.prototype.close = function(callback, context) {
    this._stopped = { incoming: true, outgoing: true };
    var closed = this._cells.map(function(a) {
      return a.close();
    });
    if (callback)
      Pledge.all(closed).then(function() {
        callback.call(context);
      });
  };
  Pipeline.prototype._loop = function(direction, start, end, step, message, callback, context) {
    var cells = this._cells, n = cells.length, self = this;
    while (n--) cells[n].pending(direction);
    var pipe = function(index, error, msg) {
      if (index === end) return callback.call(context, error, msg);
      cells[index][direction](error, msg, function(err, m) {
        if (err) self._stopped[direction] = true;
        pipe(index + step, err, m);
      });
    };
    pipe(start, null, message);
  };
  pipeline = Pipeline;
  return pipeline;
}
var websocket_extensions;
var hasRequiredWebsocket_extensions;
function requireWebsocket_extensions() {
  if (hasRequiredWebsocket_extensions) return websocket_extensions;
  hasRequiredWebsocket_extensions = 1;
  var Parser = requireParser(), Pipeline = requirePipeline();
  var Extensions = function() {
    this._rsv1 = this._rsv2 = this._rsv3 = null;
    this._byName = {};
    this._inOrder = [];
    this._sessions = [];
    this._index = {};
  };
  Extensions.MESSAGE_OPCODES = [1, 2];
  var instance = {
    add: function(ext) {
      if (typeof ext.name !== "string") throw new TypeError("extension.name must be a string");
      if (ext.type !== "permessage") throw new TypeError('extension.type must be "permessage"');
      if (typeof ext.rsv1 !== "boolean") throw new TypeError("extension.rsv1 must be true or false");
      if (typeof ext.rsv2 !== "boolean") throw new TypeError("extension.rsv2 must be true or false");
      if (typeof ext.rsv3 !== "boolean") throw new TypeError("extension.rsv3 must be true or false");
      if (this._byName.hasOwnProperty(ext.name))
        throw new TypeError('An extension with name "' + ext.name + '" is already registered');
      this._byName[ext.name] = ext;
      this._inOrder.push(ext);
    },
    generateOffer: function() {
      var sessions = [], offer = [], index = {};
      this._inOrder.forEach(function(ext) {
        var session = ext.createClientSession();
        if (!session) return;
        var record = [ext, session];
        sessions.push(record);
        index[ext.name] = record;
        var offers = session.generateOffer();
        offers = offers ? [].concat(offers) : [];
        offers.forEach(function(off) {
          offer.push(Parser.serializeParams(ext.name, off));
        }, this);
      }, this);
      this._sessions = sessions;
      this._index = index;
      return offer.length > 0 ? offer.join(", ") : null;
    },
    activate: function(header) {
      var responses = Parser.parseHeader(header), sessions = [];
      responses.eachOffer(function(name, params) {
        var record = this._index[name];
        if (!record)
          throw new Error('Server sent an extension response for unknown extension "' + name + '"');
        var ext = record[0], session = record[1], reserved = this._reserved(ext);
        if (reserved)
          throw new Error("Server sent two extension responses that use the RSV" + reserved[0] + ' bit: "' + reserved[1] + '" and "' + ext.name + '"');
        if (session.activate(params) !== true)
          throw new Error("Server sent unacceptable extension parameters: " + Parser.serializeParams(name, params));
        this._reserve(ext);
        sessions.push(record);
      }, this);
      this._sessions = sessions;
      this._pipeline = new Pipeline(sessions);
    },
    generateResponse: function(header) {
      var sessions = [], response = [], offers = Parser.parseHeader(header);
      this._inOrder.forEach(function(ext) {
        var offer = offers.byName(ext.name);
        if (offer.length === 0 || this._reserved(ext)) return;
        var session = ext.createServerSession(offer);
        if (!session) return;
        this._reserve(ext);
        sessions.push([ext, session]);
        response.push(Parser.serializeParams(ext.name, session.generateResponse()));
      }, this);
      this._sessions = sessions;
      this._pipeline = new Pipeline(sessions);
      return response.length > 0 ? response.join(", ") : null;
    },
    validFrameRsv: function(frame) {
      var allowed = { rsv1: false, rsv2: false, rsv3: false }, ext;
      if (Extensions.MESSAGE_OPCODES.indexOf(frame.opcode) >= 0) {
        for (var i = 0, n = this._sessions.length; i < n; i++) {
          ext = this._sessions[i][0];
          allowed.rsv1 = allowed.rsv1 || ext.rsv1;
          allowed.rsv2 = allowed.rsv2 || ext.rsv2;
          allowed.rsv3 = allowed.rsv3 || ext.rsv3;
        }
      }
      return (allowed.rsv1 || !frame.rsv1) && (allowed.rsv2 || !frame.rsv2) && (allowed.rsv3 || !frame.rsv3);
    },
    processIncomingMessage: function(message, callback, context) {
      this._pipeline.processIncomingMessage(message, callback, context);
    },
    processOutgoingMessage: function(message, callback, context) {
      this._pipeline.processOutgoingMessage(message, callback, context);
    },
    close: function(callback, context) {
      if (!this._pipeline) return callback.call(context);
      this._pipeline.close(callback, context);
    },
    _reserve: function(ext) {
      this._rsv1 = this._rsv1 || ext.rsv1 && ext.name;
      this._rsv2 = this._rsv2 || ext.rsv2 && ext.name;
      this._rsv3 = this._rsv3 || ext.rsv3 && ext.name;
    },
    _reserved: function(ext) {
      if (this._rsv1 && ext.rsv1) return [1, this._rsv1];
      if (this._rsv2 && ext.rsv2) return [2, this._rsv2];
      if (this._rsv3 && ext.rsv3) return [3, this._rsv3];
      return false;
    }
  };
  for (var key in instance)
    Extensions.prototype[key] = instance[key];
  websocket_extensions = Extensions;
  return websocket_extensions;
}
export {
  requireWebsocket_extensions as r
};
