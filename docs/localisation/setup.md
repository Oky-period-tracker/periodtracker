# Setting up translations

Follow these steps when adding content for the first time / adding content for a new language

1. There are 3 spreadsheets, one for the content (articles, quizzes etc), app translations, and cms translations, make a copy of these sheets and fill in the empty columns with translated text
2. In the CMS, make sure you have selected the language that you want to add translations for
3. Upload the spreadsheet files one at a time via the CMS, using the corresponding forms
4. After each spreadsheet upload, the CMS will generate and download a .ts file

   > If its a new language, it generates new Ids for everything, if its an existing language it will keep the same Ids and overwrite previous content

5. Add .ts file into your /translations submodule
6. Add an import statement, to the relevant index.ts file, and add the imported object to the exported object
7. Review the changes and commit

> These next steps are only required for the content, not for app / cms

8. Run this command to generate SQL file(s), to insert the content to the DB, and ts files containing live only content, for use in the app

```bash
yarn generate-content-files
```

9. Copy the contents of this SQL file, go to adminer > `SQL command`, paste the SQL and execute.

For instructions on updating content after this initial set up, [go here](./updating_content.md)
