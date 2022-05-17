# Vue 2 JSX Runtime

## What does it do?

This is a package for handling Vue 2 JSX code, you can use it with your favourite toolchain like SWC, TSC, Vite* to convert Vue 2 JSX.

## What's the different between this and Vue official solution?

The official Vue 2 JSX support uses Babel to convert JSX to Vue render function, so your workflow would be like:

```
JSX -> Babel -> Vite (ESBuild) / TSC / SWC -> JS  
```

The Babel just slows down the whole process, and we all know that these compilers actually support JSX transforming out of box. So if we have a Vue 2 JSX transformer for these compilers, we can just get rid of Babel.

Fortunately, TSC and SWC support using `jsxImportSource` to decide which JSX factory module we gonna use. So if you use this package, you will be able to use Vue 2 JSX without Babel.

## Quick start

TODO: ...

## For Vite users

For Vite users, it's better to use TSC or SWC instead of built-in ESBuild. Because ESBuild is kinda finicky at handling JSX for now and it gives you no rooms to change its configuration.

For faster compilation, SWC is recommended. You can use [unplugin-swc](https://github.com/egoist/unplugin-swc) to make Vite uses SWC.

Once you have switched to SWC (TSC) from ESBuild, you will have ability to use this package, and surprisingly you can get more, like `emitDecoratorMetadata` which is not supported by ESBuild. And SWC is still darn fast.
