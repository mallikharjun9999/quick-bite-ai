# QuickBite AI

QuickBite AI is an AI-powered recipe suggestion app that helps users turn their available ingredients into delicious meals. Leveraging Genkit and Google AI, the app provides creative, step-by-step recipes tailored to user preferences, dietary needs, and available ingredients.

## Features

- **Smart Recipe Suggestion:** Get up to 3 creative recipes based on your ingredients, meal type, dietary preference, allergies, and cooking time.
- **Recipe Display:** View recipes with clear instructions, ingredients, cooking time, and nutritional information.
- **User Authentication:** Sign up, log in, and manage your account securely.
- **Admin Dashboard:** Admins can view user signups and recipe search analytics.
- **Responsive UI:** Modern, mobile-friendly design using Tailwind CSS and shadcn/ui components.
- **Save Search History:** User recipe searches are saved to Firestore for analytics and future features.

## Tech Stack

- **Frontend:** Next.js (App Router, React 18), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Genkit, Google AI (Gemini), Firebase Firestore
- **Authentication:** Firebase Auth
- **State Management:** React Context (custom hooks)
- **Other:** Radix UI, Lucide Icons

## Project Structure

```
.
├── .modified
├── apphosting.yaml
├── components.json
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── .idx/
│   ├── dev.nix
│   └── icon.png
├── .vscode/
│   └── settings.json
├── docs/
│   └── blueprint.md
├── src/
│   ├── ai/
│   │   ├── dev.ts
│   │   ├── genkit.ts
│   │   └── flows/
│   │       └── suggest-recipes.ts
│   ├── app/
│   │   ├── actions.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── components/
│   │   ├── recipe-card.tsx
│   │   ├── recipe-form.tsx
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── textarea.tsx
│   │       ├── toaster.tsx
│   │       └── tooltip.tsx
│   ├── config/
│   │   └── landing-page.ts
│   ├── hooks/
│   │   ├── use-auth.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── lib/
│       ├── firebase.ts
│       └── utils.ts
```

### Key Files and Directories

- **src/ai/**: Genkit AI integration and recipe suggestion flows.
- **src/app/**: Next.js app directory (routing, layouts, pages, server actions).
- **src/components/**: UI components, including recipe cards, forms, and shadcn/ui primitives.
- **src/config/**: App configuration (e.g., landing page carousel images).
- **src/hooks/**: Custom React hooks (authentication, mobile detection, toast).
- **src/lib/**: Utility functions and Firebase initialization.
- **docs/**: Project blueprint and design guidelines.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/mallikharjun9999/quick-bite-ai.git
   cd quick-bite-ai
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Firebase:**
   - Set up a Firebase project.
   - Add your Firebase config to `src/lib/firebase.ts`.
   - Enable Firestore and Authentication (Email/Password).

4. **Configure Genkit:**
   - Set up Genkit and Google AI credentials as per [Genkit documentation](https://github.com/genkit-dev/genkit).
   - Update `.env` as needed.

### Running the App

- **Development:**
  ```sh
  npm run dev
  ```
  The app will be available at [http://localhost:9002](http://localhost:9002).

- **Genkit AI Dev Server:**
  ```sh
  npm run genkit:dev
  ```

- **Build for Production:**
  ```sh
  npm run build
  npm start
  ```

### Scripts

- `dev` - Start Next.js in development mode
- `build` - Build for production
- `start` - Start production server
- `genkit:dev` - Start Genkit AI dev server
- `genkit:watch` - Start Genkit AI dev server in watch mode
- `lint` - Run ESLint
- `typecheck` - Run TypeScript type checks

## Customization

- **UI Theme:** Edit `tailwind.config.ts` and `src/app/globals.css`.
- **Landing Page Images:** Update `src/config/landing-page.ts`.
- **Recipe Suggestion Logic:** Modify `src/ai/flows/suggest-recipes.ts`.

## Contributing

Contributions are welcome! Please open issues or pull requests.



---

**Made with ❤️ using Next.js, Genkit, and Google AI.**
Built By Penugonda Mallikharjunarao