<template>
 <div class="rich-editor-container border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all focus-within:border-brand-gold focus-within:ring-4 focus-within:ring-brand-gold/5">
 <!-- Premium Toolbar -->
 <div v-if="editor" class="toolbar px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-1 items-center sticky top-0 z-10 backdrop-blur-md">
 <div class="group flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm mr-2">
 <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('bold') }" class="toolbar-btn" title="Bold">
 <LucideBold :size="14" />
 </button>
 <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('italic') }" class="toolbar-btn" title="Italic">
 <LucideItalic :size="14" />
 </button>
 <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('underline') }" class="toolbar-btn" title="Underline">
 <LucideUnderline :size="14" />
 </button>
 <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('strike') }" class="toolbar-btn" title="Strikethrough">
 <LucideStrikethrough :size="14" />
 </button>
 </div>

 <div class="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm mr-2">
 <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('heading', { level: 1 }) }" class="toolbar-btn" title="Heading 1">
 <LucideHeading1 :size="14" />
 </button>
 <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('heading', { level: 2 }) }" class="toolbar-btn" title="Heading 2">
 <LucideHeading2 :size="14" />
 </button>
 <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('paragraph') }" class="toolbar-btn" title="Paragraph">
 <LucidePilcrow :size="14" />
 </button>
 </div>

 <div class="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm mr-2">
 <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive({ textAlign: 'left' }) }" class="toolbar-btn" title="Align Left">
 <LucideAlignLeft :size="14" />
 </button>
 <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive({ textAlign: 'center' }) }" class="toolbar-btn" title="Align Center">
 <LucideAlignCenter :size="14" />
 </button>
 <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive({ textAlign: 'right' }) }" class="toolbar-btn" title="Align Right">
 <LucideAlignRight :size="14" />
 </button>
 </div>

 <div class="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm mr-2">
 <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('bulletList') }" class="toolbar-btn" title="Bullet List">
 <LucideList :size="14" />
 </button>
 <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('orderedList') }" class="toolbar-btn" title="Ordered List">
 <LucideListOrdered :size="14" />
 </button>
 </div>

 <div class="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
 <button @click="setLink" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('link') }" class="toolbar-btn" title="Link">
 <LucideLink :size="14" />
 </button>
 <button @click="addImage" class="toolbar-btn" title="Image">
 <LucideImage :size="14" />
 </button>
 <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'bg-brand-gold text-white shadow-md shadow-brand-gold/20': editor.isActive('blockquote') }" class="toolbar-btn" title="Blockquote">
 <LucideQuote :size="14" />
 </button>
 <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" class="toolbar-btn disabled:opacity-30" title="Undo">
 <LucideUndo :size="14" />
 </button>
 <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" class="toolbar-btn disabled:opacity-30" title="Redo">
 <LucideRedo :size="14" />
 </button>
 </div>
 </div>

 <!-- Editor Content -->
 <EditorContent :editor="editor" class="prose prose-sm max-w-none px-6 py-8 min-h-[300px] outline-none" />
 </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
 LucideBold, LucideItalic, LucideUnderline, LucideStrikethrough,
 LucideHeading1, LucideHeading2, LucidePilcrow, 
 LucideAlignLeft, LucideAlignCenter, LucideAlignRight,
 LucideList, LucideListOrdered, LucideLink, LucideImage,
 LucideQuote, LucideUndo, LucideRedo
} from 'lucide-vue-next';

const props = defineProps({
 modelValue: {
 type: String,
 default: ''
 },
 placeholder: {
 type: String,
 default: 'Compose your artisanal narrative...'
 }
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
 content: props.modelValue,
 extensions: [
 StarterKit,
 Underline,
 Link.configure({
 openOnClick: false,
 HTMLAttributes: {
 class: 'text-brand-gold underline font-bold transition-colors hover:text-brand-gold-dark'
 }
 }),
 Image.configure({
 HTMLAttributes: {
 class: 'rounded-2xl shadow-xl border border-slate-100 max-w-full h-auto my-10'
 }
 }),
 TextAlign.configure({
 types: ['heading', 'paragraph'],
 }),
 Placeholder.configure({
 placeholder: props.placeholder,
 }),
 ],
 onUpdate: ({ editor }) => {
 emit('update:modelValue', editor.getHTML());
 },
 editorProps: {
 attributes: {
 class: 'focus:outline-none min-h-[300px]'
 }
 }
});

watch(() => props.modelValue, (value) => {
 if (editor.value && editor.value.getHTML() !== value) {
 editor.value.commands.setContent(value, false);
 }
});

const setLink = () => {
 const previousUrl = editor.value.getAttributes('link').href;
 const url = window.prompt('Destination URL Protocol:', previousUrl);

 if (url === null) return;
 if (url === '') {
 editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
 return;
 }

 editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

const addImage = () => {
 const url = window.prompt('Intelligence Asset URL (Image):');
 if (url) {
 editor.value.chain().focus().setImage({ src: url }).run();
 }
};

onBeforeUnmount(() => {
 editor.value.destroy();
});
</script>

<style>
.toolbar-btn {
 @apply w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 transition-all active:scale-95;
}

.ProseMirror p.is-editor-empty:first-child::before {
 content: attr(data-placeholder);
 float: left;
 color: #adb5bd;
 pointer-events: none;
 height: 0;
 @apply text-xs font-bold tracking-tight italic;
}

.ProseMirror {
 @apply min-h-[300px] text-slate-700 leading-relaxed;
}

.ProseMirror h1 { @apply text-2xl font-black text-slate-900 tracking-tight mb-6; }
.ProseMirror h2 { @apply text-xl font-black text-slate-900 tracking-tight mb-4; }
.ProseMirror blockquote { @apply border-l-4 border-brand-gold pl-6 py-2 italic text-slate-500 bg-slate-50 rounded-r-xl my-8; }
.ProseMirror ul { @apply list-disc pl-6 my-4 space-y-2; }
.ProseMirror ol { @apply list-decimal pl-6 my-4 space-y-2; }
</style>
