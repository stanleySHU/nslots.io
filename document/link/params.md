# [Link](../index.md) 

the params description for game link. [games](./games.md)

- op

```
description: operator, no default value.
eg: ?op=1, ?op=w88 ....
```

- fun:  [1 | 0]

```
description: it is control that login by funplay, default value 0, false
eg: ?op=xxxx&fun=1
```

- token / s

```
description: token, no default value
eg1: ?op=xxxx&fun=0&token=xxxx
eg2: ?op=xxxx&fun=0&s=xxxx
```

- loginURL

```
description: login page link
case1: when link is not funplay and not exist token, the game will redirect to login page 
case2: player click login button
case3: other
format: xxxxxxxx[%%REDIRECT%%]xxxxx, [%%REDIRECT%%] it for redirect back game
```

- lobbyUrl

```
description: lobby page link
case1: when link is not funplay and not exist token and not exist login url, the game will redirect to lobby page
case2: player click lobby button in menu 
```

- fundsUrl

```
description:transfer page link
case1: player click transfer button in menu
```

- debug [1 | 0]
```
description: debug
```

- livechatUrl

```
description: live chat page link
case1: player click chat button in menu
```

- lang  [en | us, en | cn, zh, zn, cs | th | vi, vn | ko, kr | km, kh | id | jp, ja]

```
description: game language  
  - default: en
  - English: us, en
  - Chinese: cn, zh, zn, cs
  - Thai: th
  - Vietnamese: vi, vn
  - Korean: ko, kr
  - Khmer: km, kh
  - Indonesian: id
  - Japanese: jp, ja
```
