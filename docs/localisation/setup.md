# Setting up translations

If you want to add a new language, you will likely need to create your own /translations repository if you have not done so already. [Go here](../modules.md) for instructions on how to do this.

Both the CMS and the app are capable of supporting multiple languages, and the process for adding a new language is the same for both. You _do not_ need to deploy multiple instances of the CMS or the app to support multiple languages. Simply follow the steps below.

## Locales

In the /translations submodule we use the `Locale` type to ensure all translations files are in place for all languages that are being used.

To add a new language, start by simply expanding the `Locale` type to include the new language.

```diff
-export type Locale = 'en'
+export type Locale = 'en' | 'fr'
```

Once you have made this change, you will get typescript errors when you try to compile, because you still need to add the translations files for this language in all the appropriate places.

## App translations

Log into the CMS and go to the `/data-management` page. You will see a form for uploading app translations. Upload the app translations spreadsheet for the new language. This will generate and download a .ts file, which you can add to the /translations/app folder. Make sure the name of the file matches the language code, and that the name of the const in this file also matches the language code. Eg

Filename: `fr.ts`

```ts
export const fr = {
  // ...
}
```

Next you need to import and use this file in `/translations/app/index.ts`

```diff
import { en } from './en'
+import { fr } from './fr'

export const appTranslations = {
  en,
+ fr
}
```

## CMS translations

The process for adding CMS translations is the same as for app translations. Just make sure to upload your spreadsheet via the correct form in the CMS, and add the resulting .ts file into the `/translations/cms` folder instead of the `/app` folder.

## Adding content

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

# Countries & Provinces

These translation files are not yet automated

---

If you aren't sure what files are missing, try to compile and you will get an error message telling you what files are missing for your language, assuming you have added the language to the `Locale` type.

```bash
yarn compile
```
