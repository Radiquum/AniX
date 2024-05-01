## 0.7.0 (2024-05-01)

### Feat

- **frontend/release**: add a favorite button to release page
- **frontend**: add user favorites page
- **backend**: add a user favorites route

### Fix

- **frontend/release**: fix voiceover selection overflow in player

### Refactor

- **backend-&-frontend**: change bookmarks api urls to /api/bookmarks/{path} from /api/favorites/{path}

## 0.6.0 (2024-05-01)

### Feat

- **frontend/release**: add ability to change boormarks list on releases page for authorized users

## 0.5.0 (2024-04-30)

### Feat

- **frontend/releases**: add release info and related releases cards

### Fix

- **frontend/releases**: fix null episode name if API returning null in episode.name

## 0.4.0 (2024-04-30)

### Feat

- **frontend**: add a release page

### Refactor

- **frontend/release**: add a loading circle for release player when fetching episodes data
- **frontend/release**: move release player in to the component
- **frontend/release-page**: less layout shift on player

## 0.3.0 (2024-04-30)

### Feat

- **frontend**: add a release page
- **docker**: add docker compose file for development environment

## 0.2.1 (2024-04-29)

### Fix

- **frontend**: fix text overflow on releases cards
- **frontend**: fix overflow of releases cards on pages with overview

## 0.2.0 (2024-04-29)

### Feat

- **next-page-loading**: disable load more button when length of fetched page is less than 25 on all pages

### Refactor

- **history-page**: use ReleaseOverview component on search page

## 0.1.0 (2024-04-29)

### Feat

- Update TODO.md
- update TODO.md
- disable favorites nav button
