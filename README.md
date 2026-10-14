# Pre-Match Checklist

## Local development

```powershell
bun install
bunx convex dev
bun run dev
```

`bunx convex dev` connects the project to the selected Convex team and writes the development deployment URL to `.env.local`.

## Production

Deploy the Convex backend with:

```powershell
bunx convex deploy
```

Build the Vite client with:

```powershell
bun run build
```

For Vercel, set `VITE_CONVEX_URL` to the production Convex deployment URL and use `bun run build` with `dist` as the output directory.
