import { SETTING_IDS } from "./DefaultSettings.js"
import { getSetting, getSettingObject } from "./Settings.js"

const SAVE_PATH_ROOT = "CssParticleButtons/SavedSettings"
const SAVE_PATH_BUTTONS = "CssParticleButtons/SavedButtons"
export const getGlobalSavedSettings = () => {
	let obj = {}
	if (window.localStorage) {
		let storedObj = window.localStorage.getItem(SAVE_PATH_ROOT)
		if (storedObj) {
			obj = JSON.parse(storedObj)
		}
	}
	return obj
}

export const saveCurrentSettings = () => {
	if (window.localStorage) {
		let saveObj = getSettingObject()
		window.localStorage.setItem(SAVE_PATH_ROOT, JSON.stringify(saveObj))
	}
}

export const saveCurrentButtonInLocalStorage = () => {
	if (window.localStorage) {
		let saveObj = getSettingObject()
		let savedButtonsObj =
			JSON.parse(window.localStorage.getItem(SAVE_PATH_BUTTONS)) || {}
		savedButtonsObj[getSetting(SETTING_IDS.BUTTON_NAME)] = saveObj
		window.localStorage.setItem(
			SAVE_PATH_BUTTONS,
			JSON.stringify(savedButtonsObj)
		)
		return true
	}
	return false
}

export const getSavedButtons = () => {
	if (window.localStorage) {
		return JSON.parse(window.localStorage.getItem(SAVE_PATH_BUTTONS)) || {}
	}
	return {}
}

export const deleteSavedButton = buttonName => {
	if (window.localStorage) {
		let saveObj =
			JSON.parse(window.localStorage.getItem(SAVE_PATH_BUTTONS)) || {}
		if (saveObj.hasOwnProperty(buttonName)) {
			delete saveObj[buttonName]
			window.localStorage.setItem(SAVE_PATH_BUTTONS, JSON.stringify(saveObj))
			return true
		}
	}
	return false
}
