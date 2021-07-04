import { DomHelper } from "../Util/DomHelper.js"
import {
	createParameterStringWithSettings,
	getASettingDiv,
	getSetting,
	getSettingsDiv,
	setSettingCallback,
	loadAButton,
	setSetting,
	setSettingsSaveEnabled,
	getSettingObject,
	parseSettingValue
} from "../Settings/Settings.js"
import {
	getCssGenerator,
	getHtmlExportString,
	getJsExportString,
	getCssExportString,
	getSingleHtmlTemplateString,
	generateAndAppendCss
} from "../CssGenerator.js"
import {
	getADefaultSetting as getDefaultSettingById,
	getDefaultSettings,
	SETTING_IDS,
	SETTING_TYPES
} from "../Settings/DefaultSettings.js"
import {
	getScrollbarWidth,
	setCssVariable,
	escapeHtml,
	replaceAllString
} from "../Util/Util.js"
import {
	deleteSavedButton,
	getSavedButtons,
	saveCurrentButtonInLocalStorage
} from "../Settings/LocalStorageHandler.js"
import { getExampleButtons } from "./ExampleButtons.js"
import { getKeyframes } from "../Keyframes.js"
import { getShapesFromSettings } from "../ShapeCreator.js"
import { SettingUI } from "../Settings/SettingUI.js"

export class UI {
	constructor() {
		this.getPreviews()

		this.getMainDiv()
		DomHelper.initDoubleSliders()

		this.getButtonPreviewDiv().style.marginTop =
			this.getHeader().clientHeight + "px"

		setCssVariable("scrollBarWidth", getScrollbarWidth() + "px")
		setCssVariable("scrollBarHeight", getScrollbarWidth() + "px")

		let resizeFunc = () => {
			this.mainDiv.style.height =
				"calc(100% - " +
				(this.getButtonPreviewDiv().clientHeight +
					this.getHeader().clientHeight) +
				"px)"
			this.mainDiv.style.top =
				this.getButtonPreviewDiv().clientHeight +
				this.getHeader().clientHeight +
				"px"
			this.getButtonPreviewDiv().style.marginTop =
				this.getHeader().clientHeight + "px"
			this.getButtonPreviewDiv().style.maxHeight =
				"calc(50% - " + this.getHeader().clientHeight + "px)"

			this.getButtonPreviewDiv().querySelector(".buttonWrap").style.minHeight =
				"calc(50% - " + this.getHeader().clientHeight + "px)"
		}
		resizeFunc()
		window.addEventListener("resize", resizeFunc)

		//give pickrs some time to init
		window.setTimeout(() => setSettingsSaveEnabled(true), 1000)

		DomHelper.hideDiv(document.getElementById("loader"))
	}
	getPreviews() {
		let prevDiv = document.getElementById("previewsButtons")
		document.querySelector("#previews h1").appendChild(this.getGithubLinkEl())
		let buttons = getExampleButtons()
		Object.keys(buttons).forEach(buttonName => {
			prevDiv.appendChild(this.getAButtonPreviewDiv(buttonName))
			let keyframes = getKeyframes(
				buttons[buttonName][SETTING_IDS.KEYFRAME_AMOUNT]
			)

			Object.keys(SETTING_IDS).forEach(key => {
				let id = SETTING_IDS[key]
				if (!buttons[buttonName].hasOwnProperty(id)) {
					let defaultSetting = getDefaultSettingById(id)
					buttons[buttonName][id] = parseSettingValue(id, defaultSetting)
				}
		
			})

			let shapes = getShapesFromSettings(keyframes, buttons[buttonName])
			getCssGenerator().setData(keyframes, shapes)
			generateAndAppendCss(buttonName, buttons[buttonName], false)
		})
	}
	getMainDiv() {
		if (this.mainDiv == null) {
			this.mainDiv = document.querySelector(".mainWrapper")

			this.getHeader()
			this.getButtonPreviewDiv()
			this.getSettingsDiv()
			this.getCodeOutputDiv1()
			this.getCodeOutputDiv2()
		}
		return this.mainDiv
	}
	getHeader() {
		if (this.headerDiv == null) {
			this.headerDiv = document.querySelector(".headerWrap")
			let span = DomHelper.createElement("span")
			span.innerHTML = "CSS Particle Button Generator"
			this.headerDiv.appendChild(span)

		
			this.headerDiv.appendChild(this.getGithubLinkEl())
		}
		return this.headerDiv
	}
	getGithubLinkEl() {
		let githubLink = document.createElement("a")
			githubLink.href = "https://github.com/Bewelge/CSS-Button-Particles"
			let githubLogo = document.createElement("img")
			githubLogo.src = "./github.svg"
			githubLink.appendChild(githubLogo)
			return githubLink
	}
	getAButtonPreviewDiv(buttonId) {
		let cont = DomHelper.createDivWithClass("buttonPreviewCont")

		
		let buttonName = replaceAllString(buttonId, " ", "")
		let btn = this.getAPreviewButton(buttonName)

		let btnBG = DomHelper.createDivWithClass(
			"particleButton " + buttonName + " particles"
		)
		let initalListener = () => {
			btnBG.classList.add("animated")

			btnBG.removeEventListener("click", initalListener)
		}
		btn.addEventListener("click", initalListener)

		let btnWrap = DomHelper.createDivWithClass("buttonWrap")
		btnWrap.appendChild(btn)
		btnWrap.appendChild(btnBG)

		
		let openInEditorBtn = DomHelper.createTextButton("openInEditor"+buttonName,"Open in Editor",() => {
			loadAButton(getExampleButtons()[buttonId])
			DomHelper.hideDiv( document.getElementById("previews"))
			
			
			// let keyframes = getKeyframes(
				// 	buttons[buttonName][SETTING_IDS.KEYFRAME_AMOUNT]
				// )
				// let shapes = getShapesFromSettings(keyframes, buttons[buttonName])
				// getCssGenerator().setData(keyframes, shapes)
				// generateAndAppendCss(buttonName, buttons[buttonName], false)
			})
			cont.appendChild(btnWrap)
			cont.appendChild(openInEditorBtn)

		return cont
	}
	getButtonPreviewDiv() {
		if (this.buttonPreviewDiv == null) {
			this.buttonPreviewDiv = document.querySelector(".buttonPreviewWrap")

			let btn = this.getPreviewButton()

			let btnBG = DomHelper.createDivWithClass(
				"particleButton particles theButton"
			)
			let initalListener = () => {
				btnBG.classList.add("animated")

				btnBG.removeEventListener("click", initalListener)
			}
			btn.addEventListener("click", initalListener)

			let btnWrap = DomHelper.createDivWithClass("buttonWrap")
			btnWrap.appendChild(btn)
			btnWrap.appendChild(btnBG)

			let leftDiv = this.getLeftDiv()

			let rightDiv = this.getRightDiv()

			this.buttonPreviewDiv.appendChild(leftDiv)
			this.buttonPreviewDiv.appendChild(btnWrap)
			this.buttonPreviewDiv.appendChild(rightDiv)
		}
		return this.buttonPreviewDiv
	}
	getLeftDiv() {
		let leftDiv = DomHelper.createDivWithClass("sideFiller")
		let saveButton = DomHelper.createTextButton(
			"shareBtn",
			"Save button",
			this.openSaveDialog
		)
		let loadButton = DomHelper.createTextButton(
			"btn",
			"Load buttons",
			this.openLoadedButtonDiv
		)
		leftDiv.appendChild(saveButton)
		leftDiv.appendChild(loadButton)
		return leftDiv
	}
	openLoadedButtonDiv() {
		let btnWrap = DomHelper.createElementWithClass("modalInnerWrap")
		let savedButtons = getSavedButtons()
		Object.keys(savedButtons).forEach(btnName => {
			let btnRow = DomHelper.createDivWithClass("btnRow")
			const btnDiv = DomHelper.createDivWithClass("btnName")
			btnDiv.innerHTML = btnName
			btnDiv.onclick = () => {
				setSettingsSaveEnabled(false)
				loadAButton(savedButtons[btnName])
				setSetting(SETTING_IDS.BUTTON_NAME, btnName)
				setSettingsSaveEnabled(true)
			}

			const btnDeleteDiv = DomHelper.createDivWithClass("")
			btnDeleteDiv.innerHTML = "x"
			btnDeleteDiv.onclick = ev => {
				ev.stopPropagation()
				btnWrap.removeChild(btnRow)
				deleteSavedButton(btnName)
			}
			btnRow.appendChild(btnDiv)
			btnRow.appendChild(btnDeleteDiv)
			btnWrap.appendChild(btnRow)
		})
		let modal = createModalWindow("Load Buttons", [btnWrap])
		document.body.appendChild(modal)
	}
	openSaveDialog() {
		let btnSaveNameField = getASettingDiv(SETTING_IDS.BUTTON_NAME, [])
		let cont = DomHelper.createElementWithClass("modalInnerWrap")

		let btnSave = DomHelper.createTextButtonWithSuccessMsgField(
			"saveBtn",
			"Save",
			() => saveCurrentButtonInLocalStorage(),
			() => "Saved!"
		)
		DomHelper.appendChildren(cont, [btnSaveNameField, btnSave])
		let modal = createModalWindow("Save Button", [cont])

		document.body.appendChild(modal)
	}
	getRightDiv() {
		let rightDiv = DomHelper.createDivWithClass("sideFiller")
		let shareButton = DomHelper.createTextButton(
			"shareBtn",
			"Share",
			this.openShareModal
		)
		let downloadHtmlBtn = DomHelper.createTextButton(
			"btn",
			"Download Single</br> HTML-File",
			async () => {
				let txx = await getSingleHtmlTemplateString()
				download(txx, "index.html", "text/html")
			}
		)
		rightDiv.appendChild(shareButton)
		rightDiv.appendChild(downloadHtmlBtn)
		return rightDiv
	}
	openShareModal() {
		let cont = DomHelper.createElementWithClass("modalInnerWrap")

		let shareField = DomHelper.createDivWithClass("textField")
		shareField.innerHTML = createParameterStringWithSettings()

		let btnSave = DomHelper.createTextButtonWithSuccessMsgField(
			"shareLink",
			"Copy to clipboard ",
			() => copyInnerHtmlToClipboard(shareField),
			() => "Copied!"
		)

		DomHelper.appendChildren(cont, [shareField, btnSave])
		let modal = createModalWindow("Share", [cont])

		document.body.appendChild(modal)
	}
	getAPreviewButton(buttonName) {
		let previewButton = DomHelper.createElementWithClass(
			"particleButton " + buttonName,
			"button"
		)
		previewButton.innerHTML = "Click me"
		return previewButton
	}
	getPreviewButton() {
		if (this.previewButton == null) {
			this.previewButton = this.getAPreviewButton("theButton")
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
			this.settingsDiv = document.querySelector(".settingsWrap")
			this.settingsDiv.appendChild(getSettingsDiv(getSettingsDiv()))
		}
		return this.settingsDiv
	}
	getCodeOutputDiv1() {
		if (this.codeOutputDiv1 == null) {
			this.codeOutputDiv1 = document.querySelectorAll(".codeOutputWrap")[0]

			this.codeOutputDiv1.appendChild(this.getMultiCodeBox())
		}
		return this.codeOutputDiv1
	}
	getCodeOutputDiv2() {
		if (this.codeOutputDiv2 == null) {
			this.codeOutputDiv2 = document.querySelectorAll(".codeOutputWrap")[1]

			let cssKeyframeBox = createCodeBox(
				"keyframesCss",
				"CSS @keyframe animation",
				getCssGenerator().keyframesString,
				SETTING_IDS.KEYFRAME_COMPACT,
				val =>
					getCssGenerator().getKeyframeString(
						getSettingObject(),
						val,
						"theButton"
					)
			)

			let cssBgImageBox = createCodeBox(
				"bgImgCss",
				"CSS background-image",
				getCssGenerator().bgImageString,
				SETTING_IDS.BG_IMG_COMPACT,
				val =>
					getCssGenerator().getBgImageString(
						getSettingObject(),
						val,
						"theButton"
					)
			)

			this.codeOutputDiv2.appendChild(cssKeyframeBox)
			this.codeOutputDiv2.appendChild(cssBgImageBox)
		}
		return this.codeOutputDiv2
	}
	getMultiCodeBox() {
		if (this.multiCodebox == null) {
			let tabs = [
				{
					name: "HTML",
					onFormat: formatted => getHtmlExportString(formatted),
					fileName: "index.html"
				},
				{
					name: "CSS",
					onFormat: formatted =>
						getCssExportString(getSettingObject(), "theButton", formatted),
					fileName: "interface.css"
				},
				{
					name: "JS",
					onFormat: formatted => getJsExportString(formatted),
					fileName: "main.js"
				}
			]
			let isCompact = getSetting(SETTING_IDS.COMPLETE_COMPACT)
			let currentTab = tabs[0]

			this.multiCodebox = DomHelper.createDivWithClass("codeBoxCont")

			let header = DomHelper.createDivWithClass("codeHeader")

			let preTag = DomHelper.createElement("pre")

			let tabDivs = tabs.map(tab =>
				DomHelper.createDivWithClass(
					"codeBoxTitleTab",
					{},
					{
						innerHTML: tab.name,
						onclick: () =>
							tab.onFormat(isCompact).then(res => {
								currentTab = tab
								tab.text = res
								preTag.innerHTML = escapeHtml(res)
							})
					}
				)
			)
			tabs.forEach(tab =>
				tab.onFormat(isCompact).then(res => {
					tab.text = res
					preTag.innerHTML = escapeHtml(res)
				})
			)
			getCssGenerator().addGenerateListener(() => {
				tabs.forEach(tab => {
					tab.onFormat(isCompact).then(res => {
						tab.text = res
						if (tab == currentTab) {
							preTag.innerHTML = escapeHtml(res)
						}
					})
				})
			})

			let downloadZip = () => {
				tabs.map(tab => createFile(tab.text, tab.type))

				let jszip = new JSZip()

				let path = "CSS Particle Buttons/"
				tabs.map(tab => jszip.file(path + tab.fileName, tab.text))

				jszip.generateAsync({ type: "blob" }).then(
					blob => download(blob, "CSS Particle Button.zip", "zip"),
					err => console.error(err)
				)
			}
			let downloadBtn = DomHelper.createTextButton(
				"codeBoxDownload",
				"Download as .zip",
				downloadZip
			)

			DomHelper.appendChildren(header, tabDivs)

			let codeBox = DomHelper.createDivWithIdAndClass(
				"cssBox",
				"codeBox hiddenScrollBarDiv "
			)

			let codeTag = DomHelper.createElement("code")
			codeTag.setAttribute("data-language", "html")

			let codeStr = ""
			tabs[0].onFormat(isCompact).then(res => (codeStr = res))

			preTag.innerHTML = codeStr
			codeTag.appendChild(preTag)

			codeBox.appendChild(codeTag)

			this.multiCodebox.appendChild(header)
			this.multiCodebox.appendChild(codeBox)
			this.multiCodebox.appendChild(downloadBtn)
		}
		return this.multiCodebox
	}
}
function createModalWindow(title, elements) {
	let cont = DomHelper.createDivWithClass("modalWindowBg hidden")
	let modal = DomHelper.createDivWithClass("modalWindow")

	let removeListener = ev => {
		if (ev.target != modal && !modal.contains(ev.target)) {
			document.body.removeChild(cont)
			window.removeEventListener("click", removeListener)
		}
	}
	window.setTimeout(() => {
		cont.classList.remove("hidden")
		window.addEventListener("click", removeListener)
	}, 100)

	let titleDiv = DomHelper.createDivWithClass(
		"modalWindowTitle",
		{},
		{ innerHTML: title }
	)

	modal.appendChild(titleDiv)
	DomHelper.appendChildren(modal, elements)
	cont.appendChild(modal)
	return cont
}
function createFile(data, type) {
	return new Blob([data], { type: type })
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

	getCssGenerator().addGenerateListener(
		() => (preTag.innerHTML = onFormat(getSetting(settingId)))
	)
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

/**
 * Copies the innerHTML of passed element to clipboard. Returns true if successfull
 * @param {*} el
 * @returns
 */
function copyInnerHtmlToClipboard(el) {
	try {
		let sel = window.getSelection()
		let range = document.createRange() //range object
		range.selectNodeContents(el) //sets Range
		sel.removeAllRanges() //remove all ranges from selection
		sel.addRange(range)

		document.execCommand("copy")

		return true
	} catch (e) {
		return false
	}
}
