# ZZZ Disc Scorer

A web-based calculator for optimizing disc substats in **Zenless Zone Zero (ZZZ)**.  
This tool helps players determine the best substat combinations for their discs based on stat priorities and enhancement levels.

## Features

- **Stat Priority Configuration**  
  Set your preferred stat priorities (e.g. ATK%, CR, CD, AP)

- **Disc Slot Management**  
  Configure main stats for disc slots 4, 5, and 6

- **Score Calculation**  
  Automatically calculates optimal substat distributions for maximum score

- **Real-time Updates**  
  Results update instantly as you adjust settings

- **Responsive Design**  
  Fully usable on both desktop and mobile devices

## Technologies Used

- **React 19** – UI framework  
- **TypeScript** – Static type safety  
- **Vite** – Build tool & dev server  
- **Framer Motion** – Animations  
- **Lucide React** – Icon library  
- **ESLint** – Code linting

Đã sửa lại phần **Installation → Usage → Build** cho rõ ràng, cross-platform và có vài mẹo xử lý lỗi. Copy toàn bộ khối markdown dưới đây và dán đè vào README của bạn.

````md
## Installation

**Prerequisites**

- Node.js (recommend v18 or newer)
- npm (or yarn / pnpm)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zzz-disc-scorer
````

2. Install dependencies (choose one):

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

> For CI / reproducible installs you can use `npm ci` when `package-lock.json` is present.

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

If you need a specific port (e.g. 3000), run:

```bash
npm run dev -- --port 3000
```

4. Open your browser and navigate to:

```
http://localhost:5173
```

(or the port you specified)

## Usage

1. **Set Stat Priorities**
   Add desired stats in order of importance (e.g. ATK%, CR, CD, AP).

2. **Configure Base Enhancement**
   Set the base enhancement level (default: `5`).

3. **Select Main Stats**
   Choose main stats for disc slots 4, 5, and 6 if applicable.

4. **Calculate**
   Click the calculate button to generate optimal substat combinations.

5. **Review Results**
   View the calculated score and recommended substats per disc slot. Results update in real time as you change settings.

## Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## Preview Production Build

Start a local preview of the production build:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

The preview command serves the built site (default port 5173). Use `-- --port <port>` to change it.

## Troubleshooting

* **`command not found` / Node version issues**: make sure Node.js is installed and your PATH set. Use `node -v` / `npm -v`.
* **Port already in use**: start with a different port `npm run dev -- --port 3000`.
* **Install failures / lockfile mismatch**: remove `node_modules` and run `npm ci` (if you have a lockfile) or `npm install`.
* **Type errors during dev**: ensure your `tsconfig.*.json` files are present and paths are correct.

## Contributing

Issues and enhancement requests are welcome.

## License

This project is private and intended for personal use.
