# Mini Issue Tracker

A modern, responsive Angular application for managing software development issues with dual view modes (List and Kanban), advanced search, filtering, and real-time updates.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 20+

### Installation & Run

```bash
# Clone and install
git clone <repository-url>
cd mini-issue-traker
npm install

# Start development (both frontend + backend)
npm run dev

# Or start separately:
npm start              # Frontend only
npm run serve:api     # Backend only
```

### Available Scripts

- `npm run dev` - Start both frontend and backend concurrently
- `npm start` - Start Angular development server
- `npm run serve:api` - Start JSON Server backend
- `npm run build` - Build for production
- `npm test` - Run unit tests

## ✨ Features

### Core Functionality

- **Dual View Modes**: Switch between List (paginated) and Kanban (board) views
- **Advanced Search**: Real-time search by issue title with debouncing
- **Status Filtering**: Multi-select filtering by issue status
- **Infinite Scroll**: Seamless pagination in list view
- **Responsive Design**: Mobile-first design with custom breakpoints
- **Real-time Updates**: Immediate UI updates on data changes

### Issue Management

- Create, read, update, and delete issues
- Status tracking (To Do, In Progress, Done)
- Priority levels (Low, Medium, High, Critical)
- Assignee management
- Creation and update timestamps

## 🏗️ Architecture & Design Decisions

### Technology Choices

#### Angular 20 + Signals

- **Why**: Latest Angular with modern signal-based state management
- **Benefits**: Better performance, reduced change detection cycles, cleaner code
- **Trade-off**: Learning curve for developers new to signals

#### Tailwind CSS 4

- **Why**: Utility-first CSS framework with excellent responsive design support
- **Benefits**: Rapid development, consistent design system, built-in responsive utilities
- **Trade-off**: Larger bundle size, HTML can become verbose

#### JSON Server

- **Why**: Simple mock backend for rapid development and testing
- **Benefits**: Zero configuration, realistic API simulation, easy to replace
- **Trade-off**: Not production-ready, limited features

### Component Architecture

#### Modular Design

```
src/app/
├── core/           # Services, models, utilities
├── features/       # Feature-specific components
│   └── issues/    # Issue management feature
└── shared/         # Reusable components
```

**Decision**: Feature-based organization for better maintainability
**Trade-off**: Slightly more complex initial setup, but easier long-term maintenance

#### Smart Component Separation

- **Dashboard**: Orchestrates data and view switching
- **List/Kanban**: Handle specific view logic
- **IssueCard**: Reusable issue display component
- **SearchInput/IssueFiltration**: Specialized input components

**Decision**: Single responsibility principle with clear separation of concerns
**Trade-off**: More components to manage, but better reusability and testing

### State Management Strategy

#### Angular Signals Over RxJS

- **Why**: Built-in Angular solution with better performance
- **Benefits**: Automatic change detection, simpler syntax, better tree-shaking
- **Trade-off**: Less ecosystem support compared to RxJS

#### Local Component State

- **Why**: Keep state close to where it's used
- **Benefits**: Simpler debugging, better encapsulation, easier testing
- **Trade-off**: Potential for prop drilling (mitigated by smart component design)

### Data Loading Strategy

#### Hybrid Approach

- **List View**: Paginated loading with infinite scroll
- **Kanban View**: Load all data with client-side filtering

**Decision**: Optimize for each view's use case
**Trade-off**: Different loading patterns, but better user experience for each view

## 🔧 Configuration & Customization

### Responsive Breakpoints

```scss
@theme {
  --breakpoint-sm: 600px; // Mobile
  --breakpoint-md: 1024px; // Tablet
  --breakpoint-lg: 1024px; // Desktop
}
```

**Decision**: Custom breakpoints for better mobile experience
**Trade-off**: Deviates from Tailwind defaults, but provides better mobile UX

### API Configuration

- **Base URL**: `http://localhost:3000/issues`
- **Delay**: 400ms (simulates real API latency)
- **Pagination**: 12 items per page (configurable)

## 🧪 Testing Strategy

### Unit Testing Approach

- **Framework**: Jasmine + Karma
- **Coverage**: Comprehensive testing of all public methods
- **Mocking**: HTTP service mocking for isolated testing
- **Focus**: Functionality over UI testing

**Decision**: Unit tests for reliability, integration tests for critical paths
**Trade-off**: More test code to maintain, but better bug prevention

## 📱 Responsive Design Decisions

### Mobile-First Approach

- **Why**: Majority of users access from mobile devices
- **Implementation**: Start with mobile layout, enhance for larger screens
- **Trade-off**: More complex CSS, but better mobile experience

### Breakpoint Strategy

- **Mobile (≤600px)**: Single column, stacked layout
- **Tablet (600-1024px)**: Two columns, optimized touch targets
- **Desktop (≥1024px)**: Three columns, hover effects

**Decision**: Content-driven breakpoints rather than device-specific
**Trade-off**: More breakpoints to maintain, but better content flow

## 🚀 Performance Considerations

### Optimization Strategies

1. **Debounced Search**: 300ms delay prevents excessive API calls
2. **Lazy Loading**: Only load visible data in list view
3. **Signal Efficiency**: Minimal re-renders with Angular Signals
4. **Smart Filtering**: Client-side filtering for kanban view
5. **Pagination**: Configurable page sizes for different use cases

### Memory Management

- Proper cleanup of subscriptions
- Efficient issue array updates
- Minimal DOM manipulation
- Signal-based state management

## 🔍 Known Limitations & Trade-offs

### Current Limitations

1. **No Drag & Drop**: Kanban view is read-only for simplicity
2. **No Real-time Updates**: Requires manual refresh for collaborative scenarios
3. **No Offline Support**: Requires active internet connection
4. **No User Authentication**: All users see all issues

### Design Trade-offs Made

1. **Simplicity vs Features**: Chose simplicity for better maintainability
2. **Performance vs UX**: Optimized for common use cases
3. **Mobile vs Desktop**: Prioritized mobile experience
4. **Testing vs Speed**: Comprehensive testing for long-term reliability

## 🛣️ Next Steps & Roadmap

### Short Term (Next 2-4 weeks)

- [ ] **Drag & Drop**: Implement drag & drop for kanban view
- [ ] **Real-time Updates**: Add WebSocket support for live updates
- [ ] **Bulk Operations**: Select multiple issues for batch actions
- [ ] **Export Functionality**: Export issues to CSV/PDF

### Medium Term (Next 2-3 months)

- [ ] **User Authentication**: Add login/logout functionality
- [ ] **Role-based Access**: Different permissions for different users
- [ ] **Advanced Filtering**: Date ranges, assignee filtering, custom fields
- [ ] **Issue Templates**: Predefined templates for common issue types
- [ ] **Attachments**: File upload and management

### Long Term (Next 6-12 months)

- [ ] **Mobile App**: React Native or Flutter mobile application
- [ ] **API Integration**: Connect to real project management tools (Jira, GitHub)
- [ ] **Analytics Dashboard**: Issue metrics and reporting
- [ ] **Workflow Automation**: Custom status flows and automation rules
- [ ] **Multi-language Support**: Internationalization (i18n)

### Technical Improvements

- [ ] **State Management**: Consider NgRx for complex state scenarios
- [ ] **Performance**: Implement virtual scrolling for large datasets
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **PWA**: Progressive Web App capabilities
- [ ] **Testing**: Add E2E tests with Cypress or Playwright

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow Angular style guide and Prettier configuration
2. **Testing**: Write unit tests for all new functionality
3. **Documentation**: Update README and code comments
4. **Responsive Design**: Test on multiple screen sizes
5. **Accessibility**: Ensure keyboard navigation and screen reader support

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Ensure all tests pass
4. Update documentation
5. Submit PR with clear description

## 🐛 Troubleshooting

### Common Issues

#### Zone.js Error

```bash
Error: NG0908: In this configuration Angular requires Zone.js
```

**Solution**: Ensure `zone.js` is installed and imported in test files

#### Build Errors

```bash
npm run build
```

**Solution**: Check TypeScript compilation, ensure all imports are correct

#### Test Failures

```bash
npm test
```

**Solution**: Check test configuration, ensure mocks are properly set up

### Debug Tips

1. Use browser dev tools to inspect signal values
2. Check network tab for API calls
3. Verify router navigation in console
4. Test individual methods in isolation

## 📚 Resources & References

### Documentation

- [Angular Documentation](https://angular.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Angular Signals Guide](https://angular.dev/guide/signals)

### Related Projects

- [Angular Material](https://material.angular.io/) - Alternative UI components
- [NgRx](https://ngrx.io/) - Advanced state management
- [PrimeNG](https://primeng.org/) - Rich UI component library

---

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Tailwind CSS team for the utility-first CSS approach
- JSON Server for the simple mock backend solution
- PrimeIcons for the beautiful icon set
