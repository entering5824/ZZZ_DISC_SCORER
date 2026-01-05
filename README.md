# ZZZ Disc Scorer

A web-based calculator for optimizing disc substats in Zenless Zone Zero (ZZZ). This tool helps players calculate the best substat combinations for their discs based on stat priorities and enhancement levels.

## Features

- **Stat Priority Configuration**: Set your preferred stat priorities (e.g., ATK%, CR, CD, AP)
- **Disc Slot Management**: Configure main stats for slots 4, 5, and 6
- **Score Calculation**: Automatically calculate optimal substats for maximum score
- **Real-time Updates**: See results instantly as you adjust settings
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **ESLint** - Code linting

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zzz-disc-scorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Set Priorities**: Add your desired stat priorities in order of importance
2. **Configure Base Enhancement**: Set the base enhancement level (default: 5)
3. **Select Main Stats**: Choose main stats for slots 4, 5, and 6 if needed
4. **Calculate**: Click the calculate button to see optimal substat combinations
5. **Review Results**: View the calculated score and recommended substats for each disc slot

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is private and for personal use.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
