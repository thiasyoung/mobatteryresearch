# Static Hosting And DNS Migration

This repo is plain HTML, CSS, JS, images, and one PDF. There is no backend, database, PHP, or WordPress dependency.

## 1. Put the site on a static host

Use one of these:

- Netlify
- Cloudflare Pages
- GitHub Pages

For this repo, the publish directory is the project root because `index.html` is at the top level.

## 2. Find who controls the DNS now

You need the nameserver or DNS login, not just the domain name.

Fast checks:

```powershell
nslookup -type=ns mobatteryresearch.com
nslookup mobatteryresearch.com
```

If the nameservers point to GoDaddy, Cloudflare, Namecheap, or Storm, that service currently controls DNS.

You can also check:

- https://lookup.icann.org
- https://dnschecker.org/ns-lookup.php

## 3. Connect the domain in the new host

In Netlify or Cloudflare Pages:

1. Create a new site/project.
2. Upload this repo or connect it from GitHub.
3. Add `mobatteryresearch.com`.
4. Add `www.mobatteryresearch.com`.

The host will show the exact DNS records to use.

## 4. Change the DNS records

Do not guess. Copy the values from the new host.

Typical patterns:

- `A` or `ALIAS` record for the root domain `@`
- `CNAME` record for `www`

If Cloudflare asks you to change nameservers, that is also normal. In that case, update nameservers at the domain registrar instead of editing individual DNS records.

## 5. Remove old Storm records

Delete or replace the records that still point at the current WordPress host.

Common old records:

- old `A` record for `@`
- old `CNAME` for `www`

## 6. Wait for propagation

Usually 5 to 60 minutes. Sometimes longer.

Checks:

```powershell
nslookup mobatteryresearch.com
nslookup www.mobatteryresearch.com
```

Also verify with:

- https://dnschecker.org

## 7. Verify the live site

Check both:

- `https://mobatteryresearch.com`
- `https://www.mobatteryresearch.com`

If both resolve to the new host and load this static site, Storm is no longer in the path.

## Short explanation of DNS

- Domain registrar: where the domain is registered and renewed.
- DNS host: where the DNS records or nameservers are managed.
- Web host: where the HTML files live.

Those can all be different companies.
