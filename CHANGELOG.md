UPDATE OR CHANGES IS PUT IN HERE!!!
(WENCYV3 UPD!!)
## - 2026-10-01
### Added
#### Event Image Gallery
- Added support for multiple gallery images for each event.
- Added a new **Gallery** button in the Events Admin table.
- Added an Event Gallery Manager for uploading, viewing, and deleting additional event images.
- Added support for uploading multiple images at once.
- Gallery images are stored in ImageKit under event-specific folders.
- Added automatic cleanup of uploaded ImageKit images when a database insert fails.
- Added automatic ImageKit deletion when a gallery image is removed.
- Added cleanup of event gallery images from ImageKit when an entire event is deleted.

#### Public Event Details Modal
- Added a clickable event details modal on the public Events page.
- Added full event information inside the modal, including:
  - Event title
  - Category
  - Status
  - Date
  - Time
  - Location
  - Full description
  - Registration link
- Added Escape key support for closing the event modal.
- Prevented background page scrolling while the event modal is open.

#### Event Image Slider
- Added an image slider to the Event Details modal.
- The event cover image is displayed as the first image.
- Additional gallery images are loaded from Supabase.
- Added previous and next navigation buttons.
- Added image counter.
- Added clickable image indicator dots.
- Added smooth horizontal slide animation between event images.
- Images now use `object-fit: contain` in the full event modal so the complete image remains visible without cropping.

#### ImageKit Utilities
- Added reusable `uploadImageToImageKit()` utility.
- ImageKit uploads now return both:
  - `url`
  - `fileId`
- Added support for custom ImageKit upload folders.
- Reused the global `deleteImageFromImageKit()` utility for gallery image cleanup.

### Changed

#### `src/components/admin/AdminEvents.jsx`
- Added Event Gallery management.
- Added Gallery column to the Events Admin table.
- Added multiple-image upload support.
- Added gallery image deletion.
- Updated event deletion to retrieve gallery ImageKit file IDs before deleting the event.
- Gallery ImageKit files are removed after successful event deletion.
- Existing event cover image handling remains managed by `CRUDTable.jsx`.

#### `src/components/EventsPage.jsx`
- Added event selection state for opening event details.
- Added `EventDetailsModal`.
- Added loading of event gallery images from Supabase.
- Combined the event cover image with gallery images for the slider.
- Added smooth animated image navigation.
- Added full-size image fitting using `object-fit: contain`.
- Added slider arrows, image counter, and navigation dots.

#### `src/utils/imagekit.js`
- Added reusable ImageKit upload helper.
- Added ImageKit authentication through the existing `imagekit-auth` Supabase Edge Function.
- Added support for returning the ImageKit `fileId` alongside the uploaded image URL.
- Existing ImageKit deletion helper continues to handle image cleanup.

### Database

#### Added `event_images` Table

Created a new Supabase table for storing additional images associated with an event.

```sql
create table if not exists public.event_images (
  id uuid primary key default gen_random_uuid(),

  event_id uuid not null
    references public.events(id)
    on delete cascade,

  image_url text not null,
  image_file_id text,

  sort_order integer not null default 0,

  created_at timestamptz not null default now()
);
```

#### Event Gallery Relationship
- `event_images.event_id` references `events.id`.
- Added `ON DELETE CASCADE`.
- Deleting an event automatically removes its associated `event_images` database records.
- ImageKit files are separately deleted by the application before/after the event deletion process.

#### Row Level Security

Enabled RLS for the new `event_images` table.

```sql
alter table public.event_images enable row level security;
```

Added an admin policy allowing authorized users with the `events` permission to manage gallery images.

```sql
create policy "Admins can manage event images"
on public.event_images
for all
to authenticated
using (
  public.has_admin_permission('events')
)
with check (
  public.has_admin_permission('events')
);
```

Added a public read policy allowing gallery images to be viewed only when their related event is published.

```sql
create policy "Public can view published event images"
on public.event_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.events
    where public.events.id = event_images.event_id
      and public.events.published = true
  )
);
```

### Files Updated

- `src/components/admin/AdminEvents.jsx`
- `src/components/EventsPage.jsx`
- `src/utils/imagekit.js`

### Supabase Changes

- Added `public.event_images` table.
- Added `event_id` foreign key relationship to `public.events`.
- Added `image_url`.
- Added `image_file_id`.
- Added `sort_order`.
- Added `created_at`.
- Enabled Row Level Security on `event_images`.
- Added admin gallery management policy.
- Added public gallery viewing policy for published events.


(WENCYV2 UPD!!)
### `src/components/MentorsDay.jsx`
- Replaced the hardcoded Supabase client with the website's shared Supabase client so the Gratitude Tree uses the main database.
### `src/components/AdminPanel.jsx`
- Updated the upcoming event query to compare the full current timestamp with the `event_date` timestamp.
- Dashboard queries now use the newly created `news`, `contact_submissions`, `merch_items`, and `merch_preorders` tables.
### `src/components/admin/AdminEvents.jsx`
- Added the required `slug` field to the event form.
- Added slug formatting before creating or updating an event.
- Marked required event fields to match the Supabase schema.
- Aligned event fields with the updated Supabase columns including `image_url`, `event_time`, `status`, `registration_link`, and `published`.

### Supabase Database Changes
#### New Tables Added
- Added `news` table for managing and displaying news posts.
  - Includes `title`, `description`, `image_url`, `tag`, `date`, `published`, and `created_at`.
- Added `contact_submissions` table for messages submitted through the Contact page.
  - Includes `name`, `email`, `subject`, `message`, `read`, and `created_at`.
- Added `redirect_links` table for managing dynamic redirect links.
  - Includes `slug`, `destination_url`, `label`, `active`, and `created_at`.
- Added `gratitude_tree` table for storing Mentors Day gratitude messages.
  - Includes `message` and `created_at`.
- Added `merch_preorders` table for storing merchandise preorder information.
  - Includes customer information, selected merchandise, size, payment information, customization fields, payment status, claim status, batch, and creation date.
  - Added a foreign key from `merch_preorders.item_id` to `merch_items.id`.
#### Merchandise Table Changes
- Renamed the existing `merchandise` table to `merch_items` to match the frontend code.
- Renamed `type` to `category`.
- Renamed `size_available` to `sizes`.
- Kept the existing `stock_quantity` field for inventory purposes.
- Added `image_url` for merchandise images hosted through ImageKit.
- Added `sort_order` for controlling merchandise display order.
- Added `available` for controlling whether a merchandise item is currently available.
- Added `show_back_name` and `back_name_required` for optional name customization.
- Added `show_back_number` and `back_number_required` for optional number customization.
#### Events Table Changes
- Renamed `is_active` to `published` to match the frontend event visibility field.
- Renamed `banner_url` to `image_url` to match the event image field used by the frontend.
- Added `event_time` for displaying the scheduled event time.
- Added `status` with supported values: `upcoming`, `ongoing`, and `past`.
- Added `registration_link` for external event registration URLs.
- Kept the existing `slug` field as required and unique.
- Added a status check constraint to restrict event status values.
- Kept the existing `max_participants` and `registration_fee` fields for future event registration features.


(WENCYV1 UPD!!)
The full list of changes organized by file:
### `src/components/AdminPanel.jsx`
**`AdminApp` (main component):**
- Added `pendingIntent` state to keep track of actions triggered from the dashboard.
- Added a `goTo(section, intent)` helper that changes the active admin section and optionally passes an action to that section.
- Updated the `SECTIONS` map to pass dashboard actions into:
  - `AdminNews`
  - `AdminEvents`
  - `AdminOfficers`
  - `AdminMerch`
  - `AdminContacts`
- Updated the fallback Dashboard component to use `onQuickAction={goTo}` instead of directly using `setActive`.
- Fixed the superadmin authorization logic.
Changed from:
```js
const isSuperadmin = !adminRecord || adminRecord?.role === 'superadmin';
```
to:
```js
const isSuperadmin = adminRecord?.role === 'superadmin';
```
- This prevents a missing `adminRecord` from being incorrectly treated as a superadmin.
**`Dashboard` component:**
- Expanded the existing dashboard with more useful information.
- Added state and fetching for:
  - `unpaid` — unpaid merch pre-orders
  - `nextEvent` — nearest upcoming event
  - `latestNews` — most recent news post
- Kept the existing counts for:
  - News
  - Events
  - Officers
  - Merch
  - Redirects
  - Messages
- Added unpaid merch pre-order count to the dashboard.
- Added a badge to the Merch stat card showing the number of unpaid pre-orders.
- Updated the existing Messages badge so it now also carries an `unread` navigation intent.
- Updated Merch and Messages stat cards so clicking them can open a more specific admin view when a badge count is present.
- Added an `intent` to the Merch and Messages stat cards.
- Clicking the Merch card with unpaid orders can now open the `orders` tab directly.
- Clicking the Messages card with unread messages can now open the `unread` filter directly.
- Added a `canSee()` permission helper so dashboard sections respect the current admin's permissions.
- Added an **Upcoming Event** panel below the stat cards.
- Added a **Latest News** panel below the stat cards.
- Made the entire Upcoming Event and Latest News cards clickable.
- Added small hover movement to the new dashboard information cards.
- Added empty-state messages when there is no upcoming event or latest news.
- Added a **Quick Actions** section with:
  - Add News
  - Add Event
  - Add Officer
- Quick Actions now send an `add` intent so the correct create modal opens automatically.
**Dashboard query fixes:**
- Updated the upcoming-event query to compare against a normal `YYYY-MM-DD` date instead of a full timestamp.
```js
const today = new Date().toISOString().split('T')[0];
supabase
  .from('events')
  .select('*')
  .gte('event_date', today)
  .order('event_date', { ascending: true })
  .limit(1)
  .maybeSingle();
```
- Updated latest-news sorting to use the project's existing `date` field instead of `created_at`.
```js
supabase
  .from('news')
  .select('*')
  .order('date', { ascending: false })
  .limit(1)
  .maybeSingle();
```
---
### `src/components/admin/CRUDTable.jsx`
- Added `startInAdd` and `onIntentConsumed` to the shared `CRUDTable` props.
- Added a `useEffect` that checks whether the dashboard requested the Add modal.
- When `startInAdd` is true:
  - Opens the Add modal using `setShowAdd(true)`.
  - Calls `onIntentConsumed()` to clear the pending dashboard action.
```js
useEffect(() => {
  if (startInAdd) {
    setShowAdd(true);
    onIntentConsumed?.();
  }
}, [startInAdd]);
```
- This allows dashboard Quick Actions to directly open create forms instead of only navigating to the management page.
---
### `src/components/admin/AdminNews.jsx`
- Updated the component to accept:
```js
{ startInAdd, onIntentConsumed }
```
- Forwarded both props to `<CRUDTable />`.
- The Dashboard's **Add News** Quick Action can now directly open the Add News modal.
---
### `src/components/admin/AdminEvents.jsx`
- Updated the component to accept:
```js
{ startInAdd, onIntentConsumed }
```
- Forwarded both props to `<CRUDTable />`.
- The Dashboard's **Add Event** Quick Action can now directly open the Add Event modal.
---
### `src/components/admin/AdminOfficers.jsx`
- Updated the component to accept:
```js
{ startInAdd, onIntentConsumed }
```
- Since `AdminOfficers` manages its own modal instead of using `CRUDTable`, added its own `useEffect`.
- When `startInAdd` is true:
  - Opens the Add Officer modal using `setShowAdd(true)`.
  - Calls `onIntentConsumed()` to clear the pending action.
```js
useEffect(() => {
  if (startInAdd) {
    setShowAdd(true);
    onIntentConsumed?.();
  }
}, [startInAdd]);
```
- The Dashboard's **Add Officer** Quick Action can now directly open the Add Officer form.
---
### `src/components/admin/AdminMerch.jsx`
- Updated the component to accept:

```js
{ initialTab, onIntentConsumed }
```

- Added support for opening a specific Merch tab from the dashboard.
- The Merch dashboard card can now send the `orders` intent when unpaid pre-orders exist.
- Added a separate `useEffect` for handling the requested tab.

```js
useEffect(() => {
  if (initialTab) {
    setTab(initialTab);
    onIntentConsumed?.();
  }
}, [initialTab]);
```

- Kept the Escape-key `useEffect` separate so it is only responsible for closing open modals.
- Fixed the earlier issue where `initialTab` handling was accidentally placed inside the Escape-key handler.

---

### `src/components/admin/AdminContacts.jsx`

- Updated the component to accept:

```js
{ initialFilter, onIntentConsumed }
```

- Added a `useEffect` that applies the requested filter from the dashboard.

```js
useEffect(() => {
  if (initialFilter) {
    setFilter(initialFilter);
    onIntentConsumed?.();
  }
}, [initialFilter]);
```

- The Messages dashboard card can now directly open the **Unread** messages filter.
- Calls `onIntentConsumed()` after applying the filter so the same dashboard action does not repeat.

---

### `src/components/InitiativesSection.jsx`

- Fixed the `react-slick` import issue that caused the homepage to display a blank white screen.
- The issue happened because `react-slick` was being received as a module object instead of directly as the React component.

Changed from:

```js
import Slider from 'react-slick';
```

to:

```js
import SliderModule from 'react-slick';

const Slider = SliderModule.default || SliderModule;
```

- This handles the CommonJS / ES Module compatibility issue with `react-slick`.

---

### `src/components/NewsCarousel.jsx`

- Applied the same `react-slick` compatibility fix used in `InitiativesSection.jsx`.

Changed from:

```js
import Slider from 'react-slick';
```

to:

```js
import SliderModule from 'react-slick';

const Slider = SliderModule.default || SliderModule;
```

- Prevents React from trying to render the module object instead of the actual Slider component.

---

### `src/utils/imagekit.js`

- Added the missing ImageKit URL endpoint variable.
- The ImageKit endpoint is now loaded from the Vite environment variables.

```js
const IK_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
```

- This allows the ImageKit utility to correctly build image URLs using the endpoint configured in `.env`.

