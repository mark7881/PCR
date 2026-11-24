function finishLoading(){var a=document.getElementById('loader');var b=document.getElementById('loading');var c=document.getElementById('floating-panel');var d=document.getElementById('map');var e=document.getElementById('pano');var f=document.getElementById('divider');if(a)a.style.display='none';if(b)b.style.display='none';if(c)c.style.display='block';if(d)d.style.display='block';if(e)e.style.display='block';if(f)f.style.display='block';}
var s_rdwyid = document.getElementById('rdwyid');
var s_mp = document.getElementById('milepoint');
var map, MPmarker, curpos, sym, sv, panorama, curheading, curpitch;
var bmp, emp, shp_mp_ratio;
var cntylines, allRoads, selectedRoad, selectedLine;
var isctrloc = 0;
var currentPCRFilter = 'ALL';
var currentDistrictFilter = 'ALL';
var currentCountyFilter = 'ALL';
var selectedFeature = null;
var count = 0;
var uid;
var url = window.location.href;
var urlArray = url.split("/");
urlArray.pop();
var page = window.location.pathname.split("/");
var site = page.pop();
page = urlArray.join('/') + '/' + site;
var sectionInfo = url.split("#");
var paraInfo;
var id_i, mp_i;
if (sectionInfo.length == 2) {
	paraInfo = sectionInfo[1].split("&");
	paraInfo.forEach(function (p) {
		if (p.split("=")[0] == "id") {
			id_i = p.split("=")[1];
		} else if (p.split("=")[0] == "mp") {
			mp_i = p.split("=")[1];
		}
	});
}
if (typeof id_i != 'undefined') {
	s_rdwyid.value = id_i;
}
if (typeof mp_i != 'undefined') {
	s_mp.value = mp_i;
}
function isOdd(num) {
	return num % 2;
}
function initialize() {
	window.setTimeout(function(){finishLoading();},10000);
	sym = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		scale: 4,
		strokeColor: '#0F0',
		fillColor: '#0F0',
		fillOpacity: .5,
		strokeOpacity: .65,
		zIndex: 15
	};
	var tpH = $('#pano');
	var divH = $('#divider');
	var mapH = $('#map');
	var h = $('body').height();
	mapH.css('height', h - tpH.outerHeight() - divH.outerHeight());
	map = new google.maps.Map(document.getElementById('map'), {
			center: curpos,
			zoom: 12,
			streetViewControl: false,
			fullscreenControl: false,
			styles: [{
					elementType: 'geometry',
					stylers: [{
							color: '#242f3e'
						}
					]
				}, {
					elementType: 'labels.text.stroke',
					stylers: [{
							color: '#242f3e'
						}
					]
				}, {
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#746855'
						}
					]
				}, {
					featureType: 'administrative.locality',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#d59563'
						}
					]
				}, {
					featureType: 'poi',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#d59563'
						}
					]
				}, {
					featureType: 'poi.park',
					elementType: 'geometry',
					stylers: [{
							color: '#263c3f'
						}
					]
				}, {
					featureType: 'poi.park',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#6b9a76'
						}
					]
				}, {
					featureType: 'road',
					elementType: 'geometry',
					stylers: [{
							color: '#38414e'
						}
					]
				}, {
					featureType: 'road',
					elementType: 'geometry.stroke',
					stylers: [{
							color: '#212a37'
						}
					]
				}, {
					featureType: 'road',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#9ca5b3'
						}
					]
				}, {
					featureType: 'road.highway',
					elementType: 'geometry',
					stylers: [{
							color: '#746855'
						}
					]
				}, {
					featureType: 'road.highway',
					elementType: 'geometry.stroke',
					stylers: [{
							color: '#1f2835'
						}
					]
				}, {
					featureType: 'road.highway',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#f3d19c'
						}
					]
				}, {
					featureType: 'transit',
					elementType: 'geometry',
					stylers: [{
							color: '#2f3948'
						}
					]
				}, {
					featureType: 'transit.station',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#d59563'
						}
					]
				}, {
					featureType: 'water',
					elementType: 'geometry',
					stylers: [{
							color: '#17263c'
						}
					]
				}, {
					featureType: 'water',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#515c6d'
						}
					]
				}, {
					featureType: 'water',
					elementType: 'labels.text.stroke',
					stylers: [{
							color: '#17263c'
						}
					]
				}
			]
		});
	map.addListener('dblclick', function () {
		if (!isLandscape) {
			count = count + 1;
			if (isOdd(count)) {
				t.css('height', 0);
				t.css('width', w);
				t.css('float', 'left');
				b.css('height', 0.99 * h);
				b.css('width', w);
				d.css('height', h - t.height() - b.height());
				d.css('width', w);
				d.css('cursor', 'n-resize');
			} else {
				t.css('height', 0.70 * h);
				t.css('width', w);
				t.css('float', 'left');
				b.css('height', 0.29 * h);
				b.css('width', w);
				d.css('height', h - t.height() - b.height());
				d.css('width', w);
				d.css('cursor', 'n-resize');
			}
			google.maps.event.trigger(map, "resize");
			google.maps.event.trigger(panorama, "resize");
			curpos = panorama.getPosition();
			var zoomLevel = map.getZoom();
			map.setZoom(zoomLevel - 1);
			map.panTo(curpos);
		}
	});
	MPmarker = new google.maps.Marker({
			position: curpos,
			map: map,
			icon: sym,
			visible: false,
			label: {
				text: " ",
				color: "#FFF",
				fontWeight: "bold"
			}
		});
	MPmarker.addListener('click', function () {
		var nav = "https://www.google.com/maps/dir//"
			var navToLat = MPmarker.position.lat();
		var navToLng = MPmarker.position.lng();
		var navTo = nav.concat(navToLat, ",", navToLng);
		var url = '<strong>RoadID:</strong> ' + s_rdwyid.value + '<br><strong>MP:</strong> ' + s_mp.value + '<br><strong>GPS:</strong> ' + MPmarker.position.lat().toFixed(6) + ', ' + MPmarker.position.lng().toFixed(6) + '<br>' + '<a href=' + navTo + ' target="_blank">Navigate to this MP</a> ';
		infowindow.setContent(url);
		infowindow.open(map, MPmarker);
	});
	MPmarker.addListener('position_changed', function () {
		infowindow.close();
	});
	var infowindow = new google.maps.InfoWindow();
	panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
			linksControl: true,
			panControl: true,
			enableCloseButton: false,
			addressControl: false,
			imageDateControl: true,
			showRoadLabels: false
		});
	panorama.addListener('pano_changed', function () {
		curpos = panorama.getPosition();
		if(curpos && isFinite(curpos.lat()) && isFinite(curpos.lng())) refreshMap(curpos);
	});
	panorama.addListener('position_changed', function () {
		curpos = panorama.getPosition();
		if(curpos && isFinite(curpos.lat()) && isFinite(curpos.lng())) refreshMap(curpos);
	});
	panorama.addListener('pov_changed', function () {
		curheading = panorama.getPov().heading;
		curpitch = panorama.getPov().pitch;
		sym = {
			path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			rotation: curheading,
			scale: 4,
			strokeColor: '#0F0',
			fillColor: '#0F0',
			fillOpacity: .5,
			strokeOpacity: .65,
			zIndex: 15
		};
		MPmarker.setIcon(sym);
	});
	sv = new google.maps.StreetViewService();
	if (s_rdwyid.value == "" & s_mp.value == "") {
		curpos = new google.maps.LatLng({
				lat: 29.673784,
				lng: -82.266523
			});
		curheading = 175;
		curpitch = 1;
		sv.getPanorama({
			location: curpos,
			radius: 50
		}, processSVData);
	}
	// Florida county layer removed for performance.

	selectedRoad = new google.maps.Data();
	allRoads = map.data;
	allRoads.addGeoJson(roads);
	finishLoading();
	/*
	 * One PCR color system for every SHR segment.
	 * Green  = PCR >= 7.5
	 * Yellow = 6.5 <= PCR < 7.5
	 * Red    = PCR < 6.5
	 * Gray   = missing/invalid PCR (All Roads only)
	 */
	function cleanFilterValue(value) {
		return value === undefined || value === null ? '' : String(value).trim();
	}

	function getDistrictValue(feature) {
		return cleanFilterValue(feature.getProperty('DISTRICT'));
	}

	function getCountyValue(feature) {
		return cleanFilterValue(feature.getProperty('COUNTY'));
	}

	function sortFilterValues(values) {
		return values.sort(function (a, b) {
			return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
		});
	}

	function replaceFilterOptions(selectElement, allLabel, values, selectedValue) {
		selectElement.innerHTML = '';
		var allOption = document.createElement('option');
		allOption.value = 'ALL';
		allOption.textContent = allLabel;
		selectElement.appendChild(allOption);
		values.forEach(function (value) {
			var option = document.createElement('option');
			option.value = value;
			option.textContent = value;
			selectElement.appendChild(option);
		});
		selectElement.value = values.indexOf(selectedValue) >= 0 ? selectedValue : 'ALL';
	}

	function updateDistrictCountyOptions(changedFilter) {
		var districtSelect = document.getElementById('districtFilter');
		var countySelect = document.getElementById('countyFilter');
		if (!districtSelect || !countySelect) return;

		var districts = {};
		var counties = {};
		allRoads.forEach(function (feature) {
			var district = getDistrictValue(feature);
			var county = getCountyValue(feature);
			if (changedFilter !== 'COUNTY' || currentCountyFilter === 'ALL' || county === currentCountyFilter) {
				if (district) districts[district] = true;
			}
			if (changedFilter !== 'DISTRICT' || currentDistrictFilter === 'ALL' || district === currentDistrictFilter) {
				if (county) counties[county] = true;
			}
		});

		var districtValues = sortFilterValues(Object.keys(districts));
		var countyValues = sortFilterValues(Object.keys(counties));
		replaceFilterOptions(districtSelect, 'All Districts', districtValues, currentDistrictFilter);
		replaceFilterOptions(countySelect, 'All Counties', countyValues, currentCountyFilter);
		currentDistrictFilter = districtSelect.value;
		currentCountyFilter = countySelect.value;
	}

	function applyRoadFilters() {
		selectedFeature = null;
		allRoads.revertStyle();
		allRoads.setStyle(getPCRRoadStyle);
		selectedRoad.forEach(function (feature) { selectedRoad.remove(feature); });
	}

	function getPCRRoadStyle(feature) {
		var pcr = parseFloat(feature.getProperty('PCR'));
		var category = 'NO_DATA';
		var color = '#808080';

		if (!isNaN(pcr)) {
			if (pcr >= 7.5) {
				category = 'GREEN';
				color = '#00C853';
			} else if (pcr >= 6.5) {
				category = 'YELLOW';
				color = '#FFD600';
			} else {
				category = 'RED';
				color = '#D50000';
			}
		}

		var district = getDistrictValue(feature);
		var county = getCountyValue(feature);
		var fnMatch = currentPCRFilter === 'ALL' || currentPCRFilter === category;
		var districtMatch = currentDistrictFilter === 'ALL' || district === currentDistrictFilter;
		var countyMatch = currentCountyFilter === 'ALL' || county === currentCountyFilter;
		var visible = fnMatch && districtMatch && countyMatch;

		return {
			strokeColor: color,
			strokeWeight: visible ? 5 : 0,
			strokeOpacity: visible ? 0.85 : 0,
			zIndex: 5,
			clickable: visible
		};
	}

	allRoads.setStyle(getPCRRoadStyle);

	var pcrFilter = document.getElementById('pcrFilter');
	var districtFilter = document.getElementById('districtFilter');
	var countyFilter = document.getElementById('countyFilter');

	updateDistrictCountyOptions('INITIAL');

	if (pcrFilter) {
		pcrFilter.value = currentPCRFilter;
		pcrFilter.addEventListener('change', function () {
			currentPCRFilter = this.value;
			applyRoadFilters();
		});
	}

	if (districtFilter) {
		districtFilter.addEventListener('change', function () {
			currentDistrictFilter = this.value;
			updateDistrictCountyOptions('DISTRICT');
			applyRoadFilters();
		});
	}

	if (countyFilter) {
		countyFilter.addEventListener('change', function () {
			currentCountyFilter = this.value;
			updateDistrictCountyOptions('COUNTY');
			applyRoadFilters();
		});
	}
	/*
	 * Build a Turf LineString from a Google Maps Data feature.
	 * Uses only the documented Maps Data API.
	 */
	function buildSelectedLine(feature) {
		var coordinates = [];
		var geometry = feature.getGeometry();

		if (!geometry) {
			return null;
		}

		geometry.forEachLatLng(function (latLng) {
			coordinates.push([latLng.lng(), latLng.lat()]);
		});

		if (coordinates.length < 2) {
			return null;
		}

		return {
			"type": "Feature",
			"properties": {
				"ROADWAY": feature.getProperty("RDWYID"),
				"BEGIN_POST": parseFloat(feature.getProperty("BMP")),
				"END_POST": parseFloat(feature.getProperty("EMP")),
				"PCR": parseFloat(feature.getProperty("PCR"))
			},
			"geometry": {
				"type": "LineString",
				"coordinates": coordinates
			}
		};
	}

	/*
	 * Shared handler used by both the original pink layer and the
	 * green/red selected-road layer.
	 */
	function processRoadClick(e, sourceLayer) {
		if (!e || !e.feature || !e.latLng) {
			return;
		}

		infowindow.close();
		MPmarker.setVisible(false);

		var roadway = e.feature.getProperty("RDWYID");
		if (roadway === undefined || roadway === null || roadway === "") {
			console.error("Clicked feature has no ROADWAY property.");
			return;
		}

		// Always populate the RWYID input, regardless of line color/layer.
		s_rdwyid.value = String(roadway);

		selectedLine = buildSelectedLine(e.feature);
		if (!selectedLine) {
			console.error("Unable to build roadway geometry for " + roadway);
			return;
		}

		var pt = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": [e.latLng.lng(), e.latLng.lat()]
			}
		};

		var ptOnLine;
		try {
			ptOnLine = turf.pointOnLine(selectedLine, pt, "miles");
		} catch (error) {
			console.error("Unable to locate the clicked point on " + roadway, error);
			return;
		}

		// Restore the previous selection to its PCR/filter style.
		if (selectedFeature) {
			allRoads.revertStyle(selectedFeature);
		}
		selectedFeature = e.feature;
		allRoads.overrideStyle(selectedFeature, {
			strokeColor: '#0066FF',
			strokeWeight: 8,
			strokeOpacity: 1,
			zIndex: 20,
			clickable: true
		});

		var newpt = new google.maps.LatLng({
			lat: ptOnLine.geometry.coordinates[1],
			lng: ptOnLine.geometry.coordinates[0]
		});

		sv.getPanorama({
			location: newpt,
			radius: 50
		}, processSVData);
	}

	allRoads.addListener('click', function (e) {
		processRoadClick(e, allRoads);
	});

	selectedRoad.addListener('click', function (e) {
		processRoadClick(e, selectedRoad);
	});
	if (s_rdwyid.value != "") {
		loadInitial(0);
	}
};
function processSVData(data, status) {
	finishLoading();
	if (status !== google.maps.StreetViewStatus.OK || !data || !data.location) {
		console.error('Street View data not found or invalid.', status);
		return;
	}
	var panoId = data.location.pano || data.location.panoId || data.location.id;
	if (typeof panoId === 'string' && panoId.length > 0) {
		panorama.setPano(panoId);
	} else if (data.location.latLng) {
		panorama.setPosition(data.location.latLng);
	} else {
		console.error('Invalid Street View response', data.location);
		return;
	}
	panorama.setPov({heading: Number(curheading)||0,pitch: Number(curpitch)||0});
	panorama.setVisible(true);
};
function refreshMap(pos) {
	while (typeof map === 'undefined') {
		refreshMap(pos);
	}
	map.panTo(pos);
	MPmarker.setVisible(true);
	MPmarker.setMap(map);
	MPmarker.setPosition(pos);
	if (typeof selectedLine != 'undefined') {
		var pt = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": [pos.lng(), pos.lat()]
			}
		}
		var start = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": selectedLine.geometry.coordinates[0]
			}
		};
		var shpLenth = turf.lineDistance(selectedLine, 'miles');
		var sliced = turf.lineSlice(start, pt, selectedLine);
		var leng = turf.lineDistance(sliced, 'miles');
		shp_mp_ratio = shpLenth / (selectedLine.properties.END_POST - selectedLine.properties.BEGIN_POST);
		var newmp = selectedLine.properties.BEGIN_POST + leng / shp_mp_ratio;
		newmp = newmp.toFixed(3);
		s_mp.value = newmp;
		var label = MPmarker.getLabel();
		label.text = s_mp.value;
		MPmarker.setLabel(label);
		refreshURL();
	}
}
window.onpopstate = function (e) {
	s_rdwyid.value = "";
	s_mp.value = "";
	initialize();
	refreshURL();
};
function refreshURL() {
	if (s_rdwyid.value == "" & s_mp.value == "") {
		uid = "";
	} else {
		uid = "#id=" + s_rdwyid.value + "&mp=" + s_mp.value;
	}
	var stateObj = {
		foo: uid
	};
	var newURL = site + uid;
	window.history.pushState(stateObj, "SMO Navi", newURL);
};
var d = $('#divider');
var t = $('#pano');
var b = $('#map');
var h = $('body').height();
var w = $('body').width();
var isDragging = false;
var isLandscape = false;
d.mousedown(function (e) {
	isDragging = true;
	e.preventDefault();
});
$(document).mouseup(function () {
	isDragging = false;
}).mousemove(function (e) {
	if (isDragging) {
		if (!isLandscape) {
			t.css('height', e.pageY);
			b.css('height', h - e.pageY - d.height());
		} else {
			t.css('width', e.pageX);
			b.css('width', w - e.pageX - d.width() - 0.014 * w);
		}
		google.maps.event.trigger(map, "resize");
		google.maps.event.trigger(panorama, "resize");
		curpos = panorama.getPosition();
		map.panTo(curpos);
		MPmarker.setPosition(curpos);
	}
});
var rotateBtn = document.getElementById('rotateScreen');
if (rotateBtn) {
	rotateBtn.addEventListener('click', rotateDisplay, false);
} else {
	throw error;
}
function rotateDisplay() {
	if (!isLandscape) {
		isLandscape = true;
		t.css('height', h);
		t.css('width', Math.round(0.70 * w));
		b.css('height', h);
		b.css('width', Math.round(0.29 * w) - 0.01 * w);
		d.css('height', h);
		d.css('width', (w - t.width() - b.width()) / 3);
		d.css('cursor', 'w-resize');
	} else {
		isLandscape = false;
		t.css('height', Math.round(0.70 * h));
		t.css('width', w);
		t.css('float', 'left');
		b.css('height', Math.round(0.29 * h));
		b.css('width', w);
		b.css('float', 'left');
		d.css('height', h - t.height() - b.height());
		d.css('width', w);
		d.css('cursor', 'n-resize');
		d.css('float', 'left');
	}
	google.maps.event.trigger(map, "resize");
	google.maps.event.trigger(panorama, "resize");
	curpos = panorama.getPosition();
	map.panTo(curpos);
	MPmarker.setPosition(curpos);
}
var goBtn = document.getElementById('goToMP');
if (goBtn) {
	goBtn.addEventListener('click', function () {
		loadInitial(0);
	}, false);
} else {
	throw error;
}
var goBMPBtn = document.getElementById('goBMP');
if (goBMPBtn) {
	goBMPBtn.addEventListener('click', function () {
		loadInitial(1);
	}, false);
} else {
	throw error;
}
var goEMPBtn = document.getElementById('goEMP');
if (goEMPBtn) {
	goEMPBtn.addEventListener('click', function () {
		loadInitial(2);
	}, false);
} else {
	throw error;
}
function loadInitial(MPtype) {
	var validRdwyID = false;
	var BMPs = [];
	var EMPs = [];
	if (s_rdwyid.value === "") {
		alert("Please enter Road ID");
		return;
	} else {
		allRoads.revertStyle();
		selectedRoad.forEach(function (ff) {
			selectedRoad.remove(ff);
		});
		allRoads.forEach(function (feature) {
			if (feature.getProperty("RDWYID") == s_rdwyid.value) {
				validRdwyID = true;
				allRoads.overrideStyle(feature, {
					strokeWeight: 0
				});
				selectedRoad.add(feature);
				BMPs.push(parseFloat(feature.getProperty("BMP")));
				EMPs.push(parseFloat(feature.getProperty("EMP")));
			}
		});
		selectedRoad.setMap(map);
		selectedRoad.setStyle({
			strokeColor: '#0066FF',
			strokeWeight: 8,
			strokeOpacity: 1,
			zIndex: 20,
			clickable: true
		});
		var minBMP;
		var maxEMP;
		var curBMP;
		var curEMP;
		if (validRdwyID) {
			if (s_mp.value === "") {
				minBMP = BMPs.reduce(function (a, b) {
						return Math.min(a, b);
					});
				maxEMP = EMPs.reduce(function (a, b) {
						return Math.max(a, b);
					});
			} else {
				for (i = 0; i < BMPs.length; i++) {
					if (BMPs[i] <= parseFloat(s_mp.value) && EMPs[i] >= parseFloat(s_mp.value)) {
						curBMP = BMPs[i];
						curEMP = EMPs[i];
					}
				}
			}
			if (MPtype == 0) {
				if (s_mp.value === "") {
					s_mp.value = minBMP;
				}
				if (typeof curBMP == 'undefined') {
					curBMP = minBMP;
				}
				curEMP = EMPs[BMPs.indexOf(curBMP)];
			} else if (MPtype == 1) {
				if (typeof curBMP == 'undefined') {
					curBMP = minBMP;
				}
				s_mp.value = curBMP;
				curEMP = EMPs[BMPs.indexOf(curBMP)];
			} else {
				if (typeof curEMP == 'undefined') {
					curEMP = maxEMP;
				}
				s_mp.value = curEMP;
				curBMP = BMPs[EMPs.indexOf(curEMP)];
			}
			if (typeof curBMP == 'undefined') {
				alert("Please enter a valid milepoint");
				return;
			} else {
				selectedRoad.forEach(function (ff) {
					if (parseFloat(ff.getProperty("BMP")) == curBMP) {
						selectedLine = {
							"type": "Feature",
							"properties": {},
							"geometry": {
								"type": "LineString",
								"coordinates": []
							}
						};
						selectedLine.properties = {
							ROADWAY: ff.getProperty("RDWYID"),
							BEGIN_POST: parseFloat(ff.getProperty("BMP")),
							END_POST: parseFloat(ff.getProperty("EMP")),
							PCR: parseFloat(ff.getProperty("PCR"))
						};
						ff.getGeometry().forEachLatLng(function (latLng) {
							selectedLine.geometry.coordinates.push([latLng.lng(), latLng.lat()]);
						});
					}
				});
			}
		} else {
			alert("Unable to find this Road ID");
			return;
		}
		bmp = selectedLine.properties.BEGIN_POST;
		emp = selectedLine.properties.END_POST;
		var mplen = emp - bmp;
		var shplen = turf.lineDistance(selectedLine, 'miles');
		shp_mp_ratio = shplen / mplen;
		var mp = parseFloat(s_mp.value);
		if (mp <= emp && mp >= bmp) {
			var mptshplen = (mp - bmp) * shp_mp_ratio;
			var mp_pt = turf.along(selectedLine, mptshplen, 'miles');
			curpos = new google.maps.LatLng({
					lat: mp_pt.geometry.coordinates[1],
					lng: mp_pt.geometry.coordinates[0]
				});
			sv.getPanorama({
				location: curpos,
				radius: 50
			}, processSVData);
		} else {
			alert("Please enter a valid milepoint");
			return;
		}
	}
};

/* ================================================================
 * PCR DASHBOARD AND CSV EXPORT
 * Good: PCR >= 7.5 | Fair: 6.5 <= PCR < 7.5 | Poor: PCR < 6.5
 * ================================================================ */
(function () {
    "use strict";

    var categoryChart = null;
    var histogramChart = null;
    var chartLoading = false;
    var chartCallbacks = [];

    function filterValue(globalName, elementId) {
        if (typeof window[globalName] !== "undefined") {
            return String(window[globalName]);
        }
        var element = document.getElementById(elementId);
        return element ? String(element.value) : "ALL";
    }

    function property(feature, names) {
        for (var i = 0; i < names.length; i++) {
            var value = feature.getProperty(names[i]);
            if (value !== undefined && value !== null && String(value).trim() !== "") {
                return value;
            }
        }
        return "";
    }

    function categoryForPCR(pcr) {
        if (pcr >= 7.5) return "GREEN";
        if (pcr >= 6.5) return "YELLOW";
        return "RED";
    }

    function categoryLabel(category) {
        if (category === "GREEN") return "Good";
        if (category === "YELLOW") return "Fair";
        if (category === "RED") return "Poor";
        return "Unknown";
    }

    function collectSelectedRoadways() {
        var district = filterValue("currentDistrictFilter", "districtFilter");
        var county = filterValue("currentCountyFilter", "countyFilter");
        var pcrCategory = filterValue("currentPCRFilter", "pcrFilter");
        var rows = [];

        if (typeof allRoads === "undefined" || !allRoads || typeof allRoads.forEach !== "function") {
            throw new Error("Roadway data has not finished loading.");
        }

        allRoads.forEach(function (feature) {
            var featureDistrict = String(property(feature, ["DISTRICT", "DistrictID", "District"])).trim();
            var featureCounty = String(property(feature, ["COUNTY", "CountyName", "County"])).trim();
            var pcr = parseFloat(property(feature, ["PCR"]));
            var bmp = parseFloat(property(feature, ["BMP", "BEGIN_POST", "BegMP"]));
            var emp = parseFloat(property(feature, ["EMP", "END_POST", "EndMP"]));

            if (district !== "ALL" && featureDistrict !== district) return;
            if (county !== "ALL" && featureCounty !== county) return;
            if (!isFinite(pcr)) return;

            var category = categoryForPCR(pcr);
            if (pcrCategory !== "ALL" && category !== pcrCategory) return;

            rows.push({
                RDWYID: String(property(feature, ["RDWYID", "ROADWAY", "RoadwayId"])),
                DISTRICT: featureDistrict,
                COUNTY: featureCounty,
                DIR: String(property(feature, ["DIR"])),
                BMP: isFinite(bmp) ? bmp : "",
                EMP: isFinite(emp) ? emp : "",
                MILEAGE: isFinite(bmp) && isFinite(emp) ? Math.abs(emp - bmp) : "",
                PCR: pcr,
                CATEGORY: categoryLabel(category),
                CRACKRATIN: property(feature, ["CRACKRATIN", "CRACKRATING"]),
                RUTRATING: property(feature, ["RUTRATING"]),
                RIDERATING: property(feature, ["RIDERATING"])
            });
        });

        rows.sort(function (a, b) {
            return a.DISTRICT.localeCompare(b.DISTRICT, undefined, {numeric: true}) ||
                a.COUNTY.localeCompare(b.COUNTY) ||
                a.RDWYID.localeCompare(b.RDWYID, undefined, {numeric: true}) ||
                Number(a.BMP || 0) - Number(b.BMP || 0);
        });

        return {
            district: district,
            county: county,
            pcrCategory: pcrCategory,
            rows: rows
        };
    }

    function calculateStatistics(selection) {
        var stats = {
            good: 0,
            fair: 0,
            poor: 0,
            total: 0,
            histogram: new Array(20).fill(0)
        };

        selection.rows.forEach(function (row) {
            var miles = Number(row.MILEAGE || 0);
            if (row.CATEGORY === "Good") stats.good += miles;
            else if (row.CATEGORY === "Fair") stats.fair += miles;
            else if (row.CATEGORY === "Poor") stats.poor += miles;

            var bounded = Math.max(0, Math.min(9.999999, Number(row.PCR)));
            stats.histogram[Math.floor(bounded / 0.5)] += miles;
        });

        stats.total = stats.good + stats.fair + stats.poor;
        return stats;
    }

    function csvCell(value) {
        var text = value === null || value === undefined ? "" : String(value);
        return '"' + text.replace(/"/g, '""') + '"';
    }

    function safeFilePart(value, allText) {
        if (value === "ALL") return allText;
        return String(value).replace(/[^A-Za-z0-9_-]+/g, "_");
    }

    function downloadRoadwayCSV(selection) {
        try {
            if (!selection || selection.rows.length === 0) {
                alert("No roadway records match the selected District, County, and PCR filters.");
                return;
            }

            var columns = [
                "RDWYID", "DISTRICT", "COUNTY", "DIR", "BMP", "EMP", "MILEAGE",
                "PCR", "CATEGORY", "CRACKRATIN", "RUTRATING", "RIDERATING"
            ];
            var csv = [columns.map(csvCell).join(",")];

            selection.rows.forEach(function (row) {
                csv.push(columns.map(function (column) {
                    var value = row[column];
                    if (column === "MILEAGE" && value !== "") value = Number(value).toFixed(3);
                    return csvCell(value);
                }).join(","));
            });

            var blob = new Blob(["\uFEFF" + csv.join("\r\n")], {
                type: "text/csv;charset=utf-8"
            });
            var link = document.createElement("a");
            var fileName = [
                "PCR_Roadways",
                safeFilePart(selection.district, "AllDistricts"),
                safeFilePart(selection.county, "AllCounties"),
                safeFilePart(categoryLabel(selection.pcrCategory), "AllPCR")
            ].join("_") + ".csv";

            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
        } catch (error) {
            console.error(error);
            alert(error.message || "The export could not be created.");
        }
    }

    var previewSelection = null;
    var previewRows = [];
    var previewSortColumn = "RDWYID";
    var previewSortAscending = true;

    function previewNumber(value, decimals) {
        var number = Number(value);
        return isFinite(number) ? number.toFixed(decimals) : "";
    }

    function visiblePreviewRows() {
        var query = String(document.getElementById("exportPreviewSearch").value || "")
            .trim().toLowerCase();

        if (!query) return previewSelection.rows.slice();

        return previewSelection.rows.filter(function (row) {
            return [
                row.RDWYID, row.DISTRICT, row.COUNTY, row.DIR, row.BMP, row.EMP,
                row.MILEAGE, row.PCR, row.CATEGORY, row.CRACKRATIN,
                row.RUTRATING, row.RIDERATING
            ].join(" ").toLowerCase().indexOf(query) >= 0;
        });
    }

    function sortPreviewRows(rows) {
        return rows.sort(function (a, b) {
            var av = a[previewSortColumn];
            var bv = b[previewSortColumn];
            var an = Number(av);
            var bn = Number(bv);
            var result;

            if (isFinite(an) && isFinite(bn) && av !== "" && bv !== "") {
                result = an - bn;
            } else {
                result = String(av).localeCompare(String(bv), undefined, {
                    numeric: true,
                    sensitivity: "base"
                });
            }

            return previewSortAscending ? result : -result;
        });
    }

    function updatePreviewSummary(rows) {
        var totalMiles = 0;
        var totalPCR = 0;
        var validPCRCount = 0;
        var minPCR = Infinity;
        var maxPCR = -Infinity;

        rows.forEach(function (row) {
            var miles = Number(row.MILEAGE);
            var pcr = Number(row.PCR);
            if (isFinite(miles)) totalMiles += miles;
            if (isFinite(pcr)) {
                totalPCR += pcr;
                validPCRCount++;
                minPCR = Math.min(minPCR, pcr);
                maxPCR = Math.max(maxPCR, pcr);
            }
        });

        document.getElementById("exportPreviewSummary").innerHTML =
            "<b>Displayed segments:</b> " + rows.length +
            " &nbsp; <b>Mileage:</b> " + totalMiles.toFixed(1) + " mi" +
            " &nbsp; <b>Average PCR:</b> " +
            (validPCRCount ? (totalPCR / validPCRCount).toFixed(2) : "N/A") +
            " &nbsp; <b>Lowest PCR:</b> " +
            (validPCRCount ? minPCR.toFixed(2) : "N/A") +
            " &nbsp; <b>Highest PCR:</b> " +
            (validPCRCount ? maxPCR.toFixed(2) : "N/A");
    }

    function renderPreviewTable() {
        if (!previewSelection) return;

        previewRows = sortPreviewRows(visiblePreviewRows());
        updatePreviewSummary(previewRows);

        var tbody = document.querySelector("#exportPreviewTable tbody");
        tbody.innerHTML = "";

        previewRows.forEach(function (row) {
            var tr = document.createElement("tr");
            tr.innerHTML =
                "<td>" + row.RDWYID + "</td>" +
                "<td>" + row.DISTRICT + "</td>" +
                "<td>" + row.COUNTY + "</td>" +
                "<td>" + row.DIR + "</td>" +
                "<td>" + previewNumber(row.BMP, 3) + "</td>" +
                "<td>" + previewNumber(row.EMP, 3) + "</td>" +
                "<td>" + previewNumber(row.MILEAGE, 3) + "</td>" +
                "<td>" + previewNumber(row.PCR, 2) + "</td>" +
                "<td>" + row.CATEGORY + "</td>" +
                "<td>" + row.CRACKRATIN + "</td>" +
                "<td>" + row.RUTRATING + "</td>" +
                "<td>" + row.RIDERATING + "</td>";
            tbody.appendChild(tr);
        });

        document.getElementById("exportDisplayedCSV").disabled =
            previewRows.length === 0;
    }

    function showExportPreview() {
        try {
            previewSelection = collectSelectedRoadways();

            if (previewSelection.rows.length === 0) {
                alert("No roadway records match the selected District, County, and PCR filters.");
                return;
            }

            previewSortColumn = "RDWYID";
            previewSortAscending = true;
            document.getElementById("exportPreviewSearch").value = "";
            document.getElementById("exportPreviewScope").textContent =
                "District: " + (previewSelection.district === "ALL" ? "All" : previewSelection.district) +
                " | County: " + (previewSelection.county === "ALL" ? "All" : previewSelection.county) +
                " | PCR: " + (previewSelection.pcrCategory === "ALL" ? "All" : categoryLabel(previewSelection.pcrCategory));

            renderPreviewTable();
            document.getElementById("exportPreviewBackdrop").style.display = "block";
            document.getElementById("exportPreviewModal").style.display = "block";
        } catch (error) {
            console.error(error);
            alert(error.message || "The roadway preview could not be created.");
        }
    }

    function closeExportPreview() {
        document.getElementById("exportPreviewBackdrop").style.display = "none";
        document.getElementById("exportPreviewModal").style.display = "none";
    }

    function exportDisplayedPreviewRows() {
        if (!previewSelection || previewRows.length === 0) return;
        downloadRoadwayCSV({
            district: previewSelection.district,
            county: previewSelection.county,
            pcrCategory: previewSelection.pcrCategory,
            rows: previewRows
        });
    }

    function loadChartJs(callback) {
        if (typeof window.Chart !== "undefined") {
            callback();
            return;
        }
        chartCallbacks.push(callback);
        if (chartLoading) return;
        chartLoading = true;

        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js";
        script.async = true;
        script.onload = function () {
            chartLoading = false;
            while (chartCallbacks.length) chartCallbacks.shift()();
        };
        script.onerror = function () {
            chartLoading = false;
            chartCallbacks = [];
            alert("Chart.js could not be loaded. Check the internet connection.");
        };
        document.head.appendChild(script);
    }

    function histogramLabels() {
        var labels = [];
        for (var i = 0; i < 20; i++) {
            labels.push((i * 0.5).toFixed(1) + "-" + ((i + 1) * 0.5).toFixed(1));
        }
        return labels;
    }

    function card(title, value, color) {
        return '<div style="border-left:6px solid ' + color + ';background:#f7f7f7;padding:12px;border-radius:5px;">' +
            '<div style="font-size:13px;color:#555">' + title + '</div>' +
            '<div style="font-size:24px;font-weight:700;margin-top:4px">' + value.toFixed(1) + ' mi</div></div>';
    }

    function drawDashboard(selection) {
        var stats = calculateStatistics(selection);
        document.getElementById("pcrDashboardScope").textContent =
            "District: " + (selection.district === "ALL" ? "All" : selection.district) +
            " | County: " + (selection.county === "ALL" ? "All" : selection.county) +
            " | PCR filter: " + (selection.pcrCategory === "ALL" ? "All" : categoryLabel(selection.pcrCategory));

        document.getElementById("pcrSummaryCards").innerHTML =
            card("Good, PCR >= 7.5", stats.good, "#00C853") +
            card("Fair, 6.5 <= PCR < 7.5", stats.fair, "#FFD600") +
            card("Poor, PCR < 6.5", stats.poor, "#D50000") +
            card("Total", stats.total, "#0066FF");

        if (categoryChart) categoryChart.destroy();
        if (histogramChart) histogramChart.destroy();

        categoryChart = new Chart(document.getElementById("pcrCategoryChart"), {
            type: "bar",
            data: {
                labels: ["Good", "Fair", "Poor"],
                datasets: [{data: [stats.good, stats.fair, stats.poor], backgroundColor: ["#00C853", "#FFD600", "#D50000"]}]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {title: {display: true, text: "Mileage by PCR Category"}, legend: {display: false}},
                scales: {y: {beginAtZero: true, title: {display: true, text: "Miles"}}}
            }
        });

        histogramChart = new Chart(document.getElementById("pcrHistogramChart"), {
            type: "bar",
            data: {labels: histogramLabels(), datasets: [{data: stats.histogram, backgroundColor: "#4285F4", barPercentage: 1, categoryPercentage: 1}]},
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {title: {display: true, text: "PCR Mileage Histogram"}, legend: {display: false}},
                scales: {
                    x: {title: {display: true, text: "PCR range"}, ticks: {maxRotation: 60, minRotation: 45}},
                    y: {beginAtZero: true, title: {display: true, text: "Miles"}}
                }
            }
        });
    }

    function openDashboard() {
        try {
            var selection = collectSelectedRoadways();
            document.getElementById("pcrDashboardBackdrop").style.display = "block";
            document.getElementById("pcrDashboardModal").style.display = "block";
            loadChartJs(function () { drawDashboard(selection); });
        } catch (error) {
            console.error(error);
            alert(error.message || "The dashboard could not be opened.");
        }
    }

    function closeDashboard() {
        document.getElementById("pcrDashboardBackdrop").style.display = "none";
        document.getElementById("pcrDashboardModal").style.display = "none";
    }

    function createInterface() {
        var panel = document.getElementById("floating-panel");
        if (panel) {
            if (!document.getElementById("showPCRDashboard")) {
                var dashboardButton = document.createElement("button");
                dashboardButton.id = "showPCRDashboard";
                dashboardButton.type = "button";
                dashboardButton.textContent = "Dashboard";
                dashboardButton.style.marginLeft = "4px";
                panel.appendChild(dashboardButton);
            }
            if (!document.getElementById("exportPCRRoadways")) {
                var exportButton = document.createElement("button");
                exportButton.id = "exportPCRRoadways";
                exportButton.type = "button";
                exportButton.textContent = "Export";
                exportButton.title = "Export roadways matching the selected District, County, and PCR filters";
                exportButton.style.marginLeft = "4px";
                panel.appendChild(exportButton);
            }
        }

        if (!document.getElementById("pcrDashboardModal")) {
            var backdrop = document.createElement("div");
            backdrop.id = "pcrDashboardBackdrop";
            backdrop.style.cssText = "display:none;position:fixed;z-index:99999;inset:0;background:rgba(0,0,0,.45)";

            var modal = document.createElement("div");
            modal.id = "pcrDashboardModal";
            modal.style.cssText = "display:none;position:fixed;z-index:100000;left:5%;top:5%;width:90%;height:88%;background:#fff;border:1px solid #666;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.35);overflow:auto";
            modal.innerHTML =
                '<div style="position:sticky;top:0;background:#fff;padding:12px 16px;border-bottom:1px solid #ddd;z-index:2">' +
                '<button id="closePCRDashboard" type="button" style="float:right">Close</button>' +
                '<h2 style="margin:0">PCR Dashboard</h2><div id="pcrDashboardScope" style="margin-top:6px;color:#444"></div></div>' +
                '<div style="padding:16px"><div id="pcrSummaryCards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:18px"></div>' +
                '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px">' +
                '<div style="height:330px"><canvas id="pcrCategoryChart"></canvas></div>' +
                '<div style="height:330px"><canvas id="pcrHistogramChart"></canvas></div></div>' +
                '<p style="font-size:12px;color:#555">Mileage is calculated as ABS(EMP - BMP). Export uses the selected District, County, and PCR filters.</p></div>';

            document.body.appendChild(backdrop);
            document.body.appendChild(modal);
        }

        if (!document.getElementById("exportPreviewModal")) {
            var previewBackdrop = document.createElement("div");
            previewBackdrop.id = "exportPreviewBackdrop";
            previewBackdrop.style.cssText =
                "display:none;position:fixed;z-index:100001;inset:0;background:rgba(0,0,0,.45)";

            var previewModal = document.createElement("div");
            previewModal.id = "exportPreviewModal";
            previewModal.style.cssText =
                "display:none;position:fixed;z-index:100002;left:3%;top:4%;width:94%;height:90%;" +
                "background:#fff;border:1px solid #666;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.35);overflow:hidden";
            previewModal.innerHTML =
                '<div style="padding:12px 16px;border-bottom:1px solid #ddd;background:#fff">' +
                '<button id="closeExportPreview" type="button" style="float:right">Close</button>' +
                '<button id="exportDisplayedCSV" type="button" style="float:right;margin-right:8px">Export Displayed CSV</button>' +
                '<button id="exportAllPreviewCSV" type="button" style="float:right;margin-right:8px">Export All CSV</button>' +
                '<h2 style="margin:0">Roadway Export Preview</h2>' +
                '<div id="exportPreviewScope" style="margin-top:5px;color:#444"></div></div>' +
                '<div style="padding:12px 16px">' +
                '<label for="exportPreviewSearch"><b>Search:</b></label> ' +
                '<input id="exportPreviewSearch" type="search" placeholder="RDWYID, county, PCR, category..." style="width:320px;max-width:60%">' +
                '<div id="exportPreviewSummary" style="margin:10px 0"></div>' +
                '<div style="height:calc(90vh - 190px);overflow:auto;border:1px solid #ccc">' +
                '<table id="exportPreviewTable" style="border-collapse:collapse;width:100%;font-size:13px">' +
                '<thead style="position:sticky;top:0;background:#eee;z-index:1"><tr>' +
                '<th data-column="RDWYID">RDWYID</th><th data-column="DISTRICT">District</th>' +
                '<th data-column="COUNTY">County</th><th data-column="DIR">DIR</th><th data-column="BMP">BMP</th>' +
                '<th data-column="EMP">EMP</th><th data-column="MILEAGE">Mileage</th>' +
                '<th data-column="PCR">PCR</th><th data-column="CATEGORY">Category</th>' +
                '<th data-column="CRACKRATIN">Crack</th><th data-column="RUTRATING">Rut</th>' +
                '<th data-column="RIDERATING">Ride</th></tr></thead><tbody></tbody></table></div></div>';

            document.body.appendChild(previewBackdrop);
            document.body.appendChild(previewModal);

            var previewStyle = document.createElement("style");
            previewStyle.textContent =
                "#exportPreviewTable th,#exportPreviewTable td{border:1px solid #ccc;padding:6px 8px;text-align:left;white-space:nowrap}" +
                "#exportPreviewTable th{cursor:pointer;user-select:none}" +
                "#exportPreviewTable tbody tr:nth-child(even){background:#f7f7f7}" +
                "#exportPreviewTable tbody tr:hover{background:#e8f1ff}";
            document.head.appendChild(previewStyle);
        }

        document.getElementById("showPCRDashboard").addEventListener("click", openDashboard);
        document.getElementById("exportPCRRoadways").addEventListener("click", showExportPreview);
        document.getElementById("closeExportPreview").addEventListener("click", closeExportPreview);
        document.getElementById("exportPreviewBackdrop").addEventListener("click", closeExportPreview);
        document.getElementById("exportPreviewSearch").addEventListener("input", renderPreviewTable);
        document.getElementById("exportAllPreviewCSV").addEventListener("click", function () {
            if (previewSelection) downloadRoadwayCSV(previewSelection);
        });
        document.getElementById("exportDisplayedCSV").addEventListener("click", exportDisplayedPreviewRows);
        document.querySelectorAll("#exportPreviewTable th[data-column]").forEach(function (header) {
            header.addEventListener("click", function () {
                var column = this.getAttribute("data-column");
                if (previewSortColumn === column) previewSortAscending = !previewSortAscending;
                else { previewSortColumn = column; previewSortAscending = true; }
                renderPreviewTable();
            });
        });
        document.getElementById("closePCRDashboard").addEventListener("click", closeDashboard);
        document.getElementById("pcrDashboardBackdrop").addEventListener("click", closeDashboard);
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") { closeDashboard(); closeExportPreview(); }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createInterface);
    } else {
        createInterface();
    }
}());
