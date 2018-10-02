(function() {
  'use strict';

  var filesToCache = [
    '/',
    'css/bootstrap.min.css',
    'js/jquery-3.3.1.slim.min.js',
    'js/bootstrap.min.js',
    'js/script.js',
    'index.html',
    '404.html',
  ];

  var staticCacheName = 'ppp-cache_attack-v1';

  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(staticCacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
          if (response.status === 404) {
            return caches.match('404.html');
          }
          return caches.open(staticCacheName).then(function(cache) {
            if (event.request.url.indexOf('test') < 0) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
      }).catch(function(error) {
        return caches.match('offline.html');
      })
    );
  });

  self.addEventListener('activate', function(event) {
    var cacheWhitelist = [staticCacheName];

    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

})();
