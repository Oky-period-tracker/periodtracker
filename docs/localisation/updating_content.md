# Updating content

1. New content should always be added via the CMS, so that unique Ids are automatically generated
2. To keep your spreadsheets up to date, there is a button in the CMS which will find content that is in the database, but not in the .ts content file, and will download a spreadsheet containing just these new items. Simply click the button and copy paste those items into your main spreadsheet

> Please note, you must do that step before updating the .ts files in the next steps, otherwise it won't be able to find the new items

3. Generate and download a new content .ts file by simply clicking a button in the CMS
4. Add this ts file into the code
5. Run this command to generate ts files containing the live content for the app, and to update the SQL files

```bash
yarn generate-content-files
```

> You don't need to actually execute the SQL that is generated by this, because the content is already in the database, but this SQL will be useful for other developers setting up their local environment with the latest content.

For instructions on adding content for a new language, [go here](./translations.md)
