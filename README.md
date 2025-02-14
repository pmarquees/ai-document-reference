                    AI Document Reference
                    
     🤖                                  📄
  ╭──────╮                          ╭─────────╮
  │ ^_^ │     Your AI-Powered      │ ✓ ✓ ✓  │
  │ === │     Document Editor      │ ✓ ✓ ✓  │
  │[■-■]│    <---------------->    │ ✓ ✓ ✓  │
  ╰──────╯                          ╰─────────╯

# AI Document Reference

An intelligent document editor built with Next.js that combines rich text editing capabilities with AI-powered assistance. This project aims to make document creation and editing more efficient by providing smart suggestions and AI-powered content generation.
Nice
## Features

- 🖊 Rich Text Editor
  - Support for headings, paragraphs, and lists
  - Text formatting (bold, italic, underline)
  - Text alignment options
  - Font family selection
  - Text color and highlighting

- 🤖 AI Integration
  - AI-powered content suggestions
  - Smart command menu (Cmd/Ctrl + /)
  - Context-aware assistance

- 📄 Document Management
  - Create and edit multiple documents
  - Automatic saving
  - Document title editing
  - Document organization

- ⚡️ Modern UI
  - Clean, minimal interface
  - Dark mode support
  - Responsive design
  - Drag and drop functionality

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Editor**: TipTap
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **DnD**: @dnd-kit
- **AI Integration**: OpenAI API

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_api_key_here
```

## Usage

- Use `Cmd/Ctrl + /` to open the command menu
- Use `Cmd/Ctrl + K` to open the AI chat
- Click the AI icon to get AI-powered suggestions
- Drag and drop elements to reorder them
- Use the toolbar for text formatting
- Documents are automatically saved to local storage

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
