# Coordinate Grabber

A simple in-browser app to quickly grab multiple rectangle coordinates from a given image, available [here](
tkarabela.github.io/coordinate-grabber/). It's useful for cropping images with [Pillow](https://pypi.org/project/pillow/) or similar.

Also an experiment in *vibe coding*. The entirety of the code has been created in half an hour in Cursor using the following prompts:

```
Please set up a new Node.js project using TypeScript. I want to create a single-page application where the user can drag-and-drop an image, then draw a rectangle in the image, and copy coordinates of the rectangle.

I need the printed coordinates to correspond to dimensions of the uploaded image, not dimensions of the HTML canvas.

Please add interface to draw multiple rectangles and get their corresponding coordinates.

Please change the text format of coordinates from "x: <x>, y: <y>, width: <width>, height: <height>" to "[<x>, <y>, <width>, <height>]".

Please add a GitHub CI action to type check and dummy build the code on every push to GitHub.

Please add a GitHub CI action on every push to master branch that will build the project and push the HTML and associated JavaScript to GitHub Pages for this repository.
```

---

A single-page application built with TypeScript that allows you to:
- Drag and drop images
- Draw rectangles on images
- Copy rectangle coordinates (x, y, width, height)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start the development server:
```bash
npm run serve
```

The application will open in your browser at `http://localhost:8080`

### Development

To watch for changes and automatically rebuild:
```bash
npm run dev
```

Then in another terminal, run the serve command.

## Usage

1. Drag and drop an image onto the drop zone, or click to select a file
2. Click and drag on the image to draw a rectangle
3. Release to see the coordinates displayed
4. Click "Copy Coordinates" to copy them to your clipboard
5. Use "Clear Rectangle" to remove the current selection
6. Use "Reset Image" to start over with a new image

## Project Structure

```
.
├── src/
│   └── app.ts          # Main application logic
├── dist/               # Compiled JavaScript (generated)
├── index.html          # HTML structure
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

## License

MIT, see [LICENSE.txt](./LICENSE.txt)
