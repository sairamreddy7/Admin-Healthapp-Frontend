# Contributing to HealthApp Admin Portal

Thank you for your interest in contributing to the HealthApp Admin Portal! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior

- Be professional and courteous
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

---

## Getting Started

###Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Git
- Code editor (VS Code recommended)

### Setup

1. **Fork the repository**

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Admin-Healthapp-Frontend.git
   cd Admin-Healthapp-Frontend
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/sairamreddy7/Admin-Healthapp-Frontend.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Workflow

### 1. Before You Start

- Check existing issues to avoid duplicating work
- For new features, create an issue first to discuss
- Ensure your branch is up to date with main

### 2. Making Changes

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
# ...

# Test your changes
npm run dev
```

### 3. Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(dashboard): add quick action cards

Added 6 quick action cards to dashboard for easy navigation to common tasks.
Includes hover animations and gradient icons.

Closes #123
```

```
fix(billing): calculate stats from invoice data

Fixed billing statistics to calculate directly from patient invoices
instead of relying on backend stats endpoint.
```

### 4. Push Changes

```bash
git add .
git commit -m "feat(component): description"
git push origin feature/amazing-feature
```

---

## Coding Standards

### JavaScript/React

#### File Structure

```javascript
// Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Component
export default function ComponentName() {
  // State hooks
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Other hooks
  const navigate = useNavigate();
  
  // Effects
  useEffect(() => {
    fetchData();
  }, []);
  
  // Functions
  const fetchData = async () => {
    // ...
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### Naming Conventions

- **Components**: PascalCase (`UserCard`, `Dashboard`)
- **Files**: PascalCase for components (`UserCard.jsx`)
- **Functions**: camelCase (`handleClick`, `fetchData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS classes**: kebab-case (`user-card`, `btn-primary`)

#### Code Style

- Use functional components with hooks
- Use arrow functions for event handlers
- Destructure props and state
- Keep functions small and focused
- Add comments for complex logic
- Use meaningful variable names

**Good:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('/endpoint', data);
    navigate('/success');
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
```

**Bad:**
```javascript
function submit(e) {
  e.preventDefault();
  api.post('/endpoint', data).then(() => {
    navigate('/success');
  }).catch((err) => console.log(err));
}
```

### CSS/Styling

- Use inline styles for component-specific styles
- Use Tailwind CSS utilities when appropriate
- Maintain consistent spacing (use `rem` units)
- Use CSS variables for repeated values
- Implement responsive design

**Example:**
```javascript
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem',
  padding: '2rem'
}}>
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## Pull Request Process

### 1. Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] Development server runs (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if necessary)
- [ ] No console errors or warnings
- [ ] Commits are clean and well-described

### 2. Creating the PR

1. **Title**: Clear, descriptive title
   ```
   Add quick action cards to dashboard
   ```

2. **Description**: Use the template
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [x] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How to Test
   1. Navigate to dashboard
   2. Verify quick action cards appear
   3. Click each card to test navigation

   ## Screenshots (if applicable)
   [Add screenshots]

   ## Checklist
   - [x] My code follows the style guidelines
   - [x] I have tested my changes
   - [x] I have updated the documentation
   ```

### 3. Review Process

- At least one maintainer must approve
- All comments must be resolved
- CI/CD checks must pass
- No merge conflicts with main branch

### 4. After Approval

The maintainer will merge your PR. Your changes will be deployed in the next release.

---

## Testing Guidelines

### Manual Testing

Test your changes in these scenarios:

1. **Desktop browsers**: Chrome, Firefox, Safari, Edge
2. **Mobile browsers**: iOS Safari, Chrome Mobile
3. **Different screen sizes**: Mobile, tablet, desktop
4. **Different users**: Admin with different permissions
5. **Edge cases**: Empty states, error states, loading states

### Test Checklist

- [ ] Component renders correctly
- [ ] All interactive elements work
- [ ] API calls succeed
- [ ] Error handling works
- [ ] Loading states display
- [ ] Empty states display
- [ ] Responsive on mobile
- [ ] No console errors

### Writing Tests (Future)

When we add automated testing:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  it('renders user information', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', () => {
    const handleDelete = jest.fn();
    render(<UserCard user={user} onDelete={handleDelete} />);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalledWith(user.id);
  });
});
```

---

## Documentation

### When to Update Documentation

Update documentation when you:
- Add a new feature
- Change existing functionality
- Add or modify API endpoints
- Update dependencies
- Change deployment process

### Documentation Files

- **README.md**: Project overview, setup, usage
- **docs/API.md**: API reference
- **docs/COMPONENTS.md**: Component documentation
- **CONTRIBUTING.md**: This file

### Writing Good Documentation

- **Be clear and concise**: Use simple language
- **Provide examples**: Show code examples
- **Keep it updated**: Update docs with code changes
- **Use proper formatting**: Markdown, code blocks, lists
- **Add screenshots**: For UI changes

---

## Issue Reporting

### Bug Reports

Include:
- **Description**: Clear description of the bug
- **Steps to reproduce**: Numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, screen size

**Example:**
```markdown
## Bug Description
Dashboard quick actions don't navigate on mobile

## Steps to Reproduce
1. Open app on mobile device
2. Navigate to dashboard
3. Tap "Add Patient" quick action card
4. Nothing happens

## Expected Behavior
Should navigate to /patients page

## Actual Behavior
Card highlights but no navigation occurs

## Environment
- Browser: Safari iOS 15
- Device: iPhone 12
- Screen size: 390x844
```

### Feature Requests

Include:
- **Description**: What feature you want
- **Use case**: Why you need it
- **Proposed solution**: How it could work
- **Alternatives**: Other ways to solve it

---

## Questions?

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bugs and feature requests
- **Email**: dev@healthapp.com

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to HealthApp Admin Portal!** 🎉
