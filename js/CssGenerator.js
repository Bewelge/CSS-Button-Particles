import { getCssStringForShape } from "./CssShapes.js"
import { SETTING_IDS, SETTING_TYPES } from "./Settings/DefaultSettings.js"
import { getAllCssSettings, getSetting } from "./Settings/Settings.js"
import { getCssVariable, replaceAllString } from "./Util/Util.js"

const NEWLINE = "\n"
const TAB = "    "
const ANIMATION_NAME = "CssParticleButton"

class CssGenerator {
	constructor(keyframes, shapes) {
		this.keyframes = keyframes
		this.shapes = shapes
		this.generateListeners = []
	}
	setData(keyframes, shapes) {
		this.keyframes = keyframes
		this.shapes = shapes
	}
	generateCss() {
		this.bgImageString = this.getBgImageString()
		this.keyframesString = this.getKeyframeString()
		this.buttonStyleString = this.getButtonStyleString()
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
	getButtonStyleString() {
		let btnWd = getSetting(SETTING_IDS.BUTTON_WIDTH)
		let btnHt = getSetting(SETTING_IDS.BUTTON_HEIGHT)
		let btnEffectWd = getSetting(SETTING_IDS.BG_WIDTH)
		let btnEffectHt = getSetting(SETTING_IDS.BG_HEIGHT)
		return getCssStringFromObj({
			".particles::after": {
				left: -1 * (btnEffectWd / 2 - btnWd / 2) + "px",
				top: -1 * (btnEffectHt / 2 - btnHt / 2) + "px",
				"min-width": btnEffectWd + "px",
				"min-height": btnEffectHt + "px"
			},
			".particleButton": {
				width: btnWd + "px",
				height: btnHt + "px",
				// background: getSetting(SETTING_IDS.BG_COLOR),
				// color: getSetting(SETTING_IDS.FONT_COLOR),
				"border-radius": getSetting(SETTING_IDS.BUTTON_BORDER_RADIUS) + "px"
			},
			".buttonWrap": {
				width: Math.min(window.innerWidth, btnEffectWd) + "px"
				// height:
				// 	Math.min(400, Math.max(window.innerHeight / 2, btnEffectHt)) + "px"
			}
		})
	}
	getBgImageString(formatted) {
		let newline = formatted ? NEWLINE : ""
		let tab = formatted ? TAB : ""
		let bgImageString =
			".animated::after { " +
			newline +
			tab +
			"animation: " +
			ANIMATION_NAME +
			" linear " +
			getSetting(SETTING_IDS.ANIMATION_DURATION) +
			"s forwards;"
		bgImageString += newline + tab + "background-image: "
		this.shapes.forEach((shape, shapeIndex) => {
			bgImageString += newline + tab + tab + getCssStringForShape(shape)
			if (shapeIndex < this.shapes.length - 1) {
				bgImageString += ","
			}
		})
		bgImageString += ";" + newline + "}"

		return bgImageString
	}
	getKeyframeString(formated) {
		let newline = formated ? "\n" : ""
		let tab = formated ? "    " : ""

		let transfRotateX = getSetting(SETTING_IDS.TRANSFORM_ROTATE_X)
		let transfRotateY = getSetting(SETTING_IDS.TRANSFORM_ROTATE_Y)
		let transfRotateZ = getSetting(SETTING_IDS.TRANSFORM_ROTATE_Z)
		let transfScaleConst = getSetting(SETTING_IDS.TRANSFORM_SCALE_CONSTANT)
		let transfScaleX = getSetting(SETTING_IDS.TRANSFORM_SCALE_X)
		let transfScaleY = getSetting(SETTING_IDS.TRANSFORM_SCALE_Y)

		let keyframesString = "@keyframes " + ANIMATION_NAME + " {"
		this.keyframes.forEach((keyframe, index) => {
			const percent = Math.floor(keyframe * 1000) / 10
			keyframesString += newline + tab + percent + "% {" + newline

			keyframesString +=
				tab +
				tab +
				this.getTransformString(
					index,
					transfRotateX,
					transfRotateY,
					transfRotateZ,
					transfScaleConst,
					transfScaleX,
					transfScaleY
				) +
				newline
			keyframesString += tab + tab + this.getBgSizeString(index) + newline
			keyframesString += tab + tab + this.getBgPositionString(index) + newline
			keyframesString += tab + "}"
		})
		keyframesString += "}"

		return keyframesString
	}
	getTransformString(
		index,
		rotateX,
		rotateY,
		rotateZ,
		scaleConst,
		scaleX,
		scaleY
	) {
		let rotateXPart = rotateX != 0 ? "rotateX(" + index * rotateX + "deg) " : ""
		let rotateYPart = rotateY != 0 ? "rotateY(" + index * rotateY + "deg) " : ""
		let rotateZPart = rotateZ != 0 ? "rotateZ(" + index * rotateZ + "deg) " : ""

		let isAnyScaleSet = scaleX != 0 || scaleY != 0 || scaleConst != 100
		let scalePart = ""
		if (isAnyScaleSet) {
			scalePart =
				"scale(" +
				(scaleConst / 100 + (scaleX * index) / 100) +
				"," +
				(scaleConst / 100 + (scaleY * index) / 100) +
				")"
		}

		if (
			rotateXPart.length +
				rotateYPart.length +
				rotateZPart.length +
				scalePart.length >
			0
		) {
			return (
				"transform: " +
				rotateXPart +
				" " +
				rotateYPart +
				" " +
				rotateZPart +
				" " +
				scalePart +
				";"
			)
		}
		return ""
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
	addGenerateListener(listener) {
		this.generateListeners.push(listener)
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
		}, 260)
	} else {
		lastGenerated = window.performance.now()
		theCssGen.generateCss()
		theCssGen.appendStyleTagToBody()
		theCssGen.generateListeners.forEach(listener => listener())
	}
}

export const getHtmlExportString = async () => {
	let textContent = ""
	await fetch("../templates/htmlTemplate.txt")
		.then(res => res.text())
		.then(res => (textContent = res))
	return textContent
}

export const getCssExportString = async () => {
	let textContent = ""
	await fetch("../templates/cssTemplate.txt")
		.then(res => res.text())
		.then(res => (textContent = res))

	textContent = fillRootVarsInString(textContent)
	textContent +=
		theCssGen.getBgImageString(true) +
		" \n" +
		theCssGen.getKeyframeString(true) +
		" \n" +
		theCssGen.getButtonStyleString()
	return textContent
}
export const getJsExportString = async () => {
	let textContent = ""
	await fetch("../templates/jsTemplate.txt").then(
		res => (textContent = res.text())
	)
	return textContent
}

export const getSingleHtmlTemplateString = async () => {
	let textContent = ""
	await fetch("../templates/singleFileTemplate.txt")
		.then(response => response.text())
		.then(text => (textContent = text))

	textContent = fillRootVarsInString(textContent)

	return textContent.replace(
		"#STYLE_PLACEHOLDER#",
		theCssGen.bgImageString +
			" \n" +
			theCssGen.keyframesString +
			" \n" +
			theCssGen.buttonStyleString
	)
}

function fillRootVarsInString(textContent) {
	let rootVarsString = ":root { \n"
	getAllCssSettings().forEach(setting => {
		let suffix = setting.type == SETTING_TYPES.CSS_NUMBER ? setting.suffix : ""
		rootVarsString +=
			"--" + setting + ": " + getCssVariable(setting) + suffix + "; \n"
	})
	rootVarsString += "}"
	return replaceAllString(textContent, "#ROOTVARS#", rootVarsString)
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
