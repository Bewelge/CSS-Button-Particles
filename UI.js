import { DomHelper } from "./DomHelper.js"
import {
	createParameterStringWithSettings,
	getASettingDiv,
	getSettingsDiv,
	setSettingCallback
} from "./Settings.js"
import { getCssGenerator, getHtmlTemplateString } from "./CssGenerator.js"
import { SETTING_IDS } from "./DefaultSettings.js"
import { getScrollbarWidth, setCssVariable } from "./Util.js"

export class UI {
	constructor() {
		this.mainDiv = this.getMainDiv()
		document.body.appendChild(this.mainDiv)
		DomHelper.initDoubleSliders()

		this.getButtonPreviewDiv().style.marginTop =
			this.getHeader().clientHeight + "px"

		setCssVariable("scrollBarWidth", getScrollbarWidth() + "px")
		setCssVariable("scrollBarHeight", getScrollbarWidth() + "px")
	}
	getMainDiv() {
		if (this.mainDiv == null) {
			this.mainDiv = DomHelper.createDivWithClass("mainWrapper")

			this.mainDiv.appendChild(this.getHeader())
			//button preview
			this.mainDiv.appendChild(this.getButtonPreviewDiv())

			// this.mainDiv.appendChild(this.getAnimationProgressBar())
			//Settings
			this.mainDiv.appendChild(this.getSettingsDiv())

			this.mainDiv.appendChild(this.getCodeOutputDiv())
			//text
			// this.mainDiv.appendChild()
		}
		return this.mainDiv
	}
	getHeader() {
		if (this.headerDiv == null) {
			this.headerDiv = DomHelper.createElementWithClass("headerWrap", "nav")
			this.headerDiv.innerHTML = "CSS Particle Button Generator"
		}
		return this.headerDiv
	}
	getButtonPreviewDiv() {
		if (this.buttonPreviewDiv == null) {
			this.buttonPreviewDiv = DomHelper.createDivWithClass("buttonPreviewWrap")

			let btn = this.getPreviewButton()

			let btnBG = DomHelper.createDivWithClass("button buttonEffect")
			let initalListener = () => {
				document.querySelector(".buttonEffect").classList.add("animated")
				// document.querySelector(".progrBar").classList.add("progrBarAnimated")
				btnBG.removeEventListener("click", initalListener)
			}
			btnBG.addEventListener("click", initalListener)

			let btnWrap = DomHelper.createDivWithClass("buttonWrap")
			btnWrap.appendChild(btnBG)
			btnWrap.appendChild(btn)

			let leftDiv = DomHelper.createDivWithClass("sideFiller")

			let rightDiv = this.getRightDiv()

			this.buttonPreviewDiv.appendChild(leftDiv)
			this.buttonPreviewDiv.appendChild(btnWrap)
			this.buttonPreviewDiv.appendChild(rightDiv)
		}
		return this.buttonPreviewDiv
	}
	getRightDiv() {
		let rightDiv = DomHelper.createDivWithClass("sideFiller")
		let shareButton = DomHelper.createTextButton("shareBtn", "Share", () => {
			console.log(createParameterStringWithSettings())
		})
		let downloadHtmlBtn = DomHelper.createTextButton(
			"btn",
			"Download Single</br> HTML-File",
			async () => {
				let txx = await getHtmlTemplateString()
				download(txx, "index.html", "text/html")
			}
		)
		rightDiv.appendChild(shareButton)
		rightDiv.appendChild(downloadHtmlBtn)
		return rightDiv
	}
	getPreviewButton() {
		if (this.previewButton == null) {
			this.previewButton = DomHelper.createElementWithClass("button", "button")
			this.previewButton.innerHTML = "Click me"
		}
		return this.previewButton
	}
	// getAnimationProgressBar() {
	// 	if (this.progrBar == null) {
	// 		this.progrBar = DomHelper.createDivWithClass("progrBar")
	// 		this.progrBar.appendChild(getSettingsDiv(getSettingsDiv()))
	// 	}
	// 	return this.progrBar
	// }
	getSettingsDiv() {
		if (this.settingsDiv == null) {
			this.settingsDiv = DomHelper.createDivWithClass("settingsWrap")
			this.settingsDiv.appendChild(getSettingsDiv(getSettingsDiv()))
		}
		return this.settingsDiv
	}
	getCodeOutputDiv() {
		if (this.codeOutputDiv == null) {
			this.codeOutputDiv = DomHelper.createDivWithClass("codeOutputWrap")
			// let header = createCodeOutputHeaderContent("Keyframe animation")
			let box = createCodeBox(
				"keyframesCss",
				"CSS Keyframe animation",
				getCssGenerator().keyframesString,
				SETTING_IDS.KEYFRAME_COMPACT,
				val => getCssGenerator().getKeyframeString(val)
			)

			let box2 = createCodeBox(
				"bgImgCss",
				"CSS Background-image",
				getCssGenerator().bgImageString,
				SETTING_IDS.BG_IMG_COMPACT,
				val => getCssGenerator().getBgImageString(val)
			)

			this.codeOutputDiv.appendChild(box)
			this.codeOutputDiv.appendChild(box2)
		}
		return this.codeOutputDiv
	}
}
const codeBoxes = {
	keyframeCss: {
		title: "Keyframe animation",
		compact: false
	}
}
function createCodeOutputHeaderContent(title, onCompact) {
	let headerCont = DomHelper.createDivWithClass("header")
	let titleEl = DomHelper.createDivWithClass("codeBoxTitle")
	titleEl.innerHTML = title
	let compactCheck = DomHelper.createCheckbox(
		"Compact",
		() => {},
		codeBoxes.keyframeCss.compact,
		() => codeBoxes.keyframeCss.compact
	)
}

function download(data, filename, type) {
	var file = new Blob([data], { type: type })
	if (window.navigator.msSaveOrOpenBlob)
		// IE10+
		window.navigator.msSaveOrOpenBlob(file, filename)
	else {
		// Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file)
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		setTimeout(function () {
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
		}, 0)
	}
}

function createCodeBox(boxId, boxTitle, codeStr, settingId, onFormat) {
	let cont = DomHelper.createDivWithClass("codeBoxCont")

	let header = DomHelper.createDivWithClass("codeHeader")
	let preTag = DomHelper.createElement("pre")

	let titleEl = DomHelper.createDivWithClass("codeBoxTitle")
	titleEl.innerHTML = boxTitle

	let copyBtn = DomHelper.createTextButton(
		"codeBoxCopy",
		"Copy to Clipboard",
		() => copyInnerHtmlToClipboard(preTag)
	)
	let compactCheckbox = getASettingDiv(settingId)
	setSettingCallback(settingId, val => (preTag.innerHTML = onFormat(val)))

	// "Compact",
	// () => {},
	// codeBoxes.keyframeCss.compact,
	// () => codeBoxes.keyframeCss.compact
	// )
	header.appendChild(titleEl)
	header.appendChild(compactCheckbox)

	let box = DomHelper.createDivWithIdAndClass(
		boxId,
		"codeBox hiddenScrollBarDiv"
	)

	let codeTag = DomHelper.createElement("code")
	codeTag.setAttribute("data-language", "html")

	preTag.innerHTML = codeStr
	codeTag.appendChild(preTag)

	box.appendChild(codeTag)

	cont.appendChild(header)
	cont.appendChild(box)
	cont.appendChild(copyBtn)

	return cont
}

function copyInnerHtmlToClipboard(el) {
	let sel = window.getSelection()
	let range = document.createRange() //range object
	range.selectNodeContents(el) //sets Range
	sel.removeAllRanges() //remove all ranges from selection
	sel.addRange(range)

	document.execCommand("copy")
}
