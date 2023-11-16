# alias

### config alias in vite.configvite-env.d.t

```
resolve: {
    alias: {
      'engine': join('../../', 'engine'),
      '@': './src'
    }
}
  
```

### config in tsconfig.json

```
 "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "engine/*": ["../../engine/*"],
      "@/*": ["./src"]
    }
  }
```
