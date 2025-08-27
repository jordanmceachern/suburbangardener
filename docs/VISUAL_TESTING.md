# Visual Regression Testing

This project includes comprehensive visual regression testing to prevent unintended style changes and UI regressions.

## Overview

The visual testing system uses [Playwright](https://playwright.dev/) to capture screenshots of UI components and pages, then compares them against baseline images to detect changes.

## Test Coverage

### Pages Tested

- **Articles Page** (`/articles`)
  - Light and dark mode layouts
  - Featured article component
  - Articles grid layout
  - Search functionality
  - Empty states
  - Sidebar components

- **Article Detail Page** (`/articles/[slug]`)
  - Light and dark mode layouts
  - Article header section
  - Content formatting
  - Author bio section
  - Navigation elements

### Components Tested

- **Navigation**
  - Desktop navigation (light/dark modes)
  - Mobile navigation
  - Focus states with green rings

- **Sidebars**
  - Articles sidebar (search, recent articles)
  - Article detail sidebar
  - Collapse functionality

## Running Tests

### Basic Commands

```bash
# Run all visual regression tests
npm run test:visual

# Update baseline screenshots (use when you intentionally change styles)
npm run test:visual:update

# View test results in browser
npm run test:visual:show
```

### When to Update Baselines

Update baseline screenshots when you **intentionally** make style changes:

```bash
npm run test:visual:update
```

⚠️ **Warning**: Only update baselines for intentional changes. Review all screenshot diffs carefully.

## Test Configuration

### Browsers Tested

- Desktop Chrome
- Desktop Safari (WebKit)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Viewport Sizes

- Desktop: 1200x800px
- Mobile: 375x667px (iPhone), 393x851px (Pixel)

### Color Schemes

- Light mode
- Dark mode

## Understanding Test Results

### ✅ Passing Tests

All screenshots match the baseline within the threshold (0.2% difference allowed).

### ❌ Failing Tests

Screenshots differ from baseline beyond the threshold. This could indicate:

- Unintended style regression
- Layout changes
- Font rendering differences
- Component state changes

### 📸 Screenshot Locations

- Baseline screenshots: `tests/visual/[test-name]-[browser]/`
- Test artifacts: `test-results/`
- HTML report: `playwright-report/`

## Debugging Failed Tests

1. **View the HTML report**:

   ```bash
   npm run test:visual:show
   ```

2. **Compare screenshots**: The report shows before/after/diff images

3. **Check recent changes**: Review what code changes might have caused the difference

4. **Fix or update**:
   - If it's a regression: Fix the CSS/component
   - If it's intentional: Update baselines with `npm run test:visual:update`

## Best Practices

### For Developers

1. **Run tests before committing**:

   ```bash
   npm run test:visual
   ```

2. **Update baselines for intentional changes**:

   ```bash
   npm run test:visual:update
   ```

3. **Review screenshot diffs carefully** - ensure only intended changes are captured

4. **Test in multiple browsers** - the system automatically tests Chrome, Safari, and mobile variants

### For CI/CD

Add visual testing to your CI pipeline:

```yaml
- name: Run Visual Tests
  run: npm run test:visual
```

## Troubleshooting

### Common Issues

1. **Tests fail on different OS**: Font rendering can vary between macOS/Windows/Linux
2. **Flaky tests**: Increase wait times in test files if content loads slowly
3. **Large diffs**: Check if data changed (e.g., dates, dynamic content)

### Configuration

Edit `playwright.config.ts` to:

- Change viewport sizes
- Adjust thresholds
- Add/remove browsers
- Modify timeout settings

### Adding New Tests

1. Create a new `.spec.ts` file in `tests/visual/`
2. Follow the existing pattern
3. Run `npm run test:visual:update` to create initial baselines
4. Commit both the test file and baseline screenshots

## Files Structure

```
tests/
├── visual/
│   ├── articles.spec.ts          # Articles page tests
│   ├── article-detail.spec.ts    # Article detail tests
│   ├── navigation.spec.ts        # Navigation tests
│   └── sidebars.spec.ts          # Sidebar tests
├── setup/                        # Test setup files
scripts/
└── visual-tests.js               # Test runner script
playwright.config.ts              # Playwright configuration
```

## Maintenance

- **Regular updates**: Update baselines when making intentional design changes
- **Review failures**: Investigate any unexpected test failures
- **Monitor performance**: Large screenshot collections can slow down tests
- **Clean artifacts**: Periodically clean old test result files
