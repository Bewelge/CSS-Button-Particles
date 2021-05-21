import { getCssStringForShape } from "./CssShapes.js"
import { SETTING_IDS } from "./DefaultSettings.js"
import { getAllCssSettings, getSetting, getSettingObject } from "./Settings.js"
import { getCssVariable, replaceAllString } from "./Util.js"

const NEWLINE = "\n"
const TAB = "    "
const ANIMATION_NAME = "CssParticleButton"

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
				"border-radius": getSetting(SETTING_IDS.BUTTON_BORDER_RADIUS) + "px"
			},
			".buttonWrap": {
				width: Math.min(window.innerWidth, btnEffectWd) + "px",
				height: Math.min(400, btnEffectHt) + "px"
			}
		})
	}
	getBgImageString(formatted) {
		let newline = formatted ? NEWLINE : ""
		let tab = formatted ? TAB : ""
		let bgImageString =
			".animated::after { " + newline + tab + " background-image: "
		this.shapes.forEach((shape, shapeIndex) => {
			bgImageString += newline + tab + tab + getCssStringForShape(shape)
			if (shapeIndex < this.shapes.length - 1) {
				bgImageString += ","
			}
		})
		bgImageString +=
			";" +
			newline +
			tab +
			tab +
			"animation: " +
			ANIMATION_NAME +
			" linear " +
			getSetting(SETTING_IDS.ANIMATION_DURATION) +
			"s forwards;" +
			newline +
			"}"

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

	getKeyframeString(formated) {
		let newline = formated ? "\n" : ""
		let tab = formated ? "    " : ""

		let transformRotate = 0
		let transformRotatePerKeyframe = getSetting(SETTING_IDS.TRANSFORM_ROTATE)
		let transformScaleX = 100
		let transformScaleY = 100
		let transformScaleXPerKeyframe = getSetting(SETTING_IDS.TRANSFORM_SCALE_X)
		let transformScaleYPerKeyframe = getSetting(SETTING_IDS.TRANSFORM_SCALE_Y)

		let keyframesString = "@keyframes " + ANIMATION_NAME + " {"
		this.keyframes.forEach((keyframe, index) => {
			const percent = Math.floor(keyframe * 1000) / 10
			keyframesString += newline + tab + percent + "% {" + newline

			keyframesString +=
				tab +
				tab +
				"transform: rotate(" +
				transformRotate +
				"deg) scale(" +
				transformScaleX / 100 +
				"," +
				transformScaleY / 100 +
				");" +
				newline
			keyframesString += tab + tab + this.getBgSizeString(index) + newline
			keyframesString += tab + tab + this.getBgPositionString(index) + newline
			keyframesString += tab + "}"
			transformRotate += transformRotatePerKeyframe
			transformScaleX += transformScaleXPerKeyframe
			transformScaleY += transformScaleYPerKeyframe
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

const theCssGen = new CssGenerator([], [])

export const getCssGenerator = () => {
	return theCssGen
}
var lastGenerated = window.performance.now()
export const generateAndAppendCss = retry => {
	if (window.performance.now() - lastGenerated < 250 && !retry) {
		window.setTimeout(() => {
			generateAndAppendCss(true)
		}, 250)
	} else {
		lastGenerated = window.performance.now()
		theCssGen.generateCss()
		theCssGen.appendStyleTagToBody()
		document.getElementById("keyframesCss").querySelector("pre").innerHTML =
			theCssGen.getKeyframeString(getSetting(SETTING_IDS.KEYFRAME_COMPACT))
		document.getElementById("bgImgCss").querySelector("pre").innerHTML =
			theCssGen.getBgImageString(getSetting(SETTING_IDS.BG_IMG_COMPACT))
	}
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
		str += selector + " {" + NEWLINE
		Object.entries(obj[selector]).forEach(nameValuePair => {
			str += TAB + nameValuePair[0] + ": " + nameValuePair[1] + ";" + NEWLINE
		})
		str += "}" + NEWLINE
	})
	return str
}
