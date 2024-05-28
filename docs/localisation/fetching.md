# Moving data from old CMS into the new

In the root of the project, find this file `fetch-content.ts`. Edit this file with the `cmsUrl` for you old CMS, and the locale that you want to fetch from that CMS. Then run this command

```bash
yarn fetch-content
```

This will create/update the .ts file in your translations submodule
