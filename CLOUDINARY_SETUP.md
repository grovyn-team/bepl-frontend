# Cloudinary Integration & Data Migration Guide

## Overview
This guide explains how to integrate Cloudinary for image uploads and migrate static data from frontend arrays to MongoDB.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install cloudinary multer
```

### 2. Environment Variables
Add to your `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Seed Data to MongoDB
Run the seed script to migrate static data and upload images to Cloudinary:
```bash
npm run seed
```

This will:
- Upload all local images from `src/assets/` to Cloudinary
- Create Services, Projects, and About content in MongoDB
- Store Cloudinary URLs in the database

## API Endpoints

### Image Upload
- `POST /api/upload/image` - Upload single image (Admin only)
- `POST /api/upload/images` - Upload multiple images (Admin only)

### Data Endpoints
- `GET /api/services` - Get all services
- `GET /api/projects` - Get all projects
- `GET /api/about` - Get about content

## Frontend Updates

### Services Page
- Now fetches from `/api/services`
- Displays images from Cloudinary URLs
- Icons are mapped from string names

### Projects Page
- Now fetches from `/api/projects`
- Images loaded from Cloudinary

### About Page
- Fetches from `/api/about`
- All content managed through API

## Admin Panel

### Image Upload in Admin
1. Go to admin panel
2. When creating/editing Services or Projects
3. Use the image upload field to upload to Cloudinary
4. Image URL is automatically saved

## Notes
- All images are stored in Cloudinary folders: `bepl/services/`, `bepl/projects/`, etc.
- Image URLs are stored in MongoDB, not the actual files
- Local images in `src/assets/` are uploaded during seeding

