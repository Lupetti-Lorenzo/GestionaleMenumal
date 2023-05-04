/// <reference types="@sveltejs/kit" />
import { build, files, version } from "$service-worker"

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
]

self.addEventListener("install", (event) => {
	//console.log("installed")
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE)
		await cache.addAll(ASSETS)
	}

	event.waitUntil(addFilesToCache())
	self.skipWaiting()
})

self.addEventListener("activate", (event) => {
	//console.log("activated")
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key)
		}
	}

	event.waitUntil(deleteOldCaches())
	self.clients.claim()
})

self.addEventListener("fetch", (event) => {
	// ignore POST requests etc
	if (event.request.method !== "GET") return
	// if request is made for web page url must contains http.
	if (!(event.request.url.indexOf("http") === 0)) return // skip the request. if request is not made with http protocol

	//console.log("fetch from " + event.request.url)

	async function respond() {
		const url = new URL(event.request.url)
		const cache = await caches.open(CACHE)

		// CHACHE FIRST -- file della build e statici, json png, js, css
		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			//console.log("got it cached! " + event.request.url)
			return cache.match(url.pathname)
		}

		// NETWORK FIRST -- per gli altri file e chiamate GET, solo se sono offline provo a prenderli dalla chache
		if (cache.match)
			// for everything else, try the network first, but
			// fall back to the cache if we're offline
			try {
				// se non ce connessione fetch da errore e vado nel catch
				const response = await fetch(event.request)
				if (response.status === 200) {
					//console.log("didnt have it, now cached! " + event.request.url)
					cache.put(event.request, response.clone())
				}
				return response
			} catch {
				//console.log("offline, got it cached! " + event.request.url)
				return cache.match(event.request)
			}
	}

	event.respondWith(respond())
})
