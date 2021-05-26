import { getDefaultSettings, SETTING_TYPES } from "./DefaultSettings.js"
import { SettingUI } from "./SettingUI.js"
import {
	getGlobalSavedSettings,
	saveCurrentSettings
} from "./LocalStorageHandler.js"
import { getURLParams } from "../Util/Util.js"

class Settings {
	constructor(ui) {
		this.settings = getDefaultSettings()
		let savedSettings = getGlobalSavedSettings()
		this.resetCallbacks = []
		this.loadCallbacks = []

		let urlParams = getURLParams()
		let entries = urlParams.entries()
		let urlParamSettings = {}
		let current = entries.next()
		while (!current.done) {
			urlParamSettings[current.value[0]] = current.value[1]
			current = entries.next()
		}
		let isUrlParamsSet = Object.keys(urlParamSettings).length > 0

		this.settingsById = {}
		Object.keys(this.settings).forEach(tabId =>
			Object.keys(this.settings[tabId]).forEach(categoryId =>
				this.settings[tabId][categoryId].forEach(setting => {
					this.settingsById[setting.id] = setting

					if (!isUrlParamsSet) {
						this.setSettingsFromSaved(savedSettings, setting)
					} else {
						this.setSettingsFromUrlParam(urlParamSettings, setting)
					}
				})
			)
		)

		this.settingsUi = new SettingUI()

		this.initDependencies()
	}
	setSettingsFromUrlParam(urlParamSettings, setting) {
		if (urlParamSettings.hasOwnProperty(setting.id)) {
			if (this.settingsById[setting.id].type == SETTING_TYPES.DOUBLE_SLIDER) {
				let min = urlParamSettings[setting.id].split("|")[0]
				let max = urlParamSettings[setting.id].split("|")[1]

				setting.lowerValue = min
				setting.upperValue = max
			} else {
				setting.value = urlParamSettings[setting.id]
			}
		}
	}
	setSettingsFromSaved(savedSettings, setting) {
		if (savedSettings.hasOwnProperty(setting.id)) {
			if (this.settingsById[setting.id].type == SETTING_TYPES.DOUBLE_SLIDER) {
				setting.lowerValue = savedSettings[setting.id].min
				setting.upperValue = savedSettings[setting.id].max
			} else {
				setting.value = savedSettings[setting.id]
			}
		}
	}

	initDependencies() {
		this.showIfDependees = new Set(
			Object.keys(this.settingsById)
				.map(id => this.settingsById[id])
				.filter(setting => setting.hasOwnProperty("showIfDependee"))
				.map(setting => setting.showIfDependee)
		)
	}
	resetToDefault() {}
}

const globalSettings = new Settings()

export const initSettingDependencies = () => {
	globalSettings.showIfDependees.forEach(dep => {
		checkDependencies(dep)
	})
}
export const getAllCssSettings = () => {
	return Object.keys(globalSettings.settingsById).filter(
		settingId =>
			globalSettings.settingsById[settingId].type == SETTING_TYPES.CSS_COLOR ||
			globalSettings.settingsById[settingId].type == SETTING_TYPES.CSS_NUMBER
	)
}
export const getSetting = settingId => {
	if (globalSettings == null) {
		globalSettings = new Settings()
	}
	if (isSettingMinMaxSlider(settingId)) {
		return {
			min: parseFloatIfNotNaN(
				globalSettings.settingsById[settingId].lowerValue
			),
			max: parseFloatIfNotNaN(globalSettings.settingsById[settingId].upperValue)
		}
	}
	return globalSettings.settingsById[settingId]
		? parseFloatIfNotNaN(globalSettings.settingsById[settingId].value)
		: null
}
export const setSetting = (settingId, value) => {
	if (isSettingMinMaxSlider(settingId)) {
		globalSettings.settingsById[settingId].lowerValue = value[0]
		globalSettings.settingsById[settingId].upperValue = value[1]
	} else {
		globalSettings.settingsById[settingId].value = value
	}
	if (settingCallbacks.hasOwnProperty(settingId)) {
		settingCallbacks[settingId].forEach(callback => callback())
	}
	if (globalSettings.showIfDependees.has(settingId)) {
		checkDependencies(settingId)
	}
	settingGeneralCallbacks.forEach(callback => callback())

	saveCurrentSettings()
}

export const getASettingDiv = settingId => {
	return SettingUI.createSettingDiv(globalSettings.settingsById[settingId])
}
function checkDependencies(settingId) {
	let deps = getDependentsOf(settingId)
	let settingsShowHideList = deps.map(aSettingId => [
		aSettingId,
		globalSettings.settingsById[aSettingId].showIf(
			globalSettings.settingsById[settingId].value
		)
	])
	globalSettings.settingsUi.showHideSettings(settingsShowHideList)
}
function getDependentsOf(settingId) {
	return Object.keys(globalSettings.settingsById).filter(
		aSettingId =>
			globalSettings.settingsById[aSettingId].showIfDependee === settingId
	)
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
		if (isSettingMinMaxSlider(key)) {
			obj[key] = {
				min: globalSettings.settingsById[key].lowerValue,
				max: globalSettings.settingsById[key].upperValue
			}
		} else {
			obj[key] = globalSettings.settingsById[key].value
		}
	}
	return obj
}

export const resetSettingsToDefault = () => {
	let defaultSettings = getDefaultSettings()
	Object.keys(defaultSettings).forEach(tabId =>
		Object.keys(defaultSettings[tabId]).forEach(categoryId =>
			defaultSettings[tabId][categoryId].forEach(setting => {
				if (isSettingMinMaxSlider(setting.id)) {
					globalSettings.settingsById[setting.id].upperValue =
						setting.upperValue
					globalSettings.settingsById[setting.id].lowerValue =
						setting.lowerValue
				} else {
					globalSettings.settingsById[setting.id].value = setting.value
				}
				globalSettings.settingsUi.updateSettingDivValue(setting.id)
				checkDependencies(setting.id)
			})
		)
	)

	globalSettings.resetCallbacks.forEach(callback => callback())
	saveCurrentSettings()
}
export const loadAButton = settingsObj => {
	resetSettingsToDefault()
	Object.keys(settingsObj).forEach(settingId => {
		let val = settingsObj[settingId]
		if (globalSettings.settingsById.hasOwnProperty(settingId)) {
			if (isSettingMinMaxSlider(settingId)) {
				globalSettings.settingsById[settingId].upperValue = val.max
				globalSettings.settingsById[settingId].lowerValue = val.min
			} else {
				globalSettings.settingsById[settingId].value = val
			}
		} else {
			console.error("Unknown setting ID: " + settingId)
		}
		globalSettings.settingsUi.updateSettingDivValue(settingId)
		checkDependencies(settingId)
	})
	globalSettings.loadCallbacks.forEach(callback => callback())
}

export const addResetCallback = callback => {
	globalSettings.resetCallbacks.push(callback)
}
export const addLoadCallback = callback => {
	globalSettings.loadCallbacks.push(callback)
}

function isSettingMinMaxSlider(settingId) {
	return (
		globalSettings.settingsById.hasOwnProperty(settingId) &&
		globalSettings.settingsById[settingId].type == SETTING_TYPES.DOUBLE_SLIDER
	)
}
function parseFloatIfNotNaN(num) {
	return !isNaN(parseFloat(num)) ? parseFloat(num) : num
}

export const createParameterStringWithSettings = () => {
	return (
		window.location.origin +
		"?" +
		Object.keys(globalSettings.settingsById)
			.map(settingId => {
				let setting = globalSettings.settingsById[settingId]
				let val =
					setting.type == SETTING_TYPES.DOUBLE_SLIDER
						? setting.lowerValue + "|" + setting.upperValue
						: setting.value
				return encodeURIComponent(settingId + "=" + val)
			})
			.join("&")
	)
}
