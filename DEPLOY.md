# Go live: GitHub Pages + custom domain

1. Edit `CNAME`: replace `yourdomain.com` with your real domain (one line, no https://).
2. Create a GitHub repo, upload everything in this folder (keep `.nojekyll`, `CNAME`, `.well-known`).
3. Repo > Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Settings > Pages > Custom domain: enter your domain, then tick **Enforce HTTPS** once it turns available.
5. Also verify the domain: GitHub profile Settings > Pages > Add a domain. This stops others from taking over your domain.
6. DNS at your domain provider:
   - A records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - CNAME `www` -> `YOUR-GITHUB-USERNAME.github.io`
7. Optional but recommended: put the domain on Cloudflare (free), set SSL mode "Full (strict)", turn on "Always Use HTTPS", then add the headers listed in `cloudflare-headers.txt`.
8. Before publishing: replace `91XXXXXXXXXX`, phone numbers, Google review link, rating, sample reviews and your email in `.well-known/security.txt`. Add your photos to `images/`.
9. Account safety: turn on two-factor login for GitHub, your domain provider and Cloudflare. Never commit passwords or keys.
