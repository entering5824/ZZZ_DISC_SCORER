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

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zzz-disc-scorer
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:5173
   ```

## Usage

1. **Set Stat Priorities**
   Add desired stats in order of importance

2. **Configure Base Enhancement**
   Set the base enhancement level (default is 5)

3. **Select Main Stats**
   Choose main stats for disc slots 4, 5, and 6 if applicable

4. **Calculate**
   Click the calculate button to generate optimal substat combinations

5. **Review Results**
   View the calculated score and recommended substats per disc slot

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Contributing

Issues and enhancement requests are welcome.

## License

This project is private and intended for personal use.

```
