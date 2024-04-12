# Tailwind Helpers

A small and efficient collection of helper functions and classes that make it easier to work with TailwindCSS, without having to install multiple external dependencies.

It consists of 3 core utilities:

1. `concat`: Seamlessly construct className strings conditionally
2. `merge`: Efficiently merge Tailwind CSS classes in JS without style conflicts
3. `variants`: Generate type-safe component variants using Tailwind CSS

## Getting Started

### Installation

`npm`

```sh
npm i @naparajith/tailwind-helpers
```

`pnpm`

```sh
pnpm i @naparajith/tailwind-helpers
```

`yarn`

```sh
yarn add @naparajith/tailwind-helpers
```

`bun`

```sh
bun add @naparajith/tailwind-helpers
```

### Editor Config

To enable the Tailwind CSS LSP for autocompletions, a few additional steps have
to be taken. The following setup is for NeoVim users. Feel free to raise an
Issue or a PR for an equivalent VSCode configuration.

1. Run the following command to install the Tailwind CSS LSP

```sh
   npm install -g @tailwindcss/language-server
```

2. Add the following configuration to your NeoVim LSP Config

```lua
require("lspconfig").tailwindcss.setup({
    settings = {
        tailwindCSS = {
            experimental = {
                classRegex = {
                    { "variants\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]" },
                    { "concat\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)" }
                }
            }
        }
    }
})
```

### Handling Style Conflicts

The main disadvantage with Tailwind CSS is that the core principle of CSS,
cascading styles is not available. This gives rise to style conflicts. To help
alleviate this burden, `@naparajith/tailwind-helpers` exports a helper function
`cn`, which effortlessly helps you handle style conflicts that might arise.

Alongside the `cn` helper function, `@naparajith/tailwind-helpers` also exports
the primitives that compose this function, namely the `concat` and `merge`
functions. You can use these primitives as you see fit, even while not working
with Tailwind CSS.

## Future Roadmap

1. Generate comprehensive documentation for users to access
2. Remove all dependencies (currently `tailwind-merge` is the only dependency)
3. Write unit tests to increase code reliability
4. Enable the ability to develop plugins to extend functionality
5. Reduce bundle size (current gzipped + minified bundle is at ~7.6KB)
6. Document code with JSDoc for hover documentation in editors

## License

[MIT License](./LICENSE) © [Naparajith](https://www.linkedin.com/in/naparajith)
