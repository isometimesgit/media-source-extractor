"use strict";

const Util = {
    split: (s, d = '\n') => !s || s.trim() === '' ? [] : s.trim().split(d).map(i => i.trim().toLowerCase()).sort(),
    join: (a, d = '\n') => Array.isArray(a) ? a.filter(i => i && i.trim() !== '').join(d).toLowerCase() : '',
    getHostFromUrl: (url) => url ? (new URL(url)).host.toLowerCase() : null,
    getExtensionFromUrl: (url) => url ? (new URL(url)).pathname.split('.').pop().toLowerCase() : null,
    promisfy: function (f, context) {
        return function (...args) {
            if (chrome) {
                return new Promise((resolve, reject) => {
                    args.push((res) => resolve(res))
                    f.call(context || this, ...args);
                });
            }
            return f.call(context || this, ...args);
        }
    }
}