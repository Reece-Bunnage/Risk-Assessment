# Risk-Assessment
This program will utilize AI within a web app to perform a risk assessment of a program. This can be used for IT departments when deciding to use or integrate a software into their workflows.

## Run locally

1. Install Node.js 18+ (includes `npm`).
2. Install dependencies:
	`npm install`
3. Start the app:
	`npm run dev`
4. Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for production

`npm run build`

## Blank page troubleshooting

- Do not open `index.html` directly with a `file:///...` URL.
- This project uses React + Vite, so source files must be served through the dev server.
- If terminal shows `npm: command not found`, Node.js is not installed or not on PATH.
- If the app still looks blank, open browser dev tools console and check for module load errors.
