# Implementation Plan: Product Page Search Bar

## Project Context
- **Technology Stack**: React + Vite, Tailwind CSS v4, lucide-react, axios
- **Build Command**: `npm run build`
- **Dev Command**: `npm run dev`
- **Verification**: Build must complete with no errors; test search functionality in browser
- **Color Scheme**: Dark background (#0A0A0A), beige text (#F5F5DC), orange accents (#FF8F00)

## Existing Pattern Reference
The header.jsx already implements a successful search pattern:
- 300ms debounce using `useCallback` and `clearTimeout`
- Debounced state (`debouncedQuery`) separate from input state (`searchQuery`)
- Search against multiple fields: name, category, series, model, manufacturer, casting, sku, productID
- Case-insensitive normalization with `.trim().toLowerCase()`
- Clear/X button that resets search and dismissal state
- Smooth transitions and hover effects with Tailwind

## Design Decisions

### 1. Search Bar Placement
**Decision**: Render search bar above the toolbar and filters, within the main product section.
**Rationale**: Mirrors common e-commerce patterns; keeps search visible without cluttering the filters sidebar; positioned above existing sort/view controls for logical flow.

### 2. State Management
**Decision**: Add two state variables at component level:
- `searchQuery`: Raw input value for immediate UI feedback
- `debouncedSearchQuery`: Debounced value (300ms) for actual filtering
**Rationale**: Matches header.jsx pattern; prevents excessive re-renders while providing real-time visual feedback; 300ms debounce balances responsiveness and performance.

### 3. Debounce Implementation
**Decision**: Use `useCallback` + `clearTimeout` with a ref, matching header.jsx.
**Rationale**: Proven pattern in the codebase; efficient cleanup on component unmount; no external dependencies needed.

### 4. Search Matching Logic
**Decision**: Search against these product fields (all case-insensitive):
- name, series, category, model, manufacturer, casting, sku, productID
**Rationale**: Matches exact fields already in header search; provides comprehensive coverage; ensures users can find products by multiple attributes.

### 5. Combination with Existing Filters
**Decision**: Apply search AFTER existing filters are applied (filter first, then search).
**Rationale**: Both filter and search constraints apply simultaneously; if filters return 100 products and search matches 10, user sees 10; more intuitive than opposite order.

### 6. UI/UX Components
**Decision**: 
- Search icon (lucide-react `Search`) on the left
- Input field with placeholder and dark theme styling
- Clear/X button (lucide-react `X`) on the right when search has text
- Result count: "Found X products" displayed above grid
- Search context text: "Search results for: [query]" above products
- No results message: "No products match your search [filters]"
**Rationale**: Matches Metal Garage design language; lucide-react already installed; clear visual hierarchy; feedback helps user understand results.

### 7. Styling Approach
**Decision**: Pure Tailwind CSS, no CSS files.
**Rationale**: Matches project workflow; colors align with Metal Garage theme; all classes use project's established color values.

---

## Implementation Steps

### Step 1: Add search state and debounce effect
**What**: Add `searchQuery` and `debouncedSearchQuery` state variables to ProductPage component. Add useEffect hook to debounce search input with 300ms delay using ref-based clearTimeout pattern. Add cleanup on unmount.

**Files to modify**:
- `src/pages/productPage.jsx`

**Code location**: After line 22 (after existing state declarations like `selectedAvailability`, before the "SCROLL TO TOP" comment).

**Verification**: 
- Build: `npm run build` completes with no errors
- No console errors related to state initialization

---

### Step 2: Update filteredProducts useMemo to include search filtering
**What**: Extend the existing `filteredProducts` useMemo to add search filtering after all existing filters are applied. Match against name, series, category, model, manufacturer, casting, sku, productID using case-insensitive matching. If `debouncedSearchQuery` is empty, include all filtered results.

**Files to modify**:
- `src/pages/productPage.jsx`

**Code location**: Within the `filteredProducts` useMemo function (around line 430–680), add search filtering logic as the final filter step before return.

**Dependencies in useMemo**: Add `debouncedSearchQuery` to the dependency array.

**Verification**:
- Search for "skyline" — only products with that term appear
- Search for "ferrari" — only products with that term appear
- Clear search — all filtered products reappear
- Combine search + filters: set category filter, then search within that category

---

### Step 3: Create Search Bar JSX component
**What**: Build the search bar UI as a new section within the main column of the product grid (above the existing toolbar). Include:
- Container with dark background, subtle border, rounded corners
- Left side: Search icon from lucide-react
- Center: Input field with placeholder, dark theme, orange focus state
- Right side: Clear/X button (visible only when search has text)
- Result summary text below showing "Found X products" when searching

**Files to modify**:
- `src/pages/productPage.jsx`

**Code location**: Inside the `<div className="min-w-0">` (main column), immediately before the existing toolbar `<div className="mb-[26px] flex flex-wrap...">`.

**Styling**: Use Tailwind classes:
- Container: `w-full border border-[#F5F5DC]/15 rounded-lg bg-[#0A0A0A] px-4 py-3 mb-6 flex items-center gap-3`
- Icon: `h-5 w-5 text-[#FF8F00] shrink-0`
- Input: `flex-1 bg-transparent text-[#F5F5DC] outline-none placeholder:text-[#F5F5DC]/35 text-sm`
- Clear button: `text-[#F5F5DC]/45 transition-colors hover:text-[#FF8F00] cursor-pointer`
- Result text: `text-[13.5px] text-[#F5F5DC]/70 mt-2` (shown only when debouncedSearchQuery is not empty)

**Verification**:
- Render correctly on desktop and mobile
- Icons display without broken imports
- Input field is focusable and accepts text
- Clear button appears/disappears with text presence

---

### Step 4: Add search result messaging and counts
**What**: Add conditional rendering:
1. Below the search bar, show "Search results for: {query}" text when search is active
2. Update the result count display in the toolbar to reflect search + filter combination
3. Add "No products match your search" message when filteredProducts is empty after search

**Files to modify**:
- `src/pages/productPage.jsx`

**Code location**: 
- Search context text: immediately after the search bar container
- Toolbar result count: update existing result count display to reflect combined filters + search
- No results message: after the toolbar, wrapped in conditional

**Verification**:
- Message appears when search is active (debouncedSearchQuery is not empty)
- Message disappears when search is cleared
- Result counts update correctly as search changes
- "No products match" message shows when no results found

---

### Step 5: Wire up search input handler and clear button
**What**: Add `handleSearchInputChange` callback similar to header.jsx that:
1. Updates `searchQuery` state immediately
2. Clears any debounce timeout
3. Sets a new 300ms debounce timeout to update `debouncedSearchQuery`

Add click handler for clear/X button that resets `searchQuery` to empty string.

**Files to modify**:
- `src/pages/productPage.jsx`

**Code location**: With other state handlers, around line 230 (near `toggleFilter`, `clearFilters`).

**Verification**:
- Typing in search box updates input immediately
- No console errors
- Debounce delay is 300ms (verify by typing and observing product grid updates after 300ms delay)
- Clear button clears input and results

---

### Step 6: Final integration and styling refinement
**What**: Ensure search bar styling matches Metal Garage theme:
1. Verify all color values (#0A0A0A, #F5F5DC, #FF8F00) are correct
2. Add smooth transitions on focus states
3. Ensure responsive design (full width on mobile, proper spacing on desktop)
4. Test with various product names and filter combinations

**Files to modify**:
- `src/pages/productPage.jsx` (refinement only, no new logic)

**Verification**:
- `npm run build` completes with no errors
- Open page in browser and verify:
  - Search bar displays correctly and matches theme
  - Search functionality works (test: "skyline", "ferrari", "hot wheels")
  - Filters + search work together (set category filter, then search)
  - Mobile responsive (test viewport: 375px, 768px, 1024px, 1440px)
  - No console errors or warnings
  - Clear button works
  - Result counts are accurate

---

## Field Mapping (Case-Insensitive Search)

The search will normalize these product fields:
```javascript
[
  product?.name,
  product?.series,
  product?.category,
  product?.model,
  product?.manufacturer,
  product?.casting,
  product?.sku,
  product?.productID,
]
```

Normalization: `.trim().toLowerCase()` on each field, joined with spaces, then check if normalized query is included in normalized field string.

---

## Verification Checklist

- [ ] Build completes: `npm run build` → no errors
- [ ] Search input appears and accepts text
- [ ] Debounce works (300ms delay before filtering)
- [ ] Search matches products by: name, series, category, model, manufacturer, casting, sku, productID
- [ ] Case-insensitive matching works
- [ ] Clear/X button removes search and results
- [ ] Result count displays correctly
- [ ] "Search results for:" text appears when active
- [ ] Search + filters work together (filters apply first, search narrows results)
- [ ] "No products match" message shows when no results
- [ ] Mobile responsive: full width on mobile, proper spacing desktop
- [ ] No console errors
- [ ] Icons render correctly
- [ ] Styling matches Metal Garage theme (dark #0A0A0A, beige #F5F5DC, orange #FF8F00)

