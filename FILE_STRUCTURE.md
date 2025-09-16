# Life-Aid-Nexus - Complete File Structure

## Project Overview
यह एक comprehensive wellness और health management application है जो AI-powered features के साथ बनी है।

## Root Directory Structure

```
C:\Users\Nensh Patel\life-aid-nexus\
├── README.md                          # प्रोजेक्ट का main documentation
├── .gitignore                         # Git ignore file
├── package.json                       # Root package.json (monorepo setup के लिए)
├── package-lock.json                  # Root dependencies lockfile
├── components.json                    # shadcn/ui configuration
├── eslint.config.js                  # ESLint configuration
├── postcss.config.js                 # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # Root TypeScript configuration
├── tsconfig.app.json                 # App-specific TypeScript config
├── tsconfig.node.json                # Node-specific TypeScript config
├── vite.config.ts                    # Vite bundler configuration
├── index.html                        # Main HTML entry point
├── bun.lockb                         # Bun package manager lockfile
└── FILE_STRUCTURE.md                 # यह file (complete structure documentation)
```

## Backend Directory Structure

```
backend/
├── package.json                      # Backend dependencies
├── package-lock.json                 # Backend lockfile
├── tsconfig.json                     # Backend TypeScript configuration
└── src/
    └── index.ts                      # Backend entry point
```

## Frontend Directory Structure

```
frontend/
├── README.md                         # Frontend documentation
├── package.json                      # Frontend dependencies
├── package-lock.json                 # Frontend lockfile
├── bun.lockb                         # Bun lockfile
├── components.json                   # shadcn/ui config
├── eslint.config.js                  # Frontend ESLint config
├── postcss.config.js                 # PostCSS config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # Frontend TypeScript config
├── tsconfig.app.json                 # App TypeScript config
├── tsconfig.node.json                # Node TypeScript config
├── vite.config.ts                    # Vite configuration
├── index.html                        # HTML entry point
├── public/                           # Static assets
│   ├── favicon.ico                   # Website icon
│   ├── placeholder.svg               # Placeholder image
│   └── robots.txt                    # SEO robots file
└── src/                              # Main source code
    ├── main.tsx                      # React app entry point
    ├── App.tsx                       # Main App component
    ├── App.css                       # App-specific styles
    ├── index.css                     # Global styles
    ├── vite-env.d.ts                 # Vite environment types
    ├── assets/                       # Static assets
    │   └── wellness-hero.jpg          # Hero section image
    ├── components/                   # Reusable components
    │   ├── ActionableRecommendations.tsx    # Wellness recommendations component
    │   ├── ErrorBoundary.tsx                # Error handling component
    │   ├── InteractiveWellnessDashboard.tsx # Main dashboard component
    │   ├── SafetyGuidelines.tsx             # Safety guidelines display
    │   ├── SymptomsTracker.tsx              # Symptoms tracking component
    │   ├── UserOnboarding.tsx               # User onboarding flow
    │   ├── WellnessAssistant.tsx            # AI Virtual Doctor Assistant
    │   ├── layout/                          # Layout components
    │   │   ├── Layout.tsx                   # Main layout wrapper
    │   │   └── Navigation.tsx               # Navigation component
    │   └── ui/                              # UI components (shadcn/ui)
    │       ├── accordion.tsx                # Accordion component
    │       ├── alert-dialog.tsx             # Alert dialog component
    │       ├── alert.tsx                    # Alert component
    │       ├── aspect-ratio.tsx             # Aspect ratio component
    │       ├── avatar.tsx                   # Avatar component
    │       ├── badge.tsx                    # Badge component
    │       ├── breadcrumb.tsx               # Breadcrumb component
    │       ├── button.tsx                   # Button component
    │       ├── calendar.tsx                 # Calendar component
    │       ├── card.tsx                     # Card component
    │       ├── carousel.tsx                 # Carousel component
    │       ├── chart.tsx                    # Chart component
    │       ├── checkbox.tsx                 # Checkbox component
    │       ├── collapsible.tsx              # Collapsible component
    │       ├── command.tsx                  # Command component
    │       ├── context-menu.tsx             # Context menu component
    │       ├── dialog.tsx                   # Dialog component
    │       ├── drawer.tsx                   # Drawer component
    │       ├── dropdown-menu.tsx            # Dropdown menu component
    │       ├── form.tsx                     # Form component
    │       ├── hover-card.tsx               # Hover card component
    │       ├── input-otp.tsx                # OTP input component
    │       ├── input.tsx                    # Input component
    │       ├── label.tsx                    # Label component
    │       ├── menubar.tsx                  # Menubar component
    │       ├── navigation-menu.tsx          # Navigation menu component
    │       ├── pagination.tsx               # Pagination component
    │       ├── popover.tsx                  # Popover component
    │       ├── progress.tsx                 # Progress component
    │       ├── radio-group.tsx              # Radio group component
    │       ├── resizable.tsx                # Resizable component
    │       ├── scroll-area.tsx              # Scroll area component
    │       ├── select.tsx                   # Select component
    │       ├── separator.tsx                # Separator component
    │       ├── sheet.tsx                    # Sheet component
    │       ├── sidebar.tsx                  # Sidebar component
    │       ├── skeleton.tsx                 # Skeleton loader component
    │       ├── slider.tsx                   # Slider component
    │       ├── sonner.tsx                   # Toast notification component
    │       ├── switch.tsx                   # Switch component
    │       ├── table.tsx                    # Table component
    │       ├── tabs.tsx                     # Tabs component
    │       ├── textarea.tsx                 # Textarea component
    │       ├── theme-provider.tsx           # Theme provider component
    │       ├── toast.tsx                    # Toast component
    │       ├── toaster.tsx                  # Toaster component
    │       ├── toggle-group.tsx             # Toggle group component
    │       ├── toggle.tsx                   # Toggle component
    │       ├── tooltip.tsx                  # Tooltip component
    │       └── use-toast.ts                 # Toast hook
    ├── hooks/                        # Custom React hooks
    │   ├── use-mobile.tsx            # Mobile detection hook
    │   ├── use-toast.ts              # Toast notification hook
    │   └── useUserContext.tsx        # User context hook
    ├── lib/                          # Utility libraries
    │   ├── utils.ts                  # General utility functions
    │   └── wellnessResponseGenerator.ts # Wellness AI response generator
    ├── pages/                        # Page components
    │   ├── Index.tsx                 # Home page
    │   ├── Dashboard.tsx             # User dashboard
    │   ├── Appointments.tsx          # Appointments page
    │   ├── DoctorConsultation.tsx    # Doctor consultation page
    │   ├── HealthScanner.tsx         # Health scanner page
    │   ├── NotFound.tsx              # 404 error page
    │   ├── PeriodTracker.tsx         # Period tracking page
    │   └── WellnessPlanner.tsx       # Wellness planning page
    └── types/                        # TypeScript type definitions
        └── WellnessResponse.ts       # Wellness response types
```

## Node Modules Structure (Major Dependencies)

```
node_modules/
├── @babel/                          # Babel transpiler
├── @eslint/                         # ESLint linting
├── @floating-ui/                    # Floating UI components
├── @hookform/                       # React Hook Form
├── @radix-ui/                       # Radix UI primitives
├── @tanstack/                       # TanStack utilities
├── @tailwindcss/                    # Tailwind CSS
├── react/                           # React library
├── react-dom/                       # React DOM
├── react-router-dom/                # React routing
├── typescript/                      # TypeScript
├── vite/                            # Vite build tool
├── tailwindcss/                     # Tailwind CSS framework
├── lucide-react/                    # Lucide icons
├── clsx/                            # Utility for conditional classes
├── class-variance-authority/        # CVA utility
└── [अन्य dependencies...]
```

## Key Features & Functionality

### 1. **WellnessAssistant.tsx** - Virtual Doctor AI
- Multi-language support (English, Hindi, Gujarati)
- Voice recognition और text-to-speech
- Professional medical guidance
- Emergency detection
- Structured diagnosis system

### 2. **InteractiveWellnessDashboard.tsx** - Main Dashboard
- Health metrics visualization
- Progress tracking
- Interactive charts
- Wellness score display

### 3. **Pages Structure**
- **Index.tsx**: Landing/home page
- **Dashboard.tsx**: User dashboard
- **DoctorConsultation.tsx**: Video consultation
- **HealthScanner.tsx**: Health scanning features
- **PeriodTracker.tsx**: Menstrual cycle tracking
- **WellnessPlanner.tsx**: Wellness goal planning

### 4. **UI Components** (shadcn/ui based)
- Complete UI component library
- Accessible और responsive design
- Dark/light theme support
- Modern design patterns

## Configuration Files

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Key Dependencies
- **React 18**: Frontend framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **React Router**: Navigation
- **Lucide React**: Icons

## Development Workflow

1. **Development Server**: `npm run dev`
2. **Build**: `npm run build`
3. **Linting**: `npm run lint`
4. **Type Checking**: `tsc --noEmit`

## Architecture Pattern

- **Component-based architecture**: Modular React components
- **Type-safe development**: Full TypeScript implementation
- **Responsive design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Performance optimized**: Code splitting और lazy loading

## Recent Enhancements

1. **Virtual Doctor AI**: Professional medical guidance system
2. **Multi-language support**: English, Hindi, Gujarati
3. **Voice integration**: Speech recognition और synthesis
4. **Emergency detection**: Automatic emergency response
5. **Type safety improvements**: Proper TypeScript interfaces

यह structure एक comprehensive wellness application के लिए designed है जो modern web development practices का उपयोग करता है।