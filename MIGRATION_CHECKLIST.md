# Migration Checklist - Gujarati Constants

Track your progress migrating files to use centralized Gujarati constants.

## ✅ Completed Files

- [x] **src/constants/gujaratiStrings.ts** - Main constants file created
- [x] **src/constants/index.ts** - Central export created
- [x] **src/utils/uiUtils.ts** - Updated to use constants
- [x] **src/utils/timeAgo.ts** - Updated to use TIME_AGO constants
- [x] **src/utils/shareUtils.ts** - Updated to use SUCCESS/ERROR messages

## 📋 Components to Migrate

### Priority 1: Core Components

- [ ] **src/components/GSTVSatrangBox.tsx**
  - [ ] Import constants
  - [ ] Replace loading message (line 140)
  - [ ] Replace category name (line 164)
  - [ ] Replace button text (line 168)
  - [ ] Test component
  - [ ] Commit changes

- [ ] **src/components/GSTVSatrang.tsx**
  - [ ] Import constants
  - [ ] Replace loading message (line 127)
  - [ ] Replace category name (line 140)
  - [ ] Replace button text (line 146)
  - [ ] Test component
  - [ ] Commit changes

- [ ] **src/components/GSTVShatrangLayout.tsx**
  - [ ] Import constants
  - [ ] Replace category name (line 101)
  - [ ] Replace button text (line 140)
  - [ ] Test component
  - [ ] Commit changes

### Priority 2: Magazine Components

- [ ] **src/components/GSTVMagazine.tsx**
  - [ ] Import constants
  - [ ] Replace loading message (line 157)
  - [ ] Replace category title (line 171)
  - [ ] Replace category span (line 194)
  - [ ] Replace button text (line 199)
  - [ ] Test component
  - [ ] Commit changes

- [ ] **src/components/GstvMagazineBox.tsx**
  - [ ] Import constants
  - [ ] Replace error message (line 146)
  - [ ] Replace retry button (line 153)
  - [ ] Replace category name (line 234)
  - [ ] Test component
  - [ ] Commit changes

### Priority 3: Other Components

- [ ] **src/components/GstvFastTrack.tsx**
  - [ ] Import constants
  - [ ] Replace category names (lines 153, 180, 229)
  - [ ] Replace error message (line 194)
  - [ ] Replace retry button (line 209)
  - [ ] Test component
  - [ ] Commit changes

- [ ] **src/components/Footer.tsx**
  - [ ] Import constants
  - [ ] Replace home text (line 35)
  - [ ] Test component
  - [ ] Commit changes

## 📱 Pages to Migrate

### Priority 1: Video Pages

- [ ] **src/app/videos/page.tsx**
  - [ ] Import constants
  - [ ] Replace bookmark messages (lines 882-883)
  - [ ] Replace navigation titles (lines 1388, 1446, 1493)
  - [ ] Replace loading message (line 1538)
  - [ ] Replace alert message (line 1643)
  - [ ] Replace source label (line 1687)
  - [ ] Test page
  - [ ] Commit changes

- [ ] **src/app/videos/[...slug]/ClientVideoPage.tsx**
  - [ ] Import constants
  - [ ] Replace bookmark messages (lines 987-988)
  - [ ] Replace navigation titles (lines 1466, 1518, 1566)
  - [ ] Replace loading message (line 1615)
  - [ ] Test page
  - [ ] Commit changes

### Priority 2: Web Story Pages

- [ ] **src/app/web-story-detail/[slug]/page.tsx**
  - [ ] Import constants
  - [ ] Replace loading message (line 17)
  - [ ] Test page
  - [ ] Commit changes

- [ ] **src/app/web-stories/[slug]/route.ts**
  - [ ] Import constants
  - [ ] Replace source label (line 461)
  - [ ] Test route
  - [ ] Commit changes

## 🧪 Testing Checklist

After migrating each file:

- [ ] TypeScript compiles without errors
- [ ] Component/page renders correctly
- [ ] All Gujarati text displays properly
- [ ] No console errors
- [ ] Functionality works as expected
- [ ] Visual appearance unchanged

## 🔍 Verification Steps

### Step 1: Search for Remaining Text
```bash
# Run the search script
bash scripts/find-gujarati-text.sh

# Or on Windows
powershell -ExecutionPolicy Bypass -File scripts/find-gujarati-text.ps1
```

### Step 2: Build Test
```bash
npm run build
```

### Step 3: Manual Testing
- [ ] Test loading states
- [ ] Test error messages
- [ ] Test button clicks
- [ ] Test navigation
- [ ] Test all migrated components

## 📊 Progress Tracking

### Overall Progress
- **Total Files**: 21
- **Completed**: 5 (24%)
- **Remaining**: 16 (76%)

### By Category
- **Constants**: 2/2 (100%) ✅
- **Utils**: 3/3 (100%) ✅
- **Components**: 0/7 (0%) ⏳
- **Pages**: 0/4 (0%) ⏳

## 🎯 Milestones

- [x] **Milestone 1**: Create constants file and documentation
- [x] **Milestone 2**: Update utility files
- [ ] **Milestone 3**: Migrate all components (0/7)
- [ ] **Milestone 4**: Migrate all pages (0/4)
- [ ] **Milestone 5**: Verify no hardcoded text remains
- [ ] **Milestone 6**: Final testing and deployment

## 📝 Notes

### Common Issues
- Remember to add imports at the top of each file
- Use curly braces for JSX expressions: `{CONSTANT.VALUE}`
- Test after each file migration
- Commit changes incrementally

### Tips
- Use Find & Replace for common patterns
- Reference QUICK_REFERENCE.md for constant names
- Check USAGE_EXAMPLES.md for syntax
- Follow patterns in already-updated files

## 🚀 Quick Commands

### Find Gujarati Text
```bash
# Bash
bash scripts/find-gujarati-text.sh

# PowerShell
powershell -ExecutionPolicy Bypass -File scripts/find-gujarati-text.ps1
```

### Build and Test
```bash
npm run build
npm run dev
```

### Search for Specific Text
```bash
# Find specific Gujarati text
grep -r "વધુ વાંચો" src/

# Find constant usage
grep -r "BUTTON_TEXT.READ_MORE" src/
```

## ✨ Success Criteria

Migration is complete when:
- [ ] All checkboxes above are checked
- [ ] No hardcoded Gujarati text in codebase (except constants file)
- [ ] All tests pass
- [ ] Build succeeds without errors
- [ ] Manual testing confirms everything works
- [ ] Documentation is updated

## 📅 Timeline

- **Day 1**: ✅ Setup and documentation (Complete)
- **Day 2**: ⏳ Migrate components (In Progress)
- **Day 3**: ⏳ Migrate pages
- **Day 4**: ⏳ Testing and verification
- **Day 5**: ⏳ Final review and deployment

---

**Last Updated**: February 2026
**Status**: In Progress (24% Complete)
**Next Task**: Start migrating components
