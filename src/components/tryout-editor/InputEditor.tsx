'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Heading from '@tiptap/extension-heading';
import ImageResize from 'tiptap-extension-resize-image';
import { Toolbar } from './Toolbar'


interface QuestionsDataProps {
  tryoutId?: number | null | undefined;
  questionNumber?: number | null | undefined;
  subtest: string;
  problemDesc?: string | null;
  option?: string | null
  questionImagePath?: string | null;
  answer?: string | null;
  explanation: string | null,
  explanationImagePath: string | null;
  linkPath: string | null;
}

type QuestionEditorProps = {
  input?: string | null,
  handleInputChange: (field: keyof QuestionsDataProps, value: string) => void;
  type: "problemDesc" | "explanation";
};

const InputEditor = ({ input, handleInputChange, type }: QuestionEditorProps) => {

  const editor = useEditor({
    extensions: [StarterKit,
      TextStyle,
      Dropcursor,
      ImageResize,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6]
      })

    ],
    content: input ? input : "",
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      handleInputChange(type, updatedContent)
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  })


  if (!editor) {
    return null
  }
  return (
    <div className="flex flex-col justify-center">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
      />
    </div>

  )
}

export default InputEditor

