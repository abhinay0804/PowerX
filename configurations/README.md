# Configuration Files

This folder contains all the configuration files for the project, organized to keep the root directory clean.

## Files

### `tailwind.config.ts`
- Tailwind CSS configuration
- Defines the design system tokens, colors, and utilities
- Referenced from root `tailwind.config.ts` which imports this file

### `eslint.config.js` 
- ESLint configuration for code linting
- TypeScript and React rules
- Referenced from root `eslint.config.js` which imports this file

### `postcss.config.js`
- PostCSS configuration for processing CSS
- Includes Tailwind CSS and Autoprefixer plugins
- Referenced from root `postcss.config.js` which imports this file

### `components.json`
- shadcn/ui component configuration
- Defines component aliases and paths
- Updated to reference the Tailwind config in this folder

### `icon.png`
- Application icon/favicon
- Used in index.html as the site favicon
- Replaces the previous Abhinay uploads icon

## Usage

These configuration files are automatically referenced by their corresponding files in the project root. The root files simply re-export these configurations to maintain tool compatibility while keeping a clean project structure.