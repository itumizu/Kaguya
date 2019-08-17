# かぐや

[![CircleCI](https://circleci.com/gh/itumizu/Kaguya/tree/master.svg?style=shield)](https://circleci.com/gh/itumizu/Kaguya/tree/master) 

日本語古典資料検索システム

![result](images/result.jpg)

## 使っているもの
- Docker
- Nginx
- Django
- React.js
- PostgreSQL

## 使い方
```
docker-compose build
docker-compose run react yarn --cwd ./kaguya
docker-compose run react yarn --cwd ./kaguya build
docker-compose up
```

~/.envを作成し、内容を以下のようにしてください。
```
POSTGRES_USER=                  # PostgreSQLで使用するユーザ名
POSTGRES_PASSWORD=              # PostgreSQLで使用するパスワード
SECRET_KEY=                     # DjangoのSECRET_KEY
URL=                            # デプロイ先URL (DjangoのLLOWED_HOSTSに登録するため)
```

~/react/kaguya/.envを作成し、内容を以下のようにしてください。

```
REACT_APP_DEPLOYURL=            # デプロイ先URL
REACT_APP_KITID=                # Adobe FontのKitID(使用する場合)
```

<!-- ## Respect for
かぐや様は告らせたい～天才たちの恋愛頭脳戦～ -->