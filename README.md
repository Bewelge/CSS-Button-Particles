# CSS Button Particle Generator

## Tool to generate CSS particle effects for buttons

### [DEMO](https://bewelge.github.io/cssParticles/)

This tool provides an easy way to create particle effects for buttons. It works by defining a shape for each particle via background-image and moving it around/ resizing it via background-position and background-size.

If you want to tinker with the code or simply run the tool locally, you will need to run them through a local web server as I am using ES6 modules.

If you want to customise the generator even further, you can simply add additional settings in the ./js/Settings/DefaultSettings.js file and do with them what you want in the ShapeCreatetor.create() method (js/ShapeCreator.js). That's where all the physics/movement computation is happening.

## Libraries used:

- pickr - Color Picker - https://github.com/Simonwep/pickr
- jsZip - to create the downloadable html/js/css package.
