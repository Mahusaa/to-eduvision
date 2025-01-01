import React from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  Undo2,
  Redo2,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  ImagePlus,
} from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip';



type ToolbarProps = {
  editor: Editor;
};

function Toolbar({ editor }: ToolbarProps) {
  const tools = [
    {
      group: 'headings',
      items: [
        {
          icon: Heading1,
          tooltip: 'Heading 1',
          isActive: () => editor.isActive('heading', { level: 1 }),
          onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          icon: Heading2,
          tooltip: 'Heading 2',
          isActive: () => editor.isActive('heading', { level: 2 }),
          onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          icon: Heading3,
          tooltip: 'Heading 3',
          isActive: () => editor.isActive('heading', { level: 3 }),
          onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
      ],
    },
    {
      group: 'formatting',
      items: [
        {
          icon: Bold,
          tooltip: 'Bold',
          isActive: () => editor.isActive('bold'),
          onClick: () => editor.chain().focus().toggleBold().run(),
        },
        {
          icon: Italic,
          tooltip: 'Italic',
          isActive: () => editor.isActive('italic'),
          onClick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          icon: Strikethrough,
          tooltip: 'Strike',
          isActive: () => editor.isActive('strike'),
          onClick: () => editor.chain().focus().toggleStrike().run(),
        },
      ],
    },
    {
      group: 'alignment',
      items: [
        {
          icon: AlignLeft,
          tooltip: 'Align Left',
          isActive: () => editor.isActive({ textAlign: 'left' }),
          onClick: () => editor.chain().focus().setTextAlign('left').run(),
        },
        {
          icon: AlignCenter,
          tooltip: 'Center',
          isActive: () => editor.isActive({ textAlign: 'center' }),
          onClick: () => editor.chain().focus().setTextAlign('center').run(),
        },
        {
          icon: AlignRight,
          tooltip: 'Align Right',
          isActive: () => editor.isActive({ textAlign: 'right' }),
          onClick: () => editor.chain().focus().setTextAlign('right').run(),
        },
        {
          icon: AlignJustify,
          tooltip: 'Justify',
          isActive: () => editor.isActive({ textAlign: 'justify' }),
          onClick: () => editor.chain().focus().setTextAlign('justify').run(),
        },
      ],
    },
    {
      group: "List",
      items: [
        {
          icon: List,
          tooltip: 'List',
          isActive: () => editor.isActive({ undo: 'undo' }),
          onClick: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          icon: ListOrdered,
          tooltip: 'Ordered List',
          isActive: () => editor.isActive({ undo: 'undo' }),
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
        },

      ]
    },
    {
      group: "Undo Redo",
      items: [
        {
          icon: ImagePlus,
          tooltip: "Add Image",
          isActive: () => editor.isActive({ undo: 'undo' }),
          onClick: () => {
            const filePath = prompt("Enter the image path")
            if (filePath) {
              editor.chain().focus().setImage({ src: filePath }).run();
            }
          },
        },
        {
          icon: Undo2,
          tooltip: 'Undo',
          isActive: () => editor.isActive({ undo: 'undo' }),
          onClick: () => editor.chain().focus().undo().run(),
        },
        {
          icon: Redo2,
          tooltip: 'Redo',
          isActive: () => editor.isActive({ undo: 'undo' }),
          onClick: () => editor.chain().focus().redo().run(),
        },

      ]
    }
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50 sticky top-0 z-10 w-full border-b flex justify-center">
        <div className="flex flex-wrap items-center gap-1 p-2">
          {tools.map((group, index) => (
            <div key={group.group} className="flex items-center gap-1">
              {group.items.map((item) => (
                <Tooltip key={item.tooltip}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={item.onClick}
                      className={`h-8 w-8 p-0 ${item.isActive() ? 'bg-muted-foreground/20' : ''
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="sr-only">{item.tooltip}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {item.tooltip}
                  </TooltipContent>
                </Tooltip>
              ))}
              {index < tools.length - 1 && (
                <Separator orientation="vertical" className="h-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export { Toolbar };

