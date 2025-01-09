'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'

const OptionInput = ({ optionLabel, index, handleInputChange }: {
  optionLabel: string;
  index: number;
  handleInputChange: (index: number, value: string) => void
}) => {

  const editor = useEditor({
    extensions: [Document, Text, Paragraph
    ],
    content: optionLabel ? optionLabel : "",
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      handleInputChange(index, updatedContent)
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  })

  if (!editor) {
    return null
  }
  return (
    <EditorContent
      editor={editor}
      className="w-full"
    />
  )
}

export default OptionInput;


