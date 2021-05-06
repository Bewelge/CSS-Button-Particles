import { getSetting } from "./Settings.js"

export class CssGenerator {
	constructor(keyframes, shapes) {
		this.keyframes = keyframes
		this.shapes = shapes
	}
	generateCss() {
		this.bgImageString = this.getBgImageString()
		this.keyframesString = this.getKeyframeString()

		return this

		// let initalBgPosString = "background-position: "
		// keyframes.forEach((keyframe, keyframeIndex) => {
		// 	shapes.forEach((shape, shapeIndex) => {
		// 		// bgImageString += getBgImageShapeString(shape)
		// 	})
		// })
	}
	getBgImageString() {
		let bgImageString = ".animated::after {background-image: "
		this.shapes.forEach((shape, shapeIndex) => {
			bgImageString += this.getBgImageShapeString(shape)
			if (shapeIndex < this.shapes.length - 1) {
				bgImageString += ","
			}
		})
		bgImageString +=
			"; animation: bubbles1 linear " +
			getSetting("animationDuration") +
			"s forwards;}"

		return bgImageString
	}

	appendStyleTagToBody() {
		let styleTag = document.body.querySelector("#buttonAnimation")
		if (styleTag) {
			document.body.removeChild(styleTag)
		}
		document.body.appendChild(
			wrapInStyleTag(this.bgImageString + " " + this.keyframesString)
		)
		return styleTag
	}

	getKeyframeString() {
		let animationName = "bubbles1"
		let keyframesString = "@keyframes " + animationName + " {"
		this.keyframes.forEach((keyframe, index) => {
			keyframesString += Math.floor(keyframe * 100) + "% {"

			keyframesString += this.getBgSizeString(index)
			keyframesString += this.getBgPositionString(index)
			keyframesString += "}"
		})
		keyframesString += "}"
		return keyframesString
	}
	getBgSizeString(keyframeIndex) {
		let sizeString = "background-size: "
		this.shapes.forEach((shape, index) => {
			sizeString +=
				shape.sizes[keyframeIndex][0] +
				"px " +
				shape.sizes[keyframeIndex][1] +
				"px"
			if (index < this.shapes.length - 1) {
				sizeString += ","
			}
		})
		sizeString += ";"
		return sizeString
	}
	getBgPositionString(keyframeIndex) {
		let posString = "background-position: "
		this.shapes.forEach((shape, index) => {
			posString +=
				shape.positions[keyframeIndex][0] +
				"px " +
				shape.positions[keyframeIndex][1] +
				"px"
			if (index < this.shapes.length - 1) {
				posString += ","
			}
		})
		posString += ";"
		return posString
	}
	getBgImageShapeString(shape) {
		let circlePercent = 45
		let str = ""
		if (shape.type == "circle") {
			str +=
				"radial-gradient(circle, " +
				// " transparent " +
				// (circlePercent - 5) +
				// "%, " +
				shape.color +
				" " +
				circlePercent +
				"%, transparent " +
				(circlePercent + 5) +
				"%)"
		}
		return str
	}
}

function wrapInStyleTag(styleString) {
	let styleEl = document.createElement("style")
	styleEl.id = "buttonAnimation"
	styleEl.innerHTML = styleString
	return styleEl
}

function getRandomColor() {
	let sign = Math.sign(Math.random() - Math.random())
	let colors = [100, 100, 200]
	colors.sort((a, b) => Math.random() - Math.random())
	return "rgba(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"
}
