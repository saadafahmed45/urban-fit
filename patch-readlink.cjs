const fs = require('fs');

function patchFs(targetFs) {
  if (!targetFs) return;

  const origReadlinkSync = targetFs.readlinkSync;
  if (origReadlinkSync) {
    targetFs.readlinkSync = function (p, options) {
      try {
        return origReadlinkSync.call(targetFs, p, options);
      } catch (err) {
        if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
          const e = new Error(`EINVAL: invalid argument, readlink '${p}'`);
          e.code = 'EINVAL';
          e.errno = -4071;
          e.syscall = 'readlink';
          e.path = p;
          throw e;
        }
        throw err;
      }
    };
  }

  const origReadlink = targetFs.readlink;
  if (origReadlink) {
    targetFs.readlink = function (p, options, callback) {
      let cb = callback;
      let opt = options;
      if (typeof opt === 'function') {
        cb = opt;
        opt = undefined;
      }
      return origReadlink.call(targetFs, p, opt, (err, linkString) => {
        if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
          const e = new Error(`EINVAL: invalid argument, readlink '${p}'`);
          e.code = 'EINVAL';
          e.errno = -4071;
          e.syscall = 'readlink';
          e.path = p;
          return cb(e);
        }
        return cb(err, linkString);
      });
    };
  }

  if (targetFs.promises && targetFs.promises.readlink) {
    const origPromisesReadlink = targetFs.promises.readlink;
    targetFs.promises.readlink = async function (p, options) {
      try {
        return await origPromisesReadlink.call(targetFs.promises, p, options);
      } catch (err) {
        if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
          const e = new Error(`EINVAL: invalid argument, readlink '${p}'`);
          e.code = 'EINVAL';
          e.errno = -4071;
          e.syscall = 'readlink';
          e.path = p;
          throw e;
        }
        throw err;
      }
    };
  }
}

patchFs(fs);

module.exports = { patchFs };
