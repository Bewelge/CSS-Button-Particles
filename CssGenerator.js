import { getCssStringForShape } from "./CssShapes.js"
import { SETTING_IDS } from "./DefaultSettings.js"
import { getAllCssSettings, getSetting, getSettingObject } from "./Settings.js"
import { getCssVariable, replaceAllString } from "./Util.js"

class CssGenerator {
	constructor(keyframes, shapes) {
		this.keyframes = keyframes
		this.shapes = shapes
	}
	setData(keyframes, shapes) {
		this.keyframes = keyframes
		this.shapes = shapes
	}
	generateCss() {
		this.bgImageString = this.getBgImageString()
		this.keyframesString = this.getKeyframeString()
		this.buttonStyleString = this.getButtonStyleString()
		// this.progrBarStyleString = this.getProgressBarKeyframeString()

		return this

		// let initalBgPosString = "background-position: "
		// keyframes.forEach((keyframe, keyframeIndex) => {
		// 	shapes.forEach((shape, shapeIndex) => {
		// 		// bgImageString += getBgImageShapeString(shape)
		// 	})
		// })
	}
	getButtonStyleString() {
		let btnWd = getSetting(SETTING_IDS.BUTTON_WIDTH)
		let btnHt = getSetting(SETTING_IDS.BUTTON_HEIGHT)
		let btnEffectWd = getSetting(SETTING_IDS.BG_WIDTH)
		let btnEffectHt = getSetting(SETTING_IDS.BG_HEIGHT)
		return getCssStringFromObj({
			".buttonEffect::after": {
				left: -1 * (btnEffectWd / 2 - btnWd / 2) + "px",
				top: -1 * (btnEffectHt / 2 - btnHt / 2) + "px",
				"min-width": btnEffectWd + "px",
				"min-height": btnEffectHt + "px"
			},
			".button": {
				width: btnWd + "px",
				height: btnHt + "px",
				// background: getSetting(SETTING_IDS.BG_COLOR),
				// color: getSetting(SETTING_IDS.FONT_COLOR),
				"border-radius": getSetting(SETTING_IDS.BUTTON_BORDER_RADIUS) + "%"
			},
			".buttonWrap": {
				width: Math.min(window.innerWidth, btnEffectWd) + "px",
				height: Math.min(400, btnEffectHt) + "px"
			}
		})
	}
	getBgImageString() {
		let bgImageString = ".animated::after {background-image: "
		this.shapes.forEach((shape, shapeIndex) => {
			bgImageString += getCssStringForShape(shape)
			if (shapeIndex < this.shapes.length - 1) {
				bgImageString += ","
			}
		})
		bgImageString +=
			"; animation: bubbles1 linear " +
			getSetting(SETTING_IDS.ANIMATION_DURATION) +
			"s forwards;}"

		return bgImageString
	}

	appendStyleTagToBody() {
		let styleTag = document.body.querySelector("#buttonAnimation")
		if (styleTag) {
			document.body.removeChild(styleTag)
		}
		document.body.appendChild(
			wrapInStyleTag(
				this.bgImageString +
					" " +
					this.keyframesString +
					" " +
					this.buttonStyleString
			)
		)
		return styleTag
	}

	// getProgressBarKeyframeString() {
	// 	let keyframesString = "@keyframes progrBarAnim {"
	// 	this.keyframes.forEach((keyframe, index) => {
	// 		let perc = Math.floor(keyframe * 1000) / 10
	// 		keyframesString += perc + "% {"
	// 		keyframesString += "background-size: " + perc + "% 100%"
	// 		keyframesString += "}"
	// 	})
	// 	keyframesString += "}"
	// 	return (
	// 		keyframesString +
	// 		".progrBarAnimated {animation: progrBarAnim linear " +
	// 		getSetting(SETTING_IDS.ANIMATION_DURATION) +
	// 		"s forwards; }"
	// 	)
	// }

	getKeyframeString() {
		let animationName = "bubbles1"
		let keyframesString = "@keyframes " + animationName + " {"
		this.keyframes.forEach((keyframe, index) => {
			keyframesString += Math.floor(keyframe * 1000) / 10 + "% {"

			keyframesString += this.getBgSizeString(index)
			keyframesString += this.getBgPositionString(index)
			keyframesString += "}"
		})
		keyframesString += "}"
		// console.log(keyframesString)
		return keyframesString
	}
	getBgSizeString(keyframeIndex) {
		let sizeString = "background-size: "
		this.shapes.forEach((shape, index) => {
			// console.log(shape.sizes[keyframeIndex])
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

const theCssGen = new CssGenerator([], [])

export const getCssGenerator = () => {
	return theCssGen
}

export const generateAndAppendCss = () => {
	theCssGen.generateCss().appendStyleTagToBody()
}

export const getHtmlTemplateString = async () => {
	let textContent = ""
	let templateString = await fetch("template.txt")
		.then(response => response.text())
		.then(text => (textContent = text))

	let rootVarsString = ":root { \n"
	getAllCssSettings().forEach(setting => {
		rootVarsString += "--" + setting + ": " + getCssVariable(setting) + "; \n"
	})
	rootVarsString += "}"
	textContent = replaceAllString(textContent, "#ROOTVARS#", rootVarsString)

	return textContent.replace(
		"#STYLE_PLACEHOLDER#",
		theCssGen.bgImageString +
			" \n" +
			theCssGen.keyframesString +
			" \n" +
			theCssGen.buttonStyleString
	)
}

const newLine = "\n"
const tab = "    "
/**
 * Builds a css string from an object in the shape of
 * {
 * 		selector :
 * 			{
 * 				cssAttributeName : cssAttributeValue,
 * 				...
 * 			},
 * 		...
 * }
 *
 * @param {the css selectors + parameters} obj
 */
function getCssStringFromObj(obj) {
	let str = ""
	Object.keys(obj).forEach(selector => {
		str += selector + " {" + newLine
		Object.entries(obj[selector]).forEach(nameValuePair => {
			str += tab + nameValuePair[0] + ": " + nameValuePair[1] + ";" + newLine
		})
		str += "}" + newLine
	})
	return str
}
