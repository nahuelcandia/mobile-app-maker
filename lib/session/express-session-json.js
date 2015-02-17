var fs = require('fs'),
    path = require('path'),
    util = require('util');

module.exports = function(session) {

    var JsonStore = function(options) {
        options = options || {};
        session.Store.call(this, options);

        var filename = options.filename ? options.filename : 'express-sessions.json';
        var dir = options.path || __dirname;

        this._filename = path.join(dir, filename);

        var self = this;
        if (!fs.existsSync(this._filename)) {
            fs.writeFileSync(this._filename, '{}');
            self._sessions = {};
        } else {
            //no problem to be sync at startup time!
            //otherwise, it may startup uninitialized
            try {
                self._sessions = JSON.parse(fs.readFileSync(this._filename));
            } catch(e) {
                fs.writeFileSync(this._filename, '{}');
                self._sessions = {};                
            }
        }
    };

    util.inherits(JsonStore, session.Store);

    JsonStore.prototype.set = function(sid, sess, fn) {
        var self = this;
        // find one
        sess._sessionid = sid;
        this._sessions[sid] = sess;
        fs.writeFile(this._filename, JSON.stringify(this._sessions), function(err) {
            fn(err, sess);    
        });
        
    };

    JsonStore.prototype.get = function(sid, fn) {
        if (!this._sessions || !this._sessions[sid]) {
            fn(null, null);
        } else {
            fn(null, this._sessions[sid]);
        }
    };

    JsonStore.prototype.destroy = function(sid, fn) {
        if (!this._sessions || !this._sessions[sid]) {
            fn();
            return;
        }
        
        delete this._sessions[sid];

        // no big matter if have failed
        fs.writeFile(this._filename, JSON.stringify(this._sessions), fn);

        return;
    };

    JsonStore.prototype.length = function(fn) {
        if (!this._sessions || !this._sessions[sid])
            return 0;
        var i = 0;
        for (var x in this._sessions)
            if (this._sessions.hasOwnProperty(x))
                i++;
        return i;
    };

    JsonStore.prototype.all = function(fn) {
        var t = [];
        for (var x in this._sessions)
            t.push(this._sessions[x]);
        fn(null, t);
    };

    JsonStore.prototype.clear = function(fn) {
        this._sessions = {};

        fs.writeFile(this._filename, JSON.stringify(this._sessions), fn);

    };

    return JsonStore;
};
