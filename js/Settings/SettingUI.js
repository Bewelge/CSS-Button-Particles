import { SETTING_TYPES } from "./DefaultSettings.js"
import { DomHelper } from "../Util/DomHelper.js"
import { resetSettingsToDefault, setSetting } from "./Settings.js"
import { setCssVariable } from "../Util/Util.js"

/**
 * Class to create the DOM Elements used to manipulate the settings.
 */
export class SettingUI {
	constructor() {
		this.tabs = {}
		this.activeTab = "General"
		this.mainDiv = null
		this.settingDivs = {}
	}
	/**
	 * returns a div with the following structure:
	 * 	.settingsContainer {
	 * 		.settingsTabButtonContainer {
	 * 			.settingsTabButton ...
	 * 		}
	 * 		.settingsContentContainer {
	 * 			.settingContainer ...
	 * 		}
	 * }
	 *
	 * @param {Object} settings  as defined in DefaultSettings.js
	 */
	getSettingsDiv(settings) {
		if (this.mainDiv == null) {
			this.mainDiv = DomHelper.createDivWithClass("settingsContainer")
			// this.mainDiv.appendChild(this.getTabDiv(Object.keys(settings)))
			this.mainDiv.appendChild(this.getContentDiv(settings))

			// this.mainDiv
			// 	.querySelectorAll(".settingsTabContent" + this.activeTab)
			// 	.forEach(el => (el.style.display = "block"))
			// this.mainDiv
			// 	.querySelector("#" + this.activeTab + "Tab")
			// 	.classList.add("selected")
		}
		return this.mainDiv
	}
	getTabDiv(tabIds) {
		let cont = DomHelper.createDivWithClass("settingsTabButtonContainer")
		tabIds.forEach(tabId => {
			let tabButton = this.createTabButton(tabId)
			tabButton.classList.add("settingsTabButton")
			cont.appendChild(tabButton)
		})
		return cont
	}
	createTabButton(tabName) {
		let butEl = DomHelper.createTextButton(tabName + "Tab", tabName, ev => {
			document
				.querySelectorAll(".settingsTabButton")
				.forEach(el => el.classList.remove("selected"))

			// butEl.classList.add("selected")

			// document
			// 	.querySelectorAll(".settingsTabContentContainer")
			// 	.forEach(settingEl => (settingEl.style.display = "none"))
			// document
			// 	.querySelectorAll(".settingsTabContent" + tabName)
			// 	.forEach(settingEl => (settingEl.style.display = "block"))
		})
		return butEl
	}
	getContentDiv(settings) {
		let cont = DomHelper.createDivWithClass("settingsContentContainer")
		Object.keys(settings).forEach(tabId => {
			cont.appendChild(this.createSettingTabContentDiv(tabId, settings[tabId]))
		})
		cont.appendChild(this.getResetButton())

		return cont
	}
	createSettingTabContentDiv(tabName, settingGroups) {
		let cont = DomHelper.createDivWithClass(
			"settingsTabContentContainer settingsTabContent" + tabName
		)

		Object.keys(settingGroups)
			.filter(
				grp => settingGroups[grp].filter(setting => !setting.hidden).length > 0
			)
			.forEach(groupId => {
				cont.appendChild(
					this.createSettingGroupDiv(tabName, groupId, settingGroups[groupId])
				)
			})
		return cont
	}
	getResetButton() {
		let but = DomHelper.createTextButton(
			"settingsResetButton",
			"Reset to defaults",
			() => {
				resetSettingsToDefault()
			}
		)
		return but
	}
	createSettingGroupDiv(tabName, categoryName, settingsList) {
		let cont = DomHelper.createDivWithClass(
			"settingsGroupContainer innerMenuContDiv"
		)
		if (categoryName != "default") {
			cont.classList.add("collapsed")
			let label = DomHelper.createElementWithClass(
				"settingsGroupLabel clickableTitle",
				"div",
				{},
				{ innerHTML: categoryName + ": " }
			)
			cont.appendChild(label)

			let collapsed = true
			let glyph = DomHelper.getGlyphicon("plus")
			glyph.classList.add("rightGlyphSpan")
			label.appendChild(glyph)

			label.onclick = () => {
				if (collapsed == true) {
					collapsed = false
					cont.classList.remove("collapsed")
					DomHelper.replaceGlyph(label, "plus", "minus")
				} else {
					collapsed = true
					cont.classList.add("collapsed")
					DomHelper.replaceGlyph(label, "minus", "plus")
				}
			}
		}

		settingsList
			.filter(setting => !setting.hidden)
			.forEach(setting => {
				this.settingDivs[setting.id] = SettingUI.createSettingDiv(setting)
				cont.appendChild(this.settingDivs[setting.id])
			})
		return cont
	}
	showHideSettings(settingsShowHideList) {
		settingsShowHideList.forEach(idShowHidePair => {
			idShowHidePair[1]
				? DomHelper.displayDiv(this.settingDivs[idShowHidePair[0]])
				: DomHelper.undisplayDiv(this.settingDivs[idShowHidePair[0]])
		})
	}
	getSettingDivById(settingId) {
		return this.settingDivs[settingId]
	}
	updateSettingDivValue(settingId) {
		if (
			this.settingDivs[settingId] &&
			this.settingDivs[settingId].updateSettingValue
		)
			this.settingDivs[settingId].updateSettingValue()
	}
	static createSettingDiv(setting) {
		switch (setting.type) {
			case SETTING_TYPES.LIST:
				return SettingUI.createListSettingDiv(setting)
			case SETTING_TYPES.CHECKBOX:
				return SettingUI.createCheckboxSettingDiv(setting)
			case SETTING_TYPES.SLIDER:
				return SettingUI.createSliderSettingDiv(setting)
			case SETTING_TYPES.COLOR:
				return SettingUI.createColorSettingDiv(setting)
			case SETTING_TYPES.CSS_COLOR:
				return SettingUI.createCssColorSettingDiv(setting)
			case SETTING_TYPES.CSS_NUMBER:
				return SettingUI.createCssNumberSettingDiv(setting)
			case SETTING_TYPES.DOUBLE_SLIDER:
				return SettingUI.createMinMaxSliderSettingDiv(setting)
			case SETTING_TYPES.TEXT_INPUT:
				return SettingUI.createTextInputSettingDiv(setting)
			case SETTING_TYPES.TEXT_AREA:
				return SettingUI.createTextAreaSettingDiv(setting)
		}
	}
	static getOnChangeFunc(setting) {
		switch (setting.type) {
			case SETTING_TYPES.DOUBLE_SLIDER:
				return (lower, upper) => setSetting(setting.id, [lower, upper])
			case SETTING_TYPES.CHECKBOX:
				return event => setSetting(setting.id, event.target.checked)
			default:
				return value => setSetting(setting.id, value)
		}
	}
	static createListSettingDiv(setting) {
		let el = DomHelper.createInputSelect(
			setting.label,
			setting.list,
			setting.value,
			SettingUI.getOnChangeFunc(setting)
		)
		el.classList.add("settingContainer")
		el.updateSettingValue = () => {
			el.querySelectorAll("option").forEach(option => {
				if (option.value == setting.value) {
					option.selected = true
				}
			})
		}
		return el
	}
	static createCheckboxSettingDiv(setting) {
		let el = DomHelper.createCheckbox(
			setting.label,
			SettingUI.getOnChangeFunc(setting),
			setting.value,
			setting.isChecked
		)
		el.classList.add("settingContainer")
		el.updateSettingValue = () =>
			(el.querySelector("input").checked = setting.isChecked
				? setting.isChecked()
				: setting.value)
		return el
	}
	static createSliderSettingDiv(setting) {
		let el = DomHelper.createSliderWithLabelAndField(
			setting.id + "Slider",
			setting.label,
			parseFloat(setting.value),
			setting.min,
			setting.max,
			setting.step,
			SettingUI.getOnChangeFunc(setting)
		).container
		el.classList.add("settingContainer")
		el.updateSettingValue = () => {
			el.querySelector("input").value = setting.value
			el.querySelector(".sliderVal").innerHTML = setting.value
		}
		return el
	}
	static createMinMaxSliderSettingDiv(setting) {
		let el = DomHelper.createDoubleSliderWithLabelAndField(
			setting.id + "Slider",
			setting.label,
			parseFloat(setting.lowerValue),
			parseFloat(setting.upperValue),
			setting.min,
			setting.max,
			setting.step,
			SettingUI.getOnChangeFunc(setting)
		).container
		el.updateSettingValue = () => {
			el.querySelector(".minSlider").value = setting.lowerValue
			el.querySelector(".maxSlider").value = setting.upperValue
			el.querySelector(".sliderVal").innerHTML =
				setting.lowerValue == setting.upperValue
					? setting.lowerValue
					: setting.lowerValue + " < - > " + setting.upperValue
		}
		el.classList.add("settingContainer")
		return el
	}
	static createTextInputSettingDiv(setting) {
		let el = DomHelper.createTextInput(
			setting.id + "Slider",
			setting.label,
			setting.value,
			SettingUI.getOnChangeFunc(setting)
		)
		el.classList.add("settingContainer")
		el.updateSettingValue = () => {
			el.querySelector("input").value = setting.value
		}
		return el
	}
	static createTextAreaSettingDiv(setting) {
		let el = DomHelper.createTextArea(
			setting.id + "Slider",
			setting.label,
			setting.value,
			SettingUI.getOnChangeFunc(setting),
			5
		)
		el.classList.add("settingContainer")
		el.updateSettingValue = () => {
			el.querySelector("textarea").value = setting.value
		}
		return el
	}
	static createColorSettingDiv(setting) {
		let el = DomHelper.createColorPickerText(
			setting.label,
			setting.value,
			SettingUI.getOnChangeFunc(setting)
		)
		el.cont.updateSettingValue = () => {
			el.colorPicker.setColor(setting.value)
		}
		return el.cont
	}
	static createCssColorSettingDiv(setting) {
		let onChange = value => {
			setCssVariable(setting.id, value)
			SettingUI.getOnChangeFunc(setting)(value)
		}
		let el = DomHelper.createColorPickerText(
			setting.label,
			setting.value,
			onChange
		)
		el.cont.updateSettingValue = () => {
			el.colorPicker.setColor(setting.value.trim())
			setCssVariable(setting.id, setting.value)
		}
		return el.cont
	}
	static createCssNumberSettingDiv(setting) {
		let onChange = value => {
			setCssVariable(setting.id, value + setting.suffix)
			SettingUI.getOnChangeFunc(setting)(value)
		}
		let formatVal = val => val + "px"
		let el = DomHelper.createSliderWithLabelAndField(
			setting.id + "Slider",
			setting.label,
			parseFloat(setting.value),
			setting.min,
			setting.max,
			setting.step,
			onChange,
			formatVal
		).container
		el.classList.add("settingContainer")
		el.updateSettingValue = () => {
			el.querySelector("input").value = setting.value
			el.querySelector(".sliderVal").innerHTML = setting.value
			setCssVariable(setting.id, setting.value + setting.suffix)
		}
		return el
	}
}
