'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Heading from '@tiptap/extension-heading';
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
  problemDesc?: string | null,
  handleInputChange: (field: keyof QuestionsDataProps, value: string) => void;
};

const QuestionEditor = ({ problemDesc, handleInputChange }: QuestionEditorProps) => {

  const editor = useEditor({
    extensions: [StarterKit,
      TextStyle,
      Dropcursor,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraf']
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6]
      })

    ],
    content: problemDesc ? problemDesc : "",
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      handleInputChange("problemDesc", updatedContent)
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  })


  if (!editor) {
    return null
  }
  return (
    <>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-4 outline-none focus:ring-2 focus:ring-blue-500 rounded bg-gray-50 shadow-md min-h-[150px]"
      />
    </>
  )
}

export default QuestionEditor

