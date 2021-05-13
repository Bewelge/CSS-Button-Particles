import { DomHelper } from "./DomHelper.js"
import { getSettingsDiv } from "./Settings.js"

export class UI {
	constructor() {
		this.mainDiv = this.getMainDiv()
		document.body.appendChild(this.mainDiv)
	}
	getMainDiv() {
		if (this.mainDiv == null) {
			this.mainDiv = DomHelper.createDivWithClass("mainWrapper")

			//button preview
			this.mainDiv.appendChild(this.getButtonPreviewDiv())
			//Settings
			this.mainDiv.appendChild(this.getSettingsDiv())
			//text
			// this.mainDiv.appendChild()
		}
		console.log(123)
		return this.mainDiv
	}
	getButtonPreviewDiv() {
		if (this.buttonPreviewDiv == null) {
			this.buttonPreviewDiv = DomHelper.createDivWithClass("buttonPreviewWrap")

			let btn = this.getPreviewButton()

			let btnBG = DomHelper.createDivWithClass("button buttonEffect")
			let initalListener = () => {
				document.querySelector(".buttonEffect").classList.add("animated")
				btnBG.removeEventListener("mouseenter", initalListener)
			}
			btnBG.addEventListener("click", initalListener)

			let btnWrap = DomHelper.createDivWithClass("buttonWrap")
			btnWrap.appendChild(btnBG)
			btnWrap.appendChild(btn)

			this.buttonPreviewDiv.appendChild(btnWrap)
		}
		return this.buttonPreviewDiv
	}
	getPreviewButton() {
		if (this.previewButton == null) {
			this.previewButton = DomHelper.createElementWithClass("button", "button")
			this.previewButton.innerHTML = "Click me"
		}
		return this.previewButton
	}

	getSettingsDiv() {
		if (this.settingsDiv == null) {
			this.settingsDiv = DomHelper.createDivWithClass("settingsWrap")
			this.settingsDiv.appendChild(getSettingsDiv(getSettingsDiv()))
		}
		return this.settingsDiv
	}
}
