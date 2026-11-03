# Cloudinary Showcase

Cloudinary Showcase is a Next.js application for uploading and browsing videos, creating social-media-ready images, and managing a Clerk user profile.

## Features

- Sign up, sign in, and user profile management with Clerk.
- Upload videos to Cloudinary and save their metadata in PostgreSQL.
- Browse uploaded videos, preview them, and download them.
- Upload an image and create resized/cropped versions for Instagram, X (Twitter), and Facebook formats.
- Responsive application navigation for the home, video upload, social share, and account pages.

## Tech stack

- Next.js 16 App Router, React 19, and TypeScript
- Clerk for authentication
- Cloudinary for media storage and transformations
- PostgreSQL with Prisma ORM 7 and the Neon serverless adapter
- Tailwind CSS and daisyUI

## Requirements

- Node.js 20.9 or later
- npm
- A Clerk application
- A Cloudinary account
- A PostgreSQL database (the project uses the Neon serverless adapter)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and add the configuration below. Use the values from your own Clerk, Cloudinary, and PostgreSQL accounts:

   ```dotenv
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
   CLERK_SECRET_KEY=sk_test_your_secret_key

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   DATABASE_URL=your_postgresql_connection_string
   ```

   Keep secret keys private. Do not commit `.env.local` or expose `CLERK_SECRET_KEY`, `CLOUDINARY_API_SECRET`, or database credentials in client-side code.

3. Apply the database migrations:

   ```bash
   npx prisma migrate deploy
   ```

   Prisma Client is generated during dependency installation and again before a production build. If you change the schema, regenerate the client with:

   ```bash
   npx prisma generate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Application routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |
| `/home` | Video library |
| `/video-upload` | Upload a video (maximum 70 MB in the UI) |
| `/social-share` | Upload an image and create a social media format |
| `/account` | View and edit account details |

The video API stores the Cloudinary public ID, original and uploaded sizes, duration, title, and description in the `Video` table. The image upload API returns the Cloudinary public ID used to generate transformed previews.

## Configuration notes

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is public configuration; keep the API key and secret server-only.
- The Next.js proxy body limit is configured to 75 MB to accommodate the 70 MB video limit and multipart form overhead. Restart the dev server after changing `next.config.ts`.
- A production host or reverse proxy may impose its own request-size limit. It must allow requests of this size for server-mediated video uploads to work.
- Database schema and migration files are in `prisma/`.

## Useful commands

```bash
npm run dev            # Start the development server
npm run lint           # Run ESLint
npx tsc --noEmit       # Type-check without emitting files
npm run build          # Create a production build
npm run start          # Serve the production build
npx prisma migrate deploy  # Apply pending database migrations
```

## Verification

The project’s production build, ESLint checks for the changed application files, and TypeScript type-check completed successfully during development. A successful build does not verify connectivity to your own Clerk instance, Cloudinary account, database, or production hosting limits; configure those services and test uploads in your environment.
