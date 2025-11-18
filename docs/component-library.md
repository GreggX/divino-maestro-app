# Component Library Guide

Complete reference for the UI components and design system used in the Divino Maestro App.

## Table of Contents

- [Overview](#overview)
- [Design Principles](#design-principles)
- [UI Components](#ui-components)
  - [Button](#button)
  - [Input](#input)
  - [Card](#card)
  - [Container](#container)
- [Common Components](#common-components)
  - [LanguageSwitcher](#languageswitcher)
  - [Logo](#logo)
- [Layout Components](#layout-components)
- [Utility Functions](#utility-functions)
- [Styling Guidelines](#styling-guidelines)
- [Accessibility](#accessibility)
- [Creating New Components](#creating-new-components)
- [Testing Components](#testing-components)

## Overview

The component library is built on:

- **React 19**: Latest React features including Server Components
- **TypeScript**: Type-safe component props
- **Tailwind CSS 3.4**: Utility-first styling
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first design

### Component Categories

```
components/
├── ui/           # Primitive UI components (Button, Input, Card, etc.)
├── common/       # Shared business components (Logo, LanguageSwitcher)
├── layouts/      # Layout components (AuthLayout, DashboardLayout)
└── forms/        # Form components (LoginForm, RegisterForm)
```

## Design Principles

### 1. Composition over Configuration

Components are designed to be composable:

```typescript
// Good - Composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid - Too many props
<Card title="Title" content="Content" showHeader={true} />
```

### 2. Type Safety

All components use TypeScript with proper prop types:

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
```

### 3. Accessibility First

- Semantic HTML elements
- ARIA attributes when needed
- Keyboard navigation support
- Screen reader friendly

### 4. Consistent Styling

- Tailwind utility classes
- Shared color palette
- Consistent spacing and sizing
- Dark mode ready (future)

## UI Components

### Button

Interactive button component with multiple variants and states.

**Location**: `components/ui/Button.tsx`

#### Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}
```

#### Variants

- **primary**: Blue background (default action)
- **secondary**: Gray background (secondary action)
- **outline**: Transparent with border (tertiary action)
- **danger**: Red background (destructive action)

#### Sizes

- **sm**: Small button (px-3 py-1.5)
- **md**: Medium button (px-4 py-2, default)
- **lg**: Large button (px-6 py-3)

#### Usage Examples

```typescript
import { Button } from '@/components/ui/Button';

// Primary button
<Button onClick={handleClick}>Save Changes</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Outline button
<Button variant="outline">Learn More</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Small button
<Button size="sm">Small Button</Button>

// Loading state
<Button isLoading>Saving...</Button>

// Full width
<Button fullWidth>Submit</Button>

// Disabled
<Button disabled>Disabled</Button>

// With custom classes
<Button className="mt-4">Custom Margin</Button>
```

#### Accessibility

- Uses semantic `<button>` element
- Focus ring on keyboard navigation
- Disabled state prevents interaction
- Loading spinner with accessible text

### Input

Form input component with label, error, and helper text support.

**Location**: `components/ui/Input.tsx`

#### Props

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

#### Features

- Auto-generated IDs from label
- Error state styling
- Helper text below input
- Fully accessible with ARIA attributes
- ForwardRef support for form libraries

#### Usage Examples

```typescript
import { Input } from '@/components/ui/Input';

// Basic input
<Input placeholder="Enter email" />

// With label
<Input label="Email Address" type="email" />

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// With helper text
<Input
  label="Username"
  helperText="Choose a unique username"
/>

// Disabled
<Input label="Email" disabled value="readonly@example.com" />

// With ref (for forms)
const emailRef = useRef<HTMLInputElement>(null);
<Input ref={emailRef} label="Email" />
```

#### Form Integration

Works seamlessly with form libraries:

```typescript
// React Hook Form
import { useForm } from 'react-hook-form';

const { register, formState: { errors } } = useForm();

<Input
  label="Email"
  {...register('email')}
  error={errors.email?.message}
/>
```

#### Accessibility

- Label automatically linked with `htmlFor`
- Error messages use `role="alert"`
- `aria-invalid` when error present
- `aria-describedby` for helper text and errors

### Card

Container component for grouping related content with optional header and footer.

**Location**: `components/ui/Card.tsx`

#### Components

- **Card**: Main container
- **CardHeader**: Header section with border
- **CardTitle**: Title heading
- **CardDescription**: Subtitle text
- **CardContent**: Main content area
- **CardFooter**: Footer section with border

#### Props

```typescript
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
```

All card subcomponents extend `HTMLAttributes<HTMLDivElement>` or appropriate element.

#### Usage Examples

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/Card';

// Simple card
<Card>
  <CardContent>
    <p>Simple content</p>
  </CardContent>
</Card>

// Card with header
<Card>
  <CardHeader>
    <CardTitle>Profile Settings</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Settings content here</p>
  </CardContent>
</Card>

// Card with footer
<Card>
  <CardHeader>
    <CardTitle>Confirm Action</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Are you sure you want to proceed?</p>
  </CardContent>
  <CardFooter>
    <Button>Confirm</Button>
    <Button variant="outline">Cancel</Button>
  </CardFooter>
</Card>

// Custom styling
<Card className="border-blue-500">
  <CardContent>
    <p>Custom border color</p>
  </CardContent>
</Card>
```

#### Layout Patterns

**Grid of Cards**:
```typescript
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

**Stacked Cards**:
```typescript
<div className="space-y-4">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Container

Responsive container with max-width constraints and padding.

**Location**: `components/ui/Container.tsx`

#### Props

```typescript
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
```

#### Sizes

- **sm**: 896px max-width (max-w-2xl)
- **md**: 1024px max-width (max-w-4xl)
- **lg**: 1152px max-width (max-w-6xl, default)
- **xl**: 1280px max-width (max-w-7xl)
- **full**: No max-width (max-w-full)

#### Features

- Responsive padding (px-4 sm:px-6 lg:px-8)
- Centered with `mx-auto`
- Full width with constraints

#### Usage Examples

```typescript
import { Container } from '@/components/ui/Container';

// Default container (lg)
<Container>
  <h1>Page Content</h1>
</Container>

// Small container
<Container size="sm">
  <article>Blog post content</article>
</Container>

// Extra large container
<Container size="xl">
  <div>Wide content</div>
</Container>

// Full width (no max-width)
<Container size="full">
  <div>Edge-to-edge content</div>
</Container>

// Custom classes
<Container className="py-8">
  <div>Content with vertical padding</div>
</Container>
```

#### Layout Examples

```typescript
// Page layout
export default function Page() {
  return (
    <Container>
      <h1 className="mb-8 text-3xl font-bold">Page Title</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>...</Card>
        <Card>...</Card>
      </div>
    </Container>
  );
}

// Nested containers
<Container size="xl">
  <Container size="md">
    <article>Centered article with max-width</article>
  </Container>
</Container>
```

## Common Components

### LanguageSwitcher

Dropdown selector for changing application language.

**Location**: `components/common/LanguageSwitcher.tsx`

#### Features

- Displays available locales with flags
- Cookie-based locale persistence
- Server action for locale change
- Loading state during transition

#### Usage

```typescript
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

// In header or navbar
<nav>
  <LanguageSwitcher />
</nav>
```

#### How It Works

1. Reads current locale from `next-intl`
2. Displays dropdown with all available locales
3. On change, calls `changeLocale` server action
4. Sets `NEXT_LOCALE` cookie
5. Refreshes page to apply new locale

#### Customization

To modify available languages, update `i18n/config.ts`:

```typescript
export const locales = ['en', 'es', 'fr'] as const;

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
};
```

### Logo

Application logo component with size variants.

**Location**: `components/common/Logo.tsx`

#### Props

```typescript
interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}
```

#### Sizes

- **sm**: text-xl
- **md**: text-2xl (default)
- **lg**: text-3xl

#### Usage

```typescript
import { Logo } from '@/components/common/Logo';

// Default size
<Logo />

// Large logo
<Logo size="lg" />

// With link
<Link href="/">
  <Logo />
</Link>

// Custom styling
<Logo className="text-red-600" />
```

#### Customization

The logo text is pulled from translations (`common.appName`). To change:

```json
// messages/en.json
{
  "common": {
    "appName": "Your App Name"
  }
}
```

## Layout Components

### AuthLayout

Layout wrapper for authentication pages (login, register).

**Location**: `components/layouts/AuthLayout.tsx`

**Features**:
- Centered card layout
- Logo at top
- Language switcher
- Responsive design

### DashboardLayout

Layout wrapper for authenticated dashboard pages.

**Location**: `components/layouts/DashboardLayout.tsx`

**Features**:
- Header with navigation
- User menu
- Logout functionality
- Main content area

## Utility Functions

### cn (Class Name Merger)

Utility for conditionally merging CSS class names.

**Location**: `lib/utils/cn.ts`

#### Usage

```typescript
import { cn } from '@/lib/utils/cn';

// Merge classes
cn('base-class', 'additional-class');
// Result: 'base-class additional-class'

// Conditional classes
cn('base', isActive && 'active', isDisabled && 'disabled');
// Result: 'base active' (if isActive true, isDisabled false)

// Filter falsy values
cn('base', undefined, null, false, 'valid');
// Result: 'base valid'

// In components
<div className={cn('default-styles', className)} />
```

#### Why Use cn()?

- Filters out `undefined`, `null`, `false` values
- Cleaner than template strings for conditional classes
- Type-safe with TypeScript
- Consistent pattern across codebase

## Styling Guidelines

### Tailwind CSS

All components use Tailwind utility classes.

#### Color Palette

**Primary (Blue)**:
- `bg-blue-600` - Primary buttons, links
- `bg-blue-700` - Hover states
- `text-blue-600` - Logo, accents

**Gray Scale**:
- `bg-gray-50` - Light backgrounds
- `bg-gray-100` - Disabled states
- `bg-gray-200` - Secondary buttons
- `border-gray-300` - Borders
- `text-gray-500` - Helper text
- `text-gray-700` - Labels
- `text-gray-900` - Body text

**Semantic Colors**:
- `bg-red-600` - Danger/errors
- `bg-green-600` - Success
- `bg-yellow-600` - Warning

#### Spacing Scale

Use consistent spacing:
- `gap-2` (8px) - Tight spacing
- `gap-4` (16px) - Default spacing
- `gap-6` (24px) - Loose spacing
- `gap-8` (32px) - Section spacing

#### Typography

**Headings**:
```typescript
<h1 className="text-3xl font-bold">Main Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<h3 className="text-xl font-semibold">Subsection</h3>
```

**Body Text**:
```typescript
<p className="text-base text-gray-900">Regular text</p>
<p className="text-sm text-gray-500">Small text</p>
```

### Responsive Design

Use mobile-first breakpoints:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Stacked on mobile, 2 cols on tablet, 3 cols on desktop */}
</div>

<div className="px-4 sm:px-6 lg:px-8">
  {/* Responsive padding */}
</div>
```

**Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Accessibility

### WCAG 2.1 AA Compliance

All components follow accessibility best practices:

#### Semantic HTML

```typescript
// Good - Semantic
<button>Click me</button>
<nav>...</nav>
<main>...</main>

// Avoid - Non-semantic
<div onClick={handleClick}>Click me</div>
```

#### ARIA Attributes

```typescript
// Button states
<button aria-pressed={isPressed}>Toggle</button>

// Input errors
<input
  aria-invalid={hasError}
  aria-describedby="error-id"
/>
<p id="error-id" role="alert">{error}</p>

// Loading states
<button aria-busy={isLoading}>Submit</button>
```

#### Keyboard Navigation

All interactive elements support keyboard:
- Tab navigation
- Enter/Space to activate
- Escape to dismiss modals
- Arrow keys for lists

#### Focus Management

```typescript
// Visible focus rings
className="focus:outline-none focus:ring-2 focus:ring-blue-500"

// Skip to content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

#### Color Contrast

- Body text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

#### Screen Readers

```typescript
// Descriptive labels
<button aria-label="Close dialog">×</button>

// Hidden text for context
<span className="sr-only">Loading</span>

// Alternative text
<img src="..." alt="Descriptive text" />
```

## Creating New Components

### Step 1: Create Component File

```bash
touch components/ui/MyComponent.tsx
```

### Step 2: Define Component

```typescript
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'special';
}

export function MyComponent({
  children,
  variant = 'default',
  className,
  ...props
}: MyComponentProps) {
  return (
    <div
      className={cn(
        'base-styles',
        variant === 'special' && 'special-styles',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Step 3: Write Tests

```typescript
// __tests__/components/ui/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/ui/MyComponent';

describe('MyComponent', () => {
  it('renders children', () => {
    render(<MyComponent>Test</MyComponent>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(
      <MyComponent variant="special">Test</MyComponent>
    );
    expect(container.firstChild).toHaveClass('special-styles');
  });
});
```

### Step 4: Document Component

Add usage examples to this guide or create dedicated docs.

### Component Checklist

- ✅ TypeScript types defined
- ✅ Extends native HTML props
- ✅ Uses `cn()` for class merging
- ✅ Accepts `className` prop
- ✅ Spreads `...props`
- ✅ Accessible (ARIA, semantic HTML)
- ✅ Responsive design
- ✅ Unit tests written
- ✅ Documented with examples

## Testing Components

### Unit Testing

Use React Testing Library for component tests.

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

### Visual Testing

Test component appearance:

```typescript
it('applies correct variant styles', () => {
  const { container } = render(
    <Button variant="danger">Delete</Button>
  );

  const button = container.querySelector('button');
  expect(button).toHaveClass('bg-red-600');
});
```

### Accessibility Testing

```typescript
it('is keyboard accessible', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();

  render(<Button onClick={handleClick}>Click</Button>);

  // Tab to button
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();

  // Activate with Enter
  await user.keyboard('{Enter}');
  expect(handleClick).toHaveBeenCalled();
});

it('has accessible name', () => {
  render(<Input label="Email" />);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
});
```

## Best Practices

### 1. Prop Spreading

Always spread props for flexibility:

```typescript
export function MyComponent({ className, ...props }: Props) {
  return <div className={cn('base', className)} {...props} />;
}
```

### 2. ForwardRef for Inputs

Use `forwardRef` for form elements:

```typescript
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} />;
  }
);
```

### 3. Composition

Build complex components from simple ones:

```typescript
export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <Container size="sm">
      <Card>
        <CardHeader>
          <Logo />
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Container>
  );
}
```

### 4. Consistent Naming

- Component files: PascalCase (`Button.tsx`)
- Props interfaces: `ComponentNameProps`
- Event handlers: `handle*` prefix
- Boolean props: `is*` or `has*` prefix

### 5. Default Props

Use default parameters:

```typescript
function Button({
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  // ...
}
```

### 6. Avoid Prop Drilling

Use composition to avoid deep prop passing:

```typescript
// Instead of prop drilling
<Parent foo={foo}>
  <Child foo={foo}>
    <GrandChild foo={foo} />
  </Child>
</Parent>

// Use children composition
<Parent>
  <Child>
    <GrandChild foo={foo} />
  </Child>
</Parent>
```

## Common Patterns

### Loading States

```typescript
function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button isLoading={isLoading} onClick={handleSubmit}>
      Submit
    </Button>
  );
}
```

### Error States

```typescript
function EmailInput() {
  const [error, setError] = useState('');

  return (
    <Input
      label="Email"
      type="email"
      error={error}
      onChange={(e) => validate(e.target.value)}
    />
  );
}
```

### Responsive Layouts

```typescript
function Grid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
```

### Conditional Rendering

```typescript
function Card({ showHeader, title, children }: Props) {
  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

## Performance Optimization

### Memoization

```typescript
import { memo } from 'react';

export const ExpensiveComponent = memo(function ExpensiveComponent(props) {
  // Heavy computation
  return <div>{/* ... */}</div>;
});
```

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Avoid Inline Functions

```typescript
// Good - Memoized handler
const handleClick = useCallback(() => {
  // ...
}, [deps]);

<Button onClick={handleClick}>Click</Button>

// Avoid - New function on every render
<Button onClick={() => handleClick()}>Click</Button>
```

## Additional Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Support

For component-related questions:
1. Check this documentation
2. Review existing component implementations
3. Check unit tests for usage examples
4. Consult Tailwind CSS docs for styling
5. Test accessibility with screen readers

---

**Last Updated**: 2025
**Maintained By**: Divino Maestro Development Team
