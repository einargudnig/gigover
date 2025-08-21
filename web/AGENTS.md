# Agent Guidelines for Gigover Web

## Build Commands
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run storybook` - Run Storybook
- `vitest run` - Run tests
- `vitest run path/to/test` - Run single test
- `npm run deploy` - Build and deploy to Firebase

## Linting and Formatting
- ESLint with TypeScript, React, and Prettier integration
- Run linting: `npx eslint src/**/*.{ts,tsx}`
- Format code: `npx prettier --write src/**/*.{ts,tsx}`

## Code Style
- Tab indentation (4 spaces)
- Single quotes for strings
- 100 character line limit
- No trailing commas
- Semicolons required
- Strict TypeScript with no implicit any
- React functional components with hooks
- Warning on unused variables with rest siblings ignored

## File Structure
- React components in src/components/
- Hooks in src/hooks/
- API queries in src/queries/
- API mutations in src/mutations/
- Models/types in src/models/
- Utility functions in src/utils/
- Pages in src/pages/

## Best Practices
- Use React Query for API data management
- Follow React hooks rules
- Prefer explicit typing over 'any'
- Use ChakraUI for styling and components
- Handle errors with try/catch or ErrorBoundary
- Use Firebase for authentication