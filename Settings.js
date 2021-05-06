import { getDefaultSettings } from "./DefaultSettings.js"
import { SettingUI } from "./SettingUI.js"
import {
	getGlobalSavedSettings,
	saveCurrentSettings
} from "./LocalStorageHandler.js"

class Settings {
	constructor(ui) {
		this.settings = getDefaultSettings()
		let savedSettings = getGlobalSavedSettings()

		this.settingsById = {}
		Object.keys(this.settings).forEach(tabId =>
			Object.keys(this.settings[tabId]).forEach(categoryId =>
				this.settings[tabId][categoryId].forEach(setting => {
					this.settingsById[setting.id] = setting

					if (savedSettings.hasOwnProperty(setting.id)) {
						setting.value = savedSettings[setting.id]
					}
				})
			)
		)
		this.settingsUi = new SettingUI()
	}
	setSettingValue(settingId, value) {
		this.settingsById[settingId].value = value
	}
}

const globalSettings = new Settings()
export const getSetting = settingId => {
	if (globalSettings == null) {
		globalSettings = new Settings()
	}
	return globalSettings.settingsById[settingId]
		? !isNaN(parseFloat(globalSettings.settingsById[settingId].value))
			? parseFloat(globalSettings.settingsById[settingId].value)
			: globalSettings.settingsById[settingId].value
		: null
}
export const setSetting = (settingId, value) => {
	globalSettings.settingsById[settingId].value = value
	if (settingCallbacks.hasOwnProperty(settingId)) {
		settingCallbacks[settingId].forEach(callback => callback())
	}
	settingGeneralCallbacks.forEach(callback => callback())

	saveCurrentSettings()
}
export const getSettingsDiv = () => {
	return globalSettings.settingsUi.getSettingsDiv(globalSettings.settings)
}
var settingCallbacks = {}
export const setSettingCallback = (settingId, callback) => {
	if (!settingCallbacks.hasOwnProperty(settingId)) {
		settingCallbacks[settingId] = []
	}
	settingCallbacks[settingId].push(callback)
}

var settingGeneralCallbacks = []
/**
 * add a callback thats excecuted on every setting change
 */
export const setGeneralSettingCallback = callback => {
	settingGeneralCallbacks.push(callback)
}
export const setCallbackIf = (ifPredicate, callback) => {
	Object.keys(globalSettings.settingsById)
		.filter(settingId => ifPredicate(globalSettings.settingsById[settingId]))
		.forEach(settingId => {
			setSettingCallback(settingId, callback)
		})
}
export const getSettingObject = () => {
	let obj = {}
	for (let key in globalSettings.settingsById) {
		obj[key] = globalSettings.settingsById[key].value
	}
	return obj
}

export const resetSettingsToDefault = () => {
	let defaultSettings = getDefaultSettings()
	Object.keys(defaultSettings).forEach(tabId =>
		Object.keys(defaultSettings[tabId]).forEach(categoryId =>
			defaultSettings[tabId][categoryId].forEach(setting => {
				globalSettings.settingsById[setting.id].value = setting.value
			})
		)
	)

	let parent = globalSettings.settingsUi.getSettingsDiv(globalSettings.settings)
		.parentElement
	parent.removeChild(
		globalSettings.settingsUi.getSettingsDiv(globalSettings.settings)
	)
	globalSettings.settingsUi.mainDiv = null
	parent.appendChild(getSettingsDiv())
}
