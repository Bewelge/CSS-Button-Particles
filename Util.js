function formatTime(seconds, showMilis) {
	seconds = Math.max(seconds, 0)
	let date = new Date(seconds * 1000)
	let timeStrLength = showMilis ? 11 : 8
	try {
		let timeStr = date.toISOString().substr(11, timeStrLength)
		if (timeStr.substr(0, 2) == "00") {
			timeStr = timeStr.substr(3)
		}
		return timeStr
	} catch (e) {
		console.error(e)
		//ignore this. only seems to happend when messing with breakpoints in devtools
	}
}
function arrayContains(arr, item) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] == item) {
			return true
		}
	}
	return false
}
/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Number} radius
 */
function drawRoundRect(ctx, x, y, width, height, radius, isRounded) {
	// radius = radius * 2 < ( Math.min( height, width ) ) ? radius : ( Math.min( height, width ) ) / 2
	if (typeof radius === "undefined") {
		radius = 0
	}
	if (typeof radius === "number") {
		radius = Math.min(radius, Math.min(width / 2, height / 2))
		radius = {
			tl: radius,
			tr: radius,
			br: radius,
			bl: radius
		}
	} else {
		var defaultRadius = {
			tl: 0,
			tr: 0,
			br: 0,
			bl: 0
		}
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side]
		}
	}

	ctx.beginPath()
	if (!isRounded) {
		ctx.moveTo(x + radius.tl, y)
		ctx.lineTo(x + width - radius.tr, y)
		ctx.lineTo(x + width, y + radius.tr)
		ctx.lineTo(x + width, y + height - radius.br)
		ctx.lineTo(x + width - radius.br, y + height)
		ctx.lineTo(x + radius.bl, y + height)
		ctx.lineTo(x, y + height - radius.bl)
		ctx.lineTo(x, y + radius.tl)
		ctx.lineTo(x + radius.tl, y)
	} else {
		ctx.moveTo(x + radius.tl, y)
		ctx.lineTo(x + width - radius.tr, y)
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
		ctx.lineTo(x + width, y + height - radius.br)
		ctx.quadraticCurveTo(
			x + width,
			y + height,
			x + width - radius.br,
			y + height
		)
		ctx.lineTo(x + radius.bl, y + height)
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
		ctx.lineTo(x, y + radius.tl)
		ctx.quadraticCurveTo(x, y, x + radius.tl, y)
	}
	ctx.closePath()
}

function replaceAllString(text, replaceThis, withThat) {
	return text.replace(new RegExp(replaceThis, "g"), withThat)
}

function groupArrayBy(arr, keyFunc) {
	let keys = {}
	arr.forEach(el => (keys[keyFunc(el)] = []))
	Object.keys(keys).forEach(key => {
		arr.forEach(el => (keyFunc(el) == key ? keys[keyFunc(el)].push(el) : null))
	})
	return keys
}
function loadJson(url, callback) {
	let request = new XMLHttpRequest()
	request.overrideMimeType("application/json")
	request.open("GET", url, true)
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == "200") {
			callback(request.responseText)
		}
	}
	request.send(null)
}

function iOS() {
	return (
		[
			"iPad Simulator",
			"iPhone Simulator",
			"iPod Simulator",
			"iPad",
			"iPhone",
			"iPod"
		].includes(navigator.platform) ||
		// iPad on iOS 13 detection
		(navigator.userAgent.includes("Mac") && "ontouchend" in document)
	)
}
function roundToDecimals(value, decimalDigits) {
	let rounder = Math.pow(10, decimalDigits)
	return Math.floor(value * rounder) / rounder
}
function nFormatter(num, digits) {
	var si = [
			{
				value: 1e100,
				symbol: "It's Enough"
			},
			{
				value: 1e93,
				symbol: "Tg"
			},
			{
				value: 1e90,
				symbol: "NVt"
			},
			{
				value: 1e87,
				symbol: "OVt"
			},
			{
				value: 1e84,
				symbol: "SVt"
			},
			{
				value: 1e81,
				symbol: "sVt"
			},
			{
				value: 1e78,
				symbol: "QVt"
			},
			{
				value: 1e75,
				symbol: "qVt"
			},
			{
				value: 1e72,
				symbol: "TVt"
			},
			{
				value: 1e69,
				symbol: "DVt"
			},
			{
				value: 1e66,
				symbol: "UVt"
			},
			{
				value: 1e63,
				symbol: "Vt"
			},
			{
				value: 1e60,
				symbol: "ND"
			},
			{
				value: 1e57,
				symbol: "OD"
			},
			{
				value: 1e54,
				symbol: "SD"
			},
			{
				value: 1e51,
				symbol: "sD"
			},
			{
				value: 1e48,
				symbol: "QD"
			},
			{
				value: 1e45,
				symbol: "qD"
			},
			{
				value: 1e42,
				symbol: "TD"
			},
			{
				value: 1e39,
				symbol: "DD"
			},
			{
				value: 1e36,
				symbol: "UD"
			},
			{
				value: 1e33,
				symbol: "D"
			},
			{
				value: 1e30,
				symbol: "N"
			},
			{
				value: 1e27,
				symbol: "O"
			},
			{
				value: 1e24,
				symbol: "S"
			},
			{
				value: 1e21,
				symbol: "s"
			},
			{
				value: 1e18,
				symbol: "Q"
			},
			{
				value: 1e15,
				symbol: "q"
			},
			{
				value: 1e12,
				symbol: "T"
			},
			{
				value: 1e9,
				symbol: "B"
			},
			{
				value: 1e6,
				symbol: "M"
			},
			{
				value: 1e3,
				symbol: "k"
			}
		],
		i
	if (num < 0) {
		return "-" + nFormatter(-1 * num, digits)
	}
	for (i = 0; i < si.length; i++) {
		if (num >= si[i].value) {
			if (i == 0) {
				return "It's Enough..."
			}
			if (!digits) {
				return Math.floor(num / si[i].value) + si[i].symbol
			}
			return (
				Math.floor((Math.pow(10, digits) * num) / si[i].value) /
					Math.pow(10, digits) +
				si[i].symbol
			)
			//(num / si[i].value).toFixed(digits).replace(/\.?0+$/, "") + si[i].symbol;
		}
	}
	return num
}

function getCssVariable(aVarName) {
	return getComputedStyle(document.documentElement).getPropertyValue(
		"--" + aVarName
	)
}
function distPoints(point1, point2) {
	try {
		return dist(point1.x, point1.y, point2.x, point2.y)
	} catch (e) {
		console.log(point1, point2)
		console.log(e)
	}
}
function dist(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}
function anglePoints(point1, point2) {
	return angle(point1.x, point1.y, point2.x, point2.y)
}
function angle(p1x, p1y, p2x, p2y) {
	return Math.atan2(p2y - p1y, p2x - p1x)
}
function compareAngles(a, b) {
	return Math.abs(
		((a + Math.PI * 2) % (Math.PI * 2)) - ((b + Math.PI * 2) % (Math.PI * 2))
	)
}
function turnTowards(angl, angl2, turnSpeed) {
	angl = angl % (Math.PI * 2)
	angl -= Math.PI
	if (angl < Math.PI * -1) {
		angl += Math.PI * 2
	}
	if (angl2 > Math.PI) {
		angl2 -= Math.PI * 2
	}
	if (angl2 < -1 * Math.PI) {
		angl2 += Math.PI * 2
	}

	if (Math.abs(angl2 - angl) > turnSpeed) {
		if (findSideToTurn(angl, angl2) > 0) {
			return -1
		} else {
			return 1
		}
	}
	return 0
}
function findSideToTurn(ang1, ang2) {
	let dif = ang1 - ang2
	if (dif < 0) {
		dif += Math.PI * 2
	}
	if (dif > Math.PI) {
		return 1
	} else {
		return -1
	}
}
/**
 * Requires p to have .min and .max attributes set.
 *
 * @param {object} p
 * @returns range between p.min and p.max
 */
function getRange(p) {
	return p.max - p.min
}

export {
	formatTime,
	arrayContains,
	drawRoundRect,
	replaceAllString,
	groupArrayBy,
	loadJson,
	iOS,
	roundToDecimals,
	nFormatter,
	getCssVariable,
	distPoints,
	dist,
	anglePoints,
	angle,
	compareAngles,
	turnTowards,
	findSideToTurn,
	getRange
}
