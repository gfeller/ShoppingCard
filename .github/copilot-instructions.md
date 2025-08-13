# ShoppingCard Angular Application

ShoppingCard is an Angular 18 Progressive Web App (PWA) for managing shopping lists with Firebase backend integration. The application features real-time data synchronization, user authentication, and offline support through service workers.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Initial Setup
- Verify Node.js 20+ is available: `node --version` (required for Firebase functions)
- Install main dependencies: `npm install --ignore-scripts` -- takes 5 minutes. **NEVER CANCEL.** Set timeout to 8+ minutes.
  - **NOTE**: Use `--ignore-scripts` flag to bypass Cypress binary download which fails due to network restrictions
- Install Firebase functions dependencies: `cd functions && npm install` -- takes 3 seconds. Set timeout to 30+ seconds.

### Building the Application
- Development build: `npm run build -- --configuration=development` -- takes 10 seconds. Set timeout to 30+ seconds.
- Development build (no optimization): `npm run build -- --optimization=false` -- takes 10 seconds. Set timeout to 30+ seconds.
- **CRITICAL**: Production build with default settings fails due to Google Fonts network restrictions. Use development configuration or `--optimization=false` instead.
- Build Firebase functions: `cd functions && npm run build` -- takes 2 seconds. Set timeout to 30+ seconds.

### Running the Application
- **ALWAYS run the setup steps first before starting the dev server**
- Start development server: `npm start` -- takes 10 seconds to start. **NEVER CANCEL.** Set timeout to 2+ minutes.
  - Server runs on `http://localhost:4200`
  - Watch mode is enabled automatically
  - Hot reload works for code changes

### Testing
- **No Angular unit tests exist** - the repository has no `.spec.ts` files despite having test configuration
- Playwright e2e tests are available but require browser installation which fails due to network restrictions
- Test command `npm test` will fail with "No inputs were found" error
- Firebase functions linting: `cd functions && npm run lint` -- takes 2 seconds. Set timeout to 30+ seconds.

### Firebase Integration
- Firebase CLI installation fails due to network restrictions
- Emulator configuration exists in `firebase.json` but cannot be tested without CLI
- Functions deployment requires Firebase CLI and authentication

## Network Restrictions & Workarounds

**CRITICAL**: This environment has network restrictions that affect several components:
- **Cypress binary download fails** - use `npm install --ignore-scripts` to bypass
- **Playwright browser installation fails** - e2e tests cannot run without manual browser setup
- **Google Fonts inlining fails** - use `--optimization=false` for builds
- **Firebase CLI installation times out** - Firebase features limited to local development

## Validation

**MANUAL TESTING REQUIREMENTS**: After making changes, always:
1. **Build the application**: `npm run build -- --optimization=false` 
2. **Start the dev server**: `npm start`
3. **Access the app**: Verify `curl http://localhost:4200/` returns HTML with "ShoppingCard" title
4. **Test core functionality**: The app should load with Angular Material components and shopping list interface
5. **Visual verification**: Application displays German UI with "Keine Liste ausgewählt" message and add button for creating new shopping lists

**END-TO-END TESTING SCENARIOS**:
- Access the application at `http://localhost:4200`
- Verify the login interface loads (look for user-settings button with data-test-id)
- Test user registration flow with test email `test_1@test.ch` and password `12345678`
- Verify shopping list creation and item management functionality
- Test offline functionality if service worker is active

## Key Projects and Structure

### Main Application (`/src/app/`)
- **Core services** (`/src/app/core/`): Authentication, UI management, state management
- **Shopping list module** (`/src/app/shoppinglist/`): Main feature with components, services, and state
- **Shared components** (`/src/app/shared/`): Reusable UI components
- **App component** (`app.component.ts`): Root component with header and routing

### Firebase Functions (`/functions/`)
- TypeScript-based cloud functions
- Build with `npm run build` 
- Lint with `npm run lint` (shows warnings for floating promises)
- Requires Node.js 20 runtime

### Testing Infrastructure
- **Playwright tests** (`/tests/`): E2e tests with page object model
- **Cypress tests** (`/cypress/`): Alternative e2e testing (not functional due to network restrictions)
- **No unit tests**: Repository lacks Angular spec files

## Common Commands Reference

### Repository Root Structure
```
ls -la
.editorconfig           .gitignore              README.md               cypress.config.ts       ngsw-config.json        service-worker-demo/
.firebase/              .vscode/                angular.json            firestore-debug.log     package-lock.json       src/
.firebaserc             .git/                   cypress/                firestore.indexes.json  package.json            tests/
```

### package.json Scripts
```json
{
  "start": "ng serve",
  "build": "ng build", 
  "test": "ng test",
  "cypress:run": "cypress run",
  "playright:debug": "npx playwright test --project=chromium --debug",
  "deploy:hosting": "firebase deploy --only hosting",
  "emulator": "firebase emulators:start --inspect-functions"
}
```

### Firebase Configuration
```json
{
  "hosting": {
    "public": "dist/shopping-card/browser",
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  },
  "emulators": {
    "auth": {"port": 9099},
    "functions": {"port": 5001}, 
    "firestore": {"port": 8080},
    "hosting": {"port": 5000}
  }
}
```

## Important Development Notes

- **Always use development build configuration** to avoid Google Fonts network issues
- **Set appropriate timeouts** for all commands (minimum 30 seconds for builds, 2+ minutes for dev server startup)
- **Validate changes by running the dev server** and accessing the application
- **Check functions separately** with `cd functions && npm run build && npm run lint`
- **Material Design components** are heavily used - familiarize with Angular Material patterns
- **State management** uses @ngrx/signals for reactive state handling
- **PWA features** include service worker and manifest for offline support

## Troubleshooting

- **Build fails with font inlining error**: Use `npm run build -- --optimization=false`
- **npm install fails with Cypress error**: Use `npm install --ignore-scripts`
- **Tests fail with "No inputs found"**: No unit tests exist in repository
- **Playwright tests fail**: Browser binaries not available due to network restrictions
- **Dev server won't start**: Check if port 4200 is available, ensure dependencies are installed
- **Firebase features not working**: CLI installation blocked, use local development only

## Time Expectations

- **Dependency installation**: 5 minutes (main), 3 seconds (functions)
- **Build time**: 10 seconds (development config)
- **Dev server startup**: 10 seconds  
- **Function build**: 2 seconds
- **Function lint**: 2 seconds

**NEVER CANCEL any build or install operation. Wait for completion.**