## 新闻帖子类

使用article和article_comment模型实现帖子和评论功能。使用fav存储用户收藏

- 获取帖子列表

```
url
  /api/v1/articles
method
  get
返回数据

```

- 获取帖子详情

```
url
  /api/v1/articles/:id
method
  get
```

- 发布帖子

```
url
  /api/v1/pub/articles
method
  post
headers
  authorization Bearer token  // 需要提供jwt信息
params
  title         标题
  descriptions  描述
  content       内容
  coverImg      封面
return
  {
  }
```

- 发布评论

```
url
  /api/v1/pub/comments/:a_id // a_id表示帖子id就是要评论的那个主题
method
  post
headers
  authorization Bearer token  // 需要提供jwt信息
params
  content 内容
return
  {
  }
```

- 获取收藏信息

```
url
  /api/v1/favs // 获取用户收藏信息
method
  get
headers
  authorization Bearer token  // 需要提供jwt信息
return
  {
  }
```

- 加入收藏

```
url
  /api/v1/favs // 获取用户收藏信息
method
  get
headers
  authorization Bearer token  // 需要提供jwt信息
params
  article 需要收藏的帖子id
return
  {
  }
```

- 删除收藏

```
url
  /api/v1/favs/:id // 获取用户收藏信息
method
  get
headers
  authorization Bearer token  // 需要提供jwt信息
return
  {
  }
```
