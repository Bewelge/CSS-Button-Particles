import { replaceAllString } from "./Util.js"

export class DomHelper {
	static createCanvas(width, height, styles) {
		return DomHelper.createElement("canvas", styles, {
			width: width,
			height: height
		})
	}
	static createSpinner() {
		return DomHelper.createDivWithIdAndClass("loadSpinner", "loader")
	}
	static setCanvasSize(cnv, width, height) {
		if (cnv.width != width) {
			cnv.width = width
		}
		if (cnv.height != height) {
			cnv.height = height
		}
	}
	static replaceGlyph(element, oldIcon, newIcon) {
		element.children.forEach(childNode => {
			if (childNode.classList.contains("glyphicon-" + oldIcon)) {
				childNode.className = childNode.className.replace(
					"glyphicon-" + oldIcon,
					"glyphicon-" + newIcon
				)
			}
		})
	}
	static removeClass(className, element) {
		if (element.classList.contains(className)) {
			element.classList.remove(className)
		}
	}
	static removeClassFromElementsSelector(selector, className) {
		document.querySelectorAll(selector).forEach(el => {
			if (el.classList.contains(className)) {
				el.classList.remove(className)
			}
		})
	}
	static createSliderWithLabel(id, label, val, min, max, step, onChange) {
		let cont = DomHelper.createElement(
			"div",
			{},
			{ id: id + "container", className: "sliderContainer" }
		)
		let labelDiv = DomHelper.createElement(
			"div",
			{},
			{ id: id + "label", className: "settingLabel", innerHTML: label }
		)
		let slider = DomHelper.createSlider(id, val, min, max, step, onChange)
		cont.appendChild(labelDiv)
		cont.appendChild(slider)
		return { slider: slider, container: cont }
	}
	static createSliderWithLabelAndField(
		id,
		label,
		val,
		min,
		max,
		step,
		onChange,
		formatVal
	) {
		formatVal = formatVal || (val => val)

		let displayDiv = DomHelper.createElement(
			"div",
			{},
			{ id: id + "Field", className: "sliderVal", innerHTML: formatVal(val) }
		)

		let onChangeInternal = ev => {
			displayDiv.innerHTML = formatVal(ev.target.value)
			onChange(ev.target.value)
		}

		let cont = DomHelper.createElement(
			"div",
			{},
			{ id: id + "container", className: "sliderContainer" }
		)
		let labelDiv = DomHelper.createElement(
			"div",
			{},
			{ id: id + "label", className: "settingLabel", innerHTML: label }
		)
		let sliderWrap = DomHelper.createDivWithClass("sliderWrap")
		let slider = DomHelper.createSlider(
			id,
			val,
			min,
			max,
			step,
			onChangeInternal
		)
		sliderWrap.appendChild(slider)
		cont.appendChild(labelDiv)
		cont.appendChild(displayDiv)
		cont.appendChild(sliderWrap)

		return { slider: slider, container: cont }
	}

	static createDoubleSliderWithLabelAndField(
		id,
		label,
		lowerVal,
		upperVal,
		min,
		max,
		step,
		onChange
	) {
		let minSlider, maxSlider

		let displayDiv = DomHelper.createElement(
			"div",
			{},
			{
				id: id + "Field",
				className: "sliderVal",
				innerHTML: lowerVal + " < - > " + upperVal
			}
		)

		let minOnChange = ev => {
			let minVal = parseFloat(ev.target.value)
			let maxVal = parseFloat(maxSlider.value)
			if (minVal > maxVal) {
				maxSlider.value = minVal
				maxVal = maxSlider.value
			}
			if (minVal == maxVal) {
				displayDiv.innerHTML = minVal
			} else {
				displayDiv.innerHTML = minVal + " < - > " + maxVal
			}
			onChange(minVal, maxVal)
		}
		let maxOnChange = ev => {
			let minVal = parseFloat(minSlider.value)
			let maxVal = parseFloat(ev.target.value)
			if (maxVal < minVal) {
				minSlider.value = maxVal
				minVal = minSlider.value
			}
			if (minVal == maxVal) {
				displayDiv.innerHTML = maxVal
			} else {
				displayDiv.innerHTML = minVal + " < - > " + maxVal
			}
			onChange(minVal, maxVal)
		}

		let cont = DomHelper.createElement(
			"div",
			{},
			{ id: id + "container", className: "sliderContainer" }
		)
		let labelDiv = DomHelper.createElement(
			"div",
			{},
			{ id: id + "label", className: "settingLabel", innerHTML: label }
		)
		minSlider = DomHelper.createSlider(
			id,
			lowerVal,
			min,
			max,
			step,
			minOnChange
		)
		DomHelper.addClassToElement("minSlider", minSlider)
		maxSlider = DomHelper.createSlider(
			id,
			upperVal,
			min,
			max,
			step,
			maxOnChange
		)
		DomHelper.addClassToElements("doubleSlider", [minSlider, maxSlider])
		DomHelper.addClassToElement("maxSlider", maxSlider)
		let sliderWrap = DomHelper.createDivWithClass("sliderWrap")

		cont.appendChild(labelDiv)
		cont.appendChild(displayDiv)
		sliderWrap.appendChild(minSlider)
		sliderWrap.appendChild(maxSlider)
		cont.appendChild(sliderWrap)

		return { slider: minSlider, sliderMax: maxSlider, container: cont }
	}
	static createGlyphiconButton(id, glyph, onClick) {
		let bt = DomHelper.createButton(id, onClick)
		bt.appendChild(this.getGlyphicon(glyph))
		return bt
	}
	static createGlyphiconTextButton(id, glyph, text, onClick) {
		let bt = DomHelper.createButton(id, onClick)
		bt.appendChild(this.getGlyphicon(glyph))
		bt.innerHTML += " " + text
		return bt
	}
	static createDiv(styles, attributes) {
		return DomHelper.createElement("div", styles, attributes)
	}
	static createDivWithId(id, styles, attributes) {
		attributes = attributes || {}
		attributes.id = id
		return DomHelper.createElement("div", styles, attributes)
	}
	static createDivWithClass(className, styles, attributes) {
		attributes = attributes || {}
		attributes.className = className
		return DomHelper.createElement("div", styles, attributes)
	}
	static createDivWithIdAndClass(id, className, styles, attributes) {
		attributes = attributes || {}
		attributes.id = id
		attributes.className = className
		return DomHelper.createElement("div", styles, attributes)
	}
	static createElementWithId(id, tag, styles, attributes) {
		attributes = attributes || {}
		attributes.id = id
		return DomHelper.createElement(tag, styles, attributes)
	}
	static createElementWithClass(className, tag, styles, attributes) {
		attributes = attributes || {}
		attributes.className = className
		return DomHelper.createElement(tag, styles, attributes)
	}
	static createElementWithIdAndClass(id, className, tag, styles, attributes) {
		styles = styles || {}
		attributes = attributes || {}
		attributes.id = id
		attributes.className = className
		return DomHelper.createElement(tag, styles, attributes)
	}
	static getGlyphicon(name) {
		return DomHelper.createElement(
			"span",
			{},
			{ className: "glyphicon glyphicon-" + name }
		)
	}
	static createSlider(id, val, min, max, step, onChange) {
		let el = DomHelper.createElement(
			"input",
			{},
			{
				id: id,
				oninput: onChange,
				type: "range",
				value: val,
				min: min,
				max: max,
				step: step
			}
		)
		el.value = val
		return el
	}
	static createTextArea(id, label, value, onChange, rows) {
		let cont = DomHelper.createDivWithClass("inputCont")
		let attributes = {}
		attributes.id = id
		const input = DomHelper.createElement("textArea", {}, attributes)
		input.onchange = ev => {
			onChange(input.value)
		}
		input.value = value
		input.setAttribute("rows", rows)

		let labelEl = DomHelper.createElementWithClass(
			"settingLabel",
			"div",
			{},
			{ innerHTML: label, for: id }
		)

		labelEl.setAttribute("for", id)
		cont.appendChild(labelEl)
		cont.appendChild(input)
		return cont
	}
	static createTextInput(id, label, value, onChange) {
		let cont = DomHelper.createDivWithClass("inputCont")
		let attributes = {}
		attributes.id = id
		attributes.type = "text"
		const input = DomHelper.createElement("input", {}, attributes)
		input.onchange = ev => {
			onChange(input.value)
		}
		input.value = value

		let labelEl = DomHelper.createElementWithClass(
			"label",
			"div",
			{},
			{ innerHTML: label, for: id }
		)

		labelEl.setAttribute("for", id)
		cont.appendChild(labelEl)
		cont.appendChild(input)
		return cont
	}
	static createCheckbox(text, onChange, value, isChecked) {
		let id = replaceAllString(text, " ", "") + "checkbox"
		let cont = DomHelper.createDivWithIdAndClass(id, "checkboxContainer")
		let checkbox = DomHelper.createElementWithClass("checkboxInput", "input")
		checkbox.setAttribute("type", "checkbox")
		checkbox.checked = value
		checkbox.setAttribute("name", id)
		checkbox.onchange = onChange

		let label = DomHelper.createElementWithClass(
			"settingLabel checkboxLabel",
			"div",
			{},
			{ innerHTML: text, for: id }
		)

		label.setAttribute("for", id)

		cont.appendChild(checkbox)
		cont.appendChild(label)
		cont.addEventListener("click", ev => {
			if (ev.target != checkbox) {
				checkbox.click()
				if (isChecked) {
					checkbox.checked = isChecked()
				}
			}
		})
		return cont
	}
	static addClassToElements(className, elements) {
		elements.forEach(element => DomHelper.addClassToElement(className, element))
	}
	static addClassToElement(className, element) {
		if (!element.classList.contains(className)) {
			element.classList.add(className)
		}
	}
	static createFlexContainer() {
		return DomHelper.createElement("div", {}, { className: "flexContainer" })
	}
	static addToFlexContainer(el) {
		let cont = DomHelper.createFlexContainer()
		cont.appendChild(el)
		return cont
	}
	static appendChildren(parent, children) {
		children.forEach(child => parent.appendChild(child))
	}
	static createButtonGroup(vertical) {
		return vertical
			? DomHelper.createElement(
					"div",
					{ justifyContent: "space-around" },
					{ className: "btn-group btn-group-vertical", role: "group" }
			  )
			: DomHelper.createElement(
					"div",
					{ justifyContent: "space-around" },
					{ className: "btn-group", role: "group" }
			  )
	}
	static createFileInput(text, callback) {
		let customFile = DomHelper.createElement(
			"label",
			{},
			{ className: "btn btn-default btn-file" }
		)
		customFile.appendChild(DomHelper.getGlyphicon("folder-open"))
		customFile.innerHTML += " " + text
		let inp = DomHelper.createElement(
			"input",
			{ display: "none" },
			{ type: "file" }
		)

		customFile.appendChild(inp)
		inp.onchange = callback

		return customFile
	}
	static getDivider() {
		return DomHelper.createElement("div", {}, { className: "divider" })
	}
	static createButton(id, onClick) {
		let bt = DomHelper.createElement(
			"button",
			{},
			{
				id: id,
				type: "button",
				className: "btn btn-default",
				onclick: onClick
			}
		)
		bt.appendChild(DomHelper.getButtonSelectLine())
		return bt
	}
	static createTextButton(id, text, onClick) {
		let bt = DomHelper.createElement(
			"button",
			{},
			{
				id: id,
				type: "button",
				className: "btn btn-default",
				onclick: onClick,
				innerHTML: text
			}
		)
		//
		bt.appendChild(DomHelper.getButtonSelectLine())
		return bt
	}
	static createTextButtonWithSuccessMsgField(id, text, onClick, onSuccessMsg) {
		let cont = DomHelper.createDivWithClass("txtBtnCont")
		let txtField = DomHelper.createDivWithClass("txtBtnField hidden")
		let onClickExt = ev => {
			if (onClick(ev)) {
				txtField.classList.remove("hidden")
				txtField.innerHTML = onSuccessMsg(ev)
				window.setTimeout(() => txtField.classList.add("hidden"), 1000)
			}
		}
		let bt = DomHelper.createElement(
			"button",
			{},
			{
				id: id,
				type: "button",
				className: "btn btn-default",
				onclick: onClickExt,
				innerHTML: text
			}
		)
		bt.appendChild(DomHelper.getButtonSelectLine())

		DomHelper.appendChildren(cont, [bt, txtField])
		return cont
	}
	static getButtonSelectLine() {
		return DomHelper.createDivWithClass("btn-select-line")
	}
	static createElement(tag, styles, attributes) {
		tag = tag || "div"
		attributes = attributes || {}
		styles = styles || {}
		let el = document.createElement(tag)
		Object.keys(attributes).forEach(attr => {
			el[attr] = attributes[attr]
		})
		Object.keys(styles).forEach(style => {
			el.style[style] = styles[style]
		})
		return el
	}

	static createInputSelect(title, items, value, callback) {
		let selectBox = DomHelper.createDivWithId(title)
		let label = DomHelper.createElementWithClass(
			"settingLabel inputSelectLabel",
			"div",
			{},
			{ innerHTML: title }
		)
		selectBox.appendChild(label)
		let selectTag = DomHelper.createElementWithIdAndClass(
			title,
			"inputSelect",
			"select"
		)
		selectBox.appendChild(selectTag)
		items.forEach((item, index) => {
			let option = DomHelper.createElement(
				"option",
				{},
				{
					value: item,
					innerHTML: item
				}
			)
			if (item == value) {
				option.selected = true
			}
			selectTag.appendChild(option)
		})
		selectBox.addEventListener("change", ev => {
			callback(selectTag.value)
		})
		return selectBox
	}

	static createColorPickerGlyphiconText(glyph, text, startColor, onChange) {
		let pickrEl = null
		let pickrElCont = DomHelper.createDiv()
		let glyphBut = DomHelper.createGlyphiconTextButton(
			"colorPickerGlyph" + glyph + replaceAllString(text, " ", "_"),
			glyph,
			text,
			() => {
				pickrEl.show()
			}
		)

		glyphBut.appendChild(pickrElCont)

		pickrEl = Pickr.create({
			el: pickrElCont,
			theme: "nano",
			useAsButton: true,
			// swatches: Object.keys(CONST.TRACK_COLORS)
			// 	.map(key => CONST.TRACK_COLORS[key])
			// 	.flat(),
			components: {
				hue: true,
				preview: true,
				opacity: true,
				interaction: {
					input: true
				}
			}
		})

		let getGlyphEl = () =>
			glyphBut.querySelector(
				"#colorPickerGlyph" +
					glyph +
					replaceAllString(text, " ", "_") +
					" .glyphicon"
			)

		pickrEl.on("init", () => {
			pickrEl.setColor(startColor)
			getGlyphEl().style.color = startColor
		})
		pickrEl.on("change", color => {
			let colorString = color.toRGBA().toString()
			getGlyphEl().style.color = colorString
			onChange(colorString)
		})
		return glyphBut
	}
	/**
	 *
	 * @param {String} text
	 * @param {String} startColor
	 * @param {Function} onChange  A color string of the newly selected color will be passed as argument
	 */
	static createColorPickerText(text, startColor, onChange) {
		let cont = DomHelper.createDivWithClass("settingContainer colorContainer")

		let label = DomHelper.createDivWithClass(
			"colorLabel settingLabel",
			{},
			{ innerHTML: text }
		)

		let colorButtonContainer = DomHelper.createDivWithClass(
			"colorPickerButtonContainer"
		)
		let colorButton = DomHelper.createDivWithClass("colorPickerButton")
		colorButtonContainer.appendChild(colorButton)

		cont.appendChild(label)
		cont.appendChild(colorButtonContainer)
		let colorPicker = Pickr.create({
			el: colorButton,
			theme: "nano",
			defaultRepresentation: "RGBA",
			// swatches: Object.keys(CONST.TRACK_COLORS)
			// 	.map(key => [
			// 		CONST.TRACK_COLORS[key].white,
			// 		CONST.TRACK_COLORS[key].black
			// 	])
			// 	.flat(),
			components: {
				hue: true,
				preview: true,
				opacity: true,
				interaction: {
					input: true
				}
			}
		})
		colorButtonContainer.style.backgroundColor = startColor
		cont.onclick = () => colorPicker.show()
		colorPicker.on("init", () => {
			colorPicker.show()
			colorPicker.setColor(startColor)
			colorPicker.hide()
		})
		colorPicker.on("change", color => {
			colorButtonContainer.style.backgroundColor = colorPicker
				.getColor()
				.toRGBA()
				.toString()
			if (
				colorButtonContainer.style.backgroundColor != color.toRGBA().toString()
			) {
				onChange(color.toRGBA().toString())
			}
		})

		return { cont, colorPicker }
	}
	static hideDiv(div) {
		// if (div) {
		div.classList.add("hidden")
		div.classList.remove("unhidden")
		// }
	}
	static showDiv(div) {
		// if (div) {
		div.classList.remove("hidden")
		div.classList.add("unhidden")
		// }
	}
	static undisplayDiv(div) {
		div.classList.add("gone")
	}
	static displayDiv(div) {
		div.classList.remove("gone")
	}
	static createHiddenScrollBar() {}

	static initDoubleSliders() {
		//TODO Fix&Cleanup

		document.querySelectorAll(".minSlider").forEach(el => {
			let maxSlider = el.parentElement.querySelector(".maxSlider")

			let maxGrabbed = false
			window.addEventListener("mouseup", () => (maxGrabbed = false))
			el.addEventListener("mousedown", ev => {
				const mouseX = ev.clientX - el.getBoundingClientRect().left
				let valAtMouse =
					parseFloat(maxSlider.min) +
					(parseFloat(maxSlider.max) - parseFloat(maxSlider.min)) *
						(mouseX / el.clientWidth)
				if (valAtMouse - el.value > maxSlider.value - valAtMouse) {
					ev.preventDefault()
					let valAtMouse =
						parseFloat(maxSlider.min) +
						(parseFloat(maxSlider.max) - parseFloat(maxSlider.min)) *
							(mouseX / el.clientWidth)
					maxSlider.value = valAtMouse
					maxGrabbed = true
					var event = new Event("input", {
						bubbles: true,
						cancelable: true
					})
					maxSlider.dispatchEvent(event)
				}
			})
			let mouseMoveListener = ev => {
				if (maxGrabbed) {
					const mouseX = ev.clientX - el.getBoundingClientRect().left
					let valAtMouse =
						parseFloat(maxSlider.min) +
						(parseFloat(maxSlider.max) - parseFloat(maxSlider.min)) *
							(mouseX / el.clientWidth)
					maxSlider.value = valAtMouse

					var event = new Event("input", {
						bubbles: true,
						cancelable: true
					})
					maxSlider.dispatchEvent(event)
					//TODO For IE:
					//var event = document.createEvent('Event');
					// event.initEvent('input', true, true);

					// elem.dispatchEvent(event);
				}
			}
			window.addEventListener("mousemove", ev => {
				mouseMoveListener(ev)
			})

			// el.addEventListener("click", ev => {
			// 	// ev.preventDefault()
			// 	console.log(ev.target)
			// 	let maxSliderPos =
			// 		((parseFloat(maxSlider.value) - parseFloat(maxSlider.min)) /
			// 			(parseFloat(maxSlider.max) - parseFloat(maxSlider.min))) *
			// 		el.clientWidth

			// 	const mouseX = ev.clientX - el.getBoundingClientRect().left
			// 	if (mouseX > maxSliderPos) {
			// 	}

			// 	let valAtMouse =
			// 		parseFloat(maxSlider.min) +
			// 		(parseFloat(maxSlider.max) - parseFloat(maxSlider.min)) *
			// 			(mouseX / el.clientWidth)
			// 	console.log(ev)
			// 	console.log(ev.clientX - el.getBoundingClientRect().left)
			// 	console.log(el.clientWidth)
			// })
		})
	}
	static getElementAsHtmlString(el) {
		let outer = document.createElement("div")
		let elsClone = el.cloneNode(false)
		outer.appendChild(elsClone)
		let str = outer.innerHTML
		outer.removeChild(elsClone)
		return str
	}
}
