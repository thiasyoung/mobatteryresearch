/*
	Summit photo reel.
	Cycles through three-digit image filenames (000-999) in images/summit_photos.
*/
(function() {

	var REEL_SELECTOR = '[data-summit-reel]';
	var DEFAULT_FOLDER = 'images/summit_photos';
	var DEFAULT_INTERVAL_MS = 4500;
	var DEFAULT_MAX_INDEX = 999;
	var MAX_CONSECUTIVE_MISSES = 16;
	var EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'];

	function padIndex(number) {
		var value = String(number);

		while (value.length < 3)
			value = '0' + value;

		return value;
	}

	function trimTrailingSlashes(path) {
		return path.replace(/\/+$/, '');
	}

	function probeImagePath(path, done) {
		var image = new Image();

		image.onload = function() {
			done(true);
		};

		image.onerror = function() {
			done(false);
		};

		image.src = path;
	}

	function resolveImagePath(folder, baseName, done) {
		var extensionIndex = 0;

		function tryNextExtension() {
			if (extensionIndex >= EXTENSIONS.length) {
				done(null);
				return;
			}

			var candidatePath = folder + '/' + baseName + '.' + EXTENSIONS[extensionIndex];

			probeImagePath(candidatePath, function(exists) {
				if (exists) {
					done(candidatePath);
					return;
				}

				extensionIndex += 1;
				tryNextExtension();
			});
		}

		tryNextExtension();
	}

	function discoverImagePaths(folder, maxIndex, done) {
		var currentIndex = 0;
		var missesAfterFirstHit = 0;
		var foundPaths = [];

		function next() {
			var reachedLimit = currentIndex > maxIndex;
			var shouldStopForMisses = foundPaths.length > 0 && missesAfterFirstHit >= MAX_CONSECUTIVE_MISSES;

			if (reachedLimit || shouldStopForMisses) {
				done(foundPaths);
				return;
			}

			var baseName = padIndex(currentIndex);
			currentIndex += 1;

			resolveImagePath(folder, baseName, function(path) {
				if (path) {
					foundPaths.push(path);
					missesAfterFirstHit = 0;
				}
				else if (foundPaths.length > 0) {
					missesAfterFirstHit += 1;
				}

				next();
			});
		}

		next();
	}

	function startReel(reelElement, imageElement, imagePaths, intervalMs) {
		var currentIndex = 0;

		if (imagePaths.length === 0)
			return;

		imageElement.src = imagePaths[0];

		if (imagePaths.length === 1)
			return;

		window.setInterval(function() {
			currentIndex = (currentIndex + 1) % imagePaths.length;
			reelElement.classList.add('is-fading');

			window.setTimeout(function() {
				imageElement.src = imagePaths[currentIndex];
			}, 140);

			window.setTimeout(function() {
				reelElement.classList.remove('is-fading');
			}, 290);
		}, intervalMs);
	}

	function init() {
		var reelElement = document.querySelector(REEL_SELECTOR);

		if (!reelElement)
			return;

		var imageElement = reelElement.querySelector('img');

		if (!imageElement)
			return;

		var folder = reelElement.getAttribute('data-folder') || DEFAULT_FOLDER;
		var folderPath = trimTrailingSlashes(folder);

		var intervalMs = parseInt(reelElement.getAttribute('data-interval-ms'), 10);
		if (!isFinite(intervalMs) || isNaN(intervalMs) || intervalMs < 1000)
			intervalMs = DEFAULT_INTERVAL_MS;

		var maxIndex = parseInt(reelElement.getAttribute('data-max-index'), 10);
		if (!isFinite(maxIndex) || isNaN(maxIndex) || maxIndex < 0 || maxIndex > 999)
			maxIndex = DEFAULT_MAX_INDEX;

		discoverImagePaths(folderPath, maxIndex, function(imagePaths) {
			startReel(reelElement, imageElement, imagePaths, intervalMs);
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	}
	else {
		init();
	}

})();
