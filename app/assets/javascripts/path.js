function Path (arg) {
  if (!(this instanceof Path)) return new Path(arg);

  if (typeof arg == 'string') {
    this._path = Path.normalize(arg);
  } else if (arg instanceof Path) {
    this._path = arg._path;
  } else {
    throw 'new Path(arg); arg should be String or Path;';
  }
}

Path.normalize = function (arg) {
  if (typeof arg == 'string') {
    return arg.replace(/\/+/g, '/').replace(/\/$/, '');
  } else {
    throw 'Path.normalize(arg); arg should be String;';
  }
};

Path.prototype.dirname = function () {
  return new Path(this._path.split('/').slice(0, -1).join('/'));
};

Path.prototype.basename = function () {
  return new Path(this._path.split('/').slice(-1)[0]);
};

Path.prototype.split = function () {
  return {
    dirname: this.dirname().toString(),
    basename: this.basename().toString()
  };
};

Path.prototype.join = function (arg) {
  if (typeof arg == 'string') {
    return this.join(new Path(arg));
  } else if (arg instanceof Path) {
    return new Path(this._path + '/' + arg._path);
  } else {
    throw 'Path::normalize(arg); arg should be String or Path;';
  }
};

Path.prototype.toString = function () {
  return this._path;
};

