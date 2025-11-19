# Coordinate Grabber

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
