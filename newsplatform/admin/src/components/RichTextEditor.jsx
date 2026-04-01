import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

const ToolbarButton = ({ onClick, active, title, children }) => (
  <button type="button" onClick={onClick} title={title}
    className={`p-1.5 rounded text-sm font-medium transition-colors ${active ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'}`}>
    {children}
  </button>
)

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: { class: 'focus:outline-none' }
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value])

  if (!editor) return null

  const addImage = () => {
    const url = prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const setLink = () => {
    const url = prompt('Link URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
    else editor.chain().focus().unsetLink().run()
  }

  const tools = [
    { label: 'B', title: 'Bold', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { label: 'I', title: 'Italic', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { label: 'H2', title: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { label: 'H3', title: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { label: '❝', title: 'Blockquote', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { label: '• List', title: 'Bullet list', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { label: '1. List', title: 'Ordered list', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { label: '🔗', title: 'Link', action: setLink, active: editor.isActive('link') },
    { label: '🖼', title: 'Image', action: addImage, active: false },
    { label: '↩', title: 'Undo', action: () => editor.chain().focus().undo().run(), active: false },
    { label: '↪', title: 'Redo', action: () => editor.chain().focus().redo().run(), active: false },
  ]

  return (
    <div className="border border-ink-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-crimson-500 focus-within:border-transparent transition-all">
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-ink-50 border-b border-ink-200">
        {tools.map((tool, i) => (
          <ToolbarButton key={i} onClick={tool.action} active={tool.active} title={tool.title}>
            {tool.label}
          </ToolbarButton>
        ))}
      </div>
      <div className="p-4 bg-white min-h-64">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
