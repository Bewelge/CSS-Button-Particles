import { SETTING_IDS } from "./Settings/DefaultSettings.js"
import { getSetting } from "./Settings/Settings.js"

export const SHAPE_TYPES = {
	RECTANGLE: "Rectangle",
	PARALLELOGRAM: "Parallelogram",
	CIRCLE: "Circle",
	HALF_CIRCLE: "Half Circle",
	LINE: "Line",
	TRIANGLE: "Triangle",
	TRIANGLE2: "Triangle2",
	TRAPEZ: "Trapez",
	TRAPEZEVEN: "Trapez even",
	KITE_SQUARE: "Kite square",
	CLOCK: "Sandclock",
	BOWTIE: "Bowtie",
	CUSTOM: "Custom"
}

const SHAPES = [
	{
		type: SHAPE_TYPES.CIRCLE,
		getCssString: (color, circlePercent) =>
			"radial-gradient(circle, " +
			color +
			" " +
			circlePercent +
			"%, transparent " +
			(circlePercent + 0) +
			"%)"
	},
	{
		type: SHAPE_TYPES.TRAPEZ,
		getCssString: color =>
			"conic-gradient( from 165deg at 50% -86%, " +
			color +
			" 0," +
			color +
			"  8%, transparent 8%  )"
	},
	{
		type: SHAPE_TYPES.RECTANGLE,
		getCssString: color => "linear-gradient(" + color + "," + color + ")"
	},
	{
		type: SHAPE_TYPES.HALF_CIRCLE,
		getCssString: (color, circlePercent) =>
			"radial-gradient( circle at 50% 0%, " +
			color +
			" " +
			circlePercent +
			"%, transparent " +
			circlePercent +
			"%)"
	},

	{
		type: SHAPE_TYPES.LINE,
		getCssString: (color, degree) =>
			"linear-gradient(" +
			degree +
			"deg, transparent,transparent 46%," +
			color +
			" 46%, " +
			color +
			" 54%,  transparent 54%, transparent)"
	},
	{
		type: SHAPE_TYPES.TRIANGLE,
		getCssString: (color, degree) =>
			" linear-gradient( -135deg, " + color + " 50%, transparent 50% )"
	},
	{
		type: SHAPE_TYPES.TRIANGLE2,
		getCssString: (color, degree) =>
			"conic-gradient(" +
			"	from 145deg," +
			color +
			" 0, " +
			color +
			" 20%, transparent 20%" +
			" )"
	},
	{
		type: SHAPE_TYPES.PARALLELOGRAM,
		getCssString: (color, trapezPercent, trapezDegree) =>
			"linear-gradient( " +
			trapezDegree +
			"deg, transparent " +
			trapezPercent +
			"%, " +
			color +
			" " +
			trapezPercent +
			"%, " +
			color +
			" " +
			(100 - trapezPercent) +
			"%, transparent " +
			(100 - trapezPercent) +
			"% )"
	},
	{
		type: SHAPE_TYPES.TRAPEZEVEN,
		getCssString: color =>
			"conic-gradient( from 165deg at 50% -86%, " +
			color +
			" 0," +
			color +
			"  8%, transparent 8%  )"
	},
	{
		type: SHAPE_TYPES.KITE_SQUARE,
		getCssString: (color, degree) => {
			degree = 90
			return (
				"conic-gradient( from " +
				degree +
				"deg at 0 0,  transparent " +
				(degree - 65) +
				"deg," +
				color +
				" " +
				(degree - 65) +
				"deg," +
				color +
				"  " +
				(degree - 25) +
				"deg, transparent " +
				(degree - 25) +
				"deg  )"
			)
		}
	},
	{
		type: SHAPE_TYPES.CLOCK,
		getCssString: (color, degree) =>
			"conic-gradient( from 90deg," +
			"  transparent 12.5%," +
			color +
			" 12.5%," +
			color +
			"  37.5%, transparent 37.5%, transparent 62.5%, " +
			color +
			" 62.5%, " +
			color +
			" 87.5% , transparent 87.5%)"
	},
	{
		type: SHAPE_TYPES.BOWTIE,
		getCssString: color =>
			"conic-gradient(  transparent 60deg, " +
			color +
			" 60deg, " +
			color +
			" 120deg, transparent 120deg, transparent 240deg, " +
			color +
			" 240deg, " +
			color +
			" 300deg, transparent 300deg)"
	}
]

export const getCssStringForShape = shape => {
	let circlePercent = 45
	let trapezPercent = 30
	let trapezDegree = 110
	let str = ""
	let cssStringFunc = null
	try {
		cssStringFunc = getCssStringFunc(shape.type)
	} catch (e) {
		//Custom doesnt need a function
	}
	if (shape.type == SHAPE_TYPES.RECTANGLE) {
		str += cssStringFunc(shape.color)
	} else if (shape.type == SHAPE_TYPES.PARALLELOGRAM) {
		str += cssStringFunc(shape.color, trapezPercent, trapezDegree)
	} else if (shape.type == SHAPE_TYPES.CIRCLE) {
		str += cssStringFunc(shape.color, circlePercent)
	} else if (shape.type == SHAPE_TYPES.HALF_CIRCLE) {
		str += cssStringFunc(shape.color, circlePercent)
	} else if (shape.type == SHAPE_TYPES.LINE) {
		str += cssStringFunc(shape.color, shape.degree)
	} else if (shape.type == SHAPE_TYPES.TRIANGLE) {
		str += cssStringFunc(shape.color, shape.degree)
	} else if (shape.type == SHAPE_TYPES.TRIANGLE2) {
		str += cssStringFunc(shape.color, shape.degree)
	} else if (shape.type == SHAPE_TYPES.TRAPEZ) {
		str += cssStringFunc(shape.color, trapezPercent, trapezDegree)
	} else if (shape.type == SHAPE_TYPES.TRAPEZEVEN) {
		str += cssStringFunc(shape.color, shape.degree)
	} else if (shape.type == SHAPE_TYPES.KITE_SQUARE) {
		str += cssStringFunc(shape.color, shape.degree)
	} else if (shape.type == SHAPE_TYPES.CLOCK) {
		str += cssStringFunc(shape.color, shape.degree)
	} else if (shape.type == SHAPE_TYPES.BOWTIE) {
		str += cssStringFunc(shape.color, shape.degree)
	} else if (shape.type == SHAPE_TYPES.CUSTOM) {
		str += getSetting(SETTING_IDS.SHAPE_STRING).split(";")[0]
	}
	return str
}

const getCssStringFunc = shapeType => {
	let shapesOfType = SHAPES.filter(shape => shape.type == shapeType)
	if (shapesOfType[0]) {
		return shapesOfType[0].getCssString
	}
}
