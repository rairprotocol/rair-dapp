![Banner](../assets/img/banner.webp)
[![RAIRmarket](https://img.shields.io/badge/RAIR-market-C67FD1)](https://rair.market)
[![RAIRprotocol](https://img.shields.io/badge/RAIR-protocol-C67FD1)](https://rairprotocol.org)
![License](https://img.shields.io/badge/License-Apache2.0-yellow)
[![Discord](https://img.shields.io/badge/Discord-4950AF)](https://discord.gg/vuBUfB7w)
[![Twitter](https://img.shields.io/twitter/follow/rairprotocol)](https://twitter.com/rairprotocol)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname
  }
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Creating Components with Cursor IDE

Cursor.ai is an AI-powered coding assistant that can help you create and modify components in the RAIR project. Here's how to create your own component:

1. **Open Cursor IDE**
   - Launch Cursor IDE in your project directory
   - Make sure you have the necessary permissions and dependencies installed

2. **Start a New Component**
   - Use the command palette (Cmd/Ctrl + Shift + P)
   - Type "Create Component" or describe the component you want to create
   - Cursor.ai will help you generate the component structure

3. **Component Structure**
   - Components should be placed in the appropriate directory under `rair-front/src/components/`
   - Follow the existing component patterns and naming conventions
   - Include necessary imports and dependencies

4. **Best Practices**
   - Use TypeScript for type safety
   - Follow the project's coding standards
   - Include proper documentation and comments
   - Add necessary tests
   - Ensure component reusability

5. **Integration**
   - Import and use your component where needed
   - Update any necessary routing or state management
   - Test the integration thoroughly

For more detailed information about component development, refer to the project's component documentation and style guide.

### Asking the Right Questions to Cursor.ai

When creating components with Cursor.ai, asking the right questions is crucial for getting the best results. Here are examples of effective questions to ask:

1. **Component Structure Questions**
   - "Can you create a new React component for [component name] with TypeScript?"
   - "What's the best way to structure a [component type] component in our project?"
   - "Can you show me how to implement [specific feature] in a React component?"

2. **Component Integration Questions**
   - "How should I integrate this component with our existing state management?"
   - "What are the best practices for handling [specific functionality] in our project?"
   - "Can you help me set up the routing for this new component?"

3. **Styling and UI Questions**
   - "How can I implement [specific UI pattern] using our project's styling system?"
   - "What's the best way to make this component responsive?"
   - "Can you help me implement [specific animation/transition]?"

4. **Testing Questions**
   - "How should I write unit tests for this component?"
   - "What test cases should I consider for [specific functionality]?"
   - "Can you help me set up integration tests for this component?"

5. **Performance Questions**
   - "How can I optimize this component for better performance?"
   - "What are the best practices for handling [specific performance concern]?"
   - "How should I implement lazy loading for this component?"

6. **Error Handling Questions**
   - "What's the best way to handle [specific error case] in this component?"
   - "How should I implement error boundaries for this component?"
   - "Can you show me how to add proper error handling for [specific functionality]?"

Remember to:
- Be specific about your requirements
- Mention any existing patterns or conventions in the project
- Ask for explanations when needed
- Request examples of similar components in the codebase
- Ask about potential edge cases and how to handle them
