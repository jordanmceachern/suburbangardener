# Suburban Gardener

A Next.js React application for your gardening journey.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

## Project Structure

- `src/app/` - App Router directory containing pages and layouts
- `src/app/page.tsx` - Main homepage component
- `src/app/layout.tsx` - Root layout component
- `src/components/` - Reusable React components
- `__tests__/` - Jest snapshot tests for components

## 📸 Snapshot Testing

This project uses Jest snapshot testing to catch unintended changes to component structure and CSS classes.

### **Running Snapshot Tests**

#### **Run All Tests**

```bash
npm test
```

#### **Watch Mode (Re-runs on file changes)**

```bash
npm run test:watch
```

#### **With Coverage Report**

```bash
npm run test:coverage
```

### **Updating Snapshots**

When you make intentional changes to components and need to update the snapshots:

```bash
npm test -- --updateSnapshot
```

Or in watch mode:

```bash
npm run test:watch
```

Then press `u` when prompted to update snapshots.

### **Creating New Snapshot Tests**

#### **1. Create a new test file:**

```bash
touch __tests__/YourComponent.test.tsx
```

#### **2. Basic test template:**

```tsx
import { render } from "@testing-library/react";
import YourComponent from "../src/components/YourComponent";

describe("YourComponent", () => {
  it("should match DOM snapshot", () => {
    const { container } = render(<YourComponent />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes", () => {
    const { container } = render(<YourComponent prop="value" />);
    const element = container.querySelector(".your-selector");
    expect(element).toHaveClass("expected-tailwind-classes");
  });
});
```

### **What the Tests Catch**

✅ **Tailwind class changes** - Detects if classes are added/removed  
✅ **DOM structure changes** - Catches markup modifications  
✅ **Component prop handling** - Ensures props render correctly  
✅ **Conditional rendering** - Validates different component states

### **Quick Workflow**

1. **Make changes** to a component
2. **Run tests**: `npm test`
3. **If intentional changes**: `npm test -- --updateSnapshot`
4. **If unintentional**: Fix the component and re-run

This lightweight system focuses on DOM structure and CSS classes rather than visual screenshots, making it fast and reliable for catching style regressions!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
