# Vite Migration and Package Update Plan

This document outlines the tasks for migrating the React application from Create React App (CRA) to Vite, along with necessary package updates.

## Phase 1: Critical Dependency Updates

-   [x] **Upgrade Firebase (v7 to v10+)**
    -   [x] Update `firebase` package in `package.json`.
    -   [x] Refactor Firebase initialization and service usage to the v9+ modular API (`src/firebase/firebase.ts`, `src/services/FileSystemService.ts`, `src/hooks/useFirebaseAuth.ts`, `src/pages/NewLogin.tsx`, `src/firebase/firebaseTypes.ts`).
    -   [x] Test authentication and Firebase-dependent features.
-   [-] **Upgrade React Query (v3 to TanStack Query v5)**
    -   [x] Replace `react-query` with `@tanstack/react-query` in `package.json`.
    -   [x] Update `QueryClientProvider` setup in `src/index.tsx`.
    -   [x] Refactor all instances of `useQuery`, `useMutation`, and other hooks.
        -   [x] `src/mutations/useHoldResource.ts`
        -   [x] `src/mutations/useImageDot.ts`
        -   [x] `src/mutations/useRemoveProgressTab.ts`
        -   [x] `src/mutations/useReleaseResource.ts`
        -   [x] `src/mutations/useModifyProject.ts`
        -   [x] `src/mutations/useReportToCSV.ts`
        -   [x] `src/mutations/useAddDocument.ts`
        -   [x] `src/queries/useGetUserByPhoneNumber.ts`
        -   [x] `src/mutations/useDeleteDocument.ts`
        -   [x] `src/mutations/procurement/useAcceptOffer.ts`
        -   [x] `src/mutations/procurement/useInviteBidder.ts`
        -   [x] `src/mutations/procurement/useAddOffer.ts`
        -   [x] `src/mutations/procurement/useAddTenderItem.ts`
        -   [x] `src/mutations/properties/useAddStakeHolder.ts`
        -   [x] `src/mutations/properties/useAddProjectToProperty.ts`
        -   [x] `src/mutations/properties/useRemoveProjectFromProperty.ts`
        -   [x] `src/mutations/properties/useEditProperty.ts`
        -   [x] `src/mutations/procurement/useDeleteProcurement.ts`
        -   [x] `src/mutations/properties/useAddUnit.ts`
        -   [x] `src/mutations/procurement/useAddTenderDocument.ts`
        -   [x] `src/mutations/procurement/useModifyTender.ts`
        -   [x] `src/mutations/procurement/useDeleteTenderItem.ts`
        -   [x] `src/mutations/procurement/useAddOfferItems.ts`
        -   [x] `src/mutations/procurement/useModifyTenderItem.ts`
        -   [x] `src/mutations/procurement/usePublishOffer.ts`
        -   [x] `src/mutations/procurement/usePublishTender.ts`
        -   [x] `src/mutations/procurement/client-bids/useAcceptBid.ts`
        -   [x] `src/mutations/procurement/client-bids/useEditBidItem.ts`
        -   [x] `src/mutations/procurement/client-bids/useEditBid.ts`
        -   [x] `src/mutations/procurement/useRejectOffer.ts`
        -   [x] `src/mutations/procurement/useAddTenderDocumentByTenderOwner.ts`
        -   [x] `src/mutations/procurement/client-bids/useRejectBid.ts`
        -   [x] `src/mutations/procurement/client-bids/useDeleteBidItem.ts`
        -   [x] `src/mutations/properties/useRemoveStakeHolder.ts`
        -   [x] `src/mutations/properties/useAddPropertyDocument.ts`
        -   [x] `src/queries/useVerify.ts`
        -   [x] `src/mutations/useChangeUid.ts`
        -   [x] `src/mutations/useProjectFolders.ts`
    -   [ ] Review TanStack Query v4 and v5 migration guides for breaking changes.
    -   [ ] Test all data-fetching and caching functionality.
-   [ ] **Stabilize React Router DOM (v6-beta to v6-latest stable)**
    -   [ ] Update `react-router-dom` in `package.json`.
    -   [ ] Review React Router v6 stable release notes for breaking changes from the beta version.
    -   [ ] Test all routing, navigation, and route-related hooks.

## Phase 2: Update Other Important Dependencies

-   [ ] **Chakra UI (`@chakra-ui/react`)**
    -   [ ] Update `@chakra-ui/react` (currently `^2.10.4`) and related packages (e.g., `@chakra-ui/icons`) to the latest `^2.x.x` or a suitable newer version.
    -   [ ] Check changelogs for minor breaking changes or deprecated APIs and update UI components accordingly.
-   [ ] **General Dependencies & DevDependencies**
    -   [ ] Review and update other packages (e.g., `axios`, `date-fns`, `moment`, `react-datepicker`, `react-hook-form`, etc.).
    -   [ ] Update type definitions (`@types/*`).
    -   [ ] Update ESLint, Prettier, and their plugins.
    -   [ ] Consider if `moment` (currently `^2.29.1`) can be fully replaced by `date-fns` (currently `^2.16.1`) to reduce bundle size.
    -   [ ] Update `typescript` (currently `5.0.4`) if necessary and compatible with other upgrades.

## Phase 3: Vite Migration

-   [ ] **Install Vite and Core Plugins**
    -   [ ] Add `vite` and `@vitejs/plugin-react` (or `@vitejs/plugin-react-swc`) to `devDependencies`.
-   [ ] **Remove Create React App**
    -   [ ] Uninstall `react-scripts`.
-   [ ] **Update `package.json` Scripts**
    -   [ ] Modify `start`, `build`, and other relevant scripts to use Vite commands (e.g., `vite` for dev, `vite build` for production).
    -   [ ] Update the `deploy` script for the new build process.
-   [ ] **Handle `index.html`**
    -   [ ] Move `public/index.html` to the project root.
    -   [ ] Update the script tag in `index.html` to point to the main entry file (e.g., `<script type="module" src="/src/index.tsx"></script>`).
-   [ ] **Environment Variables**
    -   [ ] Convert `REACT_APP_` prefixed environment variables to `VITE_`.
    -   [ ] Update code to access them using `import.meta.env.VITE_YOUR_VAR`.
    -   [ ] Ensure `.env` files are handled correctly by Vite.
-   [ ] **Create Vite Configuration (`vite.config.ts` or `vite.config.js`)**
    -   [ ] Set up the React plugin.
    -   [ ] Configure path aliases (if used in `tsconfig.json` or `jsconfig.json`).
    -   [ ] Set up any necessary server proxies (e.g., for API requests).
    -   [ ] Add other Vite plugins as needed (e.g., for SVGR if SVGs are imported as components, linters).
-   [ ] **Update TypeScript & ESLint Configurations**
    -   [ ] Ensure `tsconfig.json` settings are compatible with Vite (e.g., `jsx: 'react-jsx'`, `isolatedModules: true`, `moduleResolution: 'bundler'` or `nodeNext`).
    -   [ ] Update ESLint configuration: remove `eslint-config-react-app` and ensure it works with Vite's structure and build process.

## Phase 4: Testing & Final Cleanup

-   [ ] **Thorough Application Testing (Post-Vite)**
    -   [ ] Test all features, user flows, and edge cases in development and after a production build.
-   [ ] **Build and Deployment Testing (Post-Vite)**
    -   [ ] Ensure production builds are working correctly.
    -   [ ] Test the deployment process and the deployed application.
-   [ ] **Remove `styled-components`**
    -   [ ] (As per user plan) Refactor components to remove `styled-components` and use an alternative styling solution (e.g., Chakra UI, CSS Modules, Tailwind CSS).
