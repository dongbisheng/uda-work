self.addEventListener('fetch',function(event){
    event.respondWith(
        caches.match(event.request).then(function(res){
            return res || fetch(event.request)
        })
    )
})
self.addEventListener('install',function(event){
    event.waitUntil(
        caches.open('restaurant_cache').then(function(cache){
            return cache.addAll([
                '/',
                'js/',
                'css/'
            ]);
        })
    )
})