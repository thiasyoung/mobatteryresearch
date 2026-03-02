# GitHub Pages Deployment

This site is ready for direct deployment on GitHub Pages as a plain static site.

## Recommended setup

1. Create a GitHub repository and push this folder to the default branch.
2. In GitHub, open `Settings > Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select the default branch and the `/(root)` folder.
5. Save and wait for the first publish to complete.

## Notes

- `.nojekyll` is included so GitHub Pages will serve the site without Jekyll processing.
- All active asset paths are relative, so the site can be served directly from the repository root.
- If you later connect a custom domain, add a `CNAME` file at the repository root with the final domain name.
