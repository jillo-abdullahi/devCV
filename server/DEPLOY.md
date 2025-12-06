# Deploy Server Separately

## Option 1: Using Railway (or similar platforms)

1. **Configure build command** in Railway dashboard:
   ```bash
   npm run build
   ```

2. **Configure start command**:
   ```bash
   npm start
   ```

3. **Set root directory** to `/server` in Railway settings

4. **Add shared folder**: The prebuild script automatically copies the shared folder into the server directory before deployment.

## Option 2: Using Docker

Build from the repository root (not from server directory):

```bash
docker build -f server/Dockerfile -t devcv-server .
docker run -p 8080:8080 devcv-server
```

The Dockerfile context needs to be the root directory so it can access both `server/` and `shared/`.

## Environment Variables

Make sure to set these environment variables:
- `PORT` (default: 8080)
- `PLAYWRIGHT_SECRET_KEY` (optional, for API authentication)
- `CORS_ORIGIN` (optional, comma-separated origins)

## Notes

- The `copy-shared` script copies shared templates into the server directory before build
- This makes the server self-contained and deployable independently
- The shared folder is ignored in .gitignore but gets copied during build
