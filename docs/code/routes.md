# Routes

### CMS

The main [index.ts](../../packages/cms/src/index.ts) file for the CMS handles the routing.

For example, there are routes in this file, that first check whether the client is logged in.

```ts
app.use('/quizzes', Authentication.isLoggedIn)
```

And some routes that use multer to upload files, eg

```ts
app.post(
  '/data/upload-content-sheet',
  upload.single('spreadsheet'),
  dataController.uploadContentSheet,
)
```

However most of the CMS routes are defined in [routes.ts](../../packages/cms/src/routes.ts)

This array of routes is looped over in [index.ts](../../packages/cms/src/index.ts) here:

```ts
Routes.forEach((route) => {
  ;(app as any)[route.method](
    route.route,
    (req: Request, res: Response, next: any) => {
      const result = new (route.controller as any)()[route.action](
        req,
        res,
        next,
      )
      if (result instanceof Promise) {
        result.then((_result) =>
          _result !== null && _result !== undefined
            ? res.send(_result)
            : undefined,
        )
      } else if (result !== null && result !== undefined) {
        res.json(result)
      }
    },
  )
})
```

This code essentially just saves us from writing a lot of repetitive code for each of the routes.

For example, it allows us list simple objects like this

```ts
  {
    method: 'get',
    route: '/articles',
    controller: ArticleController,
    action: 'all',
  },
```

Instead of writing repetitive code like this for every route:

```ts
app.get('/articles', (req: Request, res: Response, next: any) => {
  const result = new ArticleController().all(req, res, next)
  if (condition) {
    // ...
  } else if (condition) {
    // ...
  }
})
```

So in this example, the previous object from the `Routes` array, specifies that GET requests for route `/articles` are handled by the `all` method in the `ArticleController`.

If you go to the `ArticleController` file, you will find the `all` method:

```ts
export class ArticleController {
  // ...
  async all(request: Request, response: Response, next: NextFunction) {
    // ...
  }
}
```

---

Here is another example

```ts
  {
    method: 'put',
    route: '/articles/:id',
    controller: ArticleController,
    action: 'update',
  },
```

Here, PUT requests for route `/articles/:id` are handled by the `update` method in the `ArticleController`. The `/:id` from the route, is a accessible in the code via `request.params.id`

`this.articleRepository` is essentially accessing the article table in the database, so in the simplified `update` method below, if finds one article with the id specified in the route, changes it and saves it to the database.

```ts
export class ArticleController {
  // ...
  async update(request: Request, response: Response, next: NextFunction) {
    // ...
    const articleToUpdate = await this.articleRepository.findOne(
      request.params.id,
    )
    // ...
    await this.articleRepository.save(articleToUpdate)
    // ...
  }
}
```

---

### API

Routes are handled differently in the API package.
Instead of an array of objects, like in the CMS, the code is like this:

```ts
  @Post('/login')
  public async login(
    @Body()
    { name, password }: LoginRequest,
  ) {
    // ...
  }
```

This is not all that different though, as you can tell this is handling POST requests to `/login` with this login method.

---

### Types

If you hover your mouse over the method in the controller, you can see the return type, for example `CategoryController` `all` method returns a promise for an array of categories

```ts
Promise<Category[]>
```

You can also find the AxiosResponse types in the /packages/core

For example, in the code below you can see that when we make requests to `${cmsEndpoint}/mobile/articles/${locale}`, we expect the returned data to be type `EncyclopediaResponse`.

```ts
    fetchEncyclopedia: async ({ locale }) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.get(
        `${cmsEndpoint}/mobile/articles/${locale}`,
      )
      return response.data
    },
```

If you find the definition of that type in `types.ts`, you will see it is an array of `EncyclopediaResponseItem` which is also defined in that same file.

```ts
export interface EncyclopediaResponseItem {
  id: string
  cat_id: string
  category_title: string
  subcategory_title: string
  subcat_id: string
  article_heading: string
  article_text: string
  primary_emoji: string
  primary_emoji_name: string
  lang: string
  live: boolean
}
export interface EncyclopediaResponse extends Array<EncyclopediaResponseItem> {}
```

To find what controller this request is handled by, search the code for `/mobile/articles/`, and notice that this is a GET request (`axios.get`). With this it is easy to find the controller in the CMS:

```ts
  {
    method: 'get',
    route: '/mobile/articles/:lang',
    controller: ArticleController,
    action: 'mobileArticlesByLanguage',
  },
```
