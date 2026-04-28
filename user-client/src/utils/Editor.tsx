import React, { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { UploadAdapter } from './EditorUploadAdapter';
import '../styles/editor.scss';

interface EditorProps {
  contents: string;
  handleChangeContents: (data: string) => void;
  handleGetEditor: (editor: any) => void;
}

const Editor: React.FC<EditorProps> = ({ 
  contents, 
  handleChangeContents, 
  handleGetEditor 
}) => {
  const [isReady, setIsReady] = useState(false);
  const editorRef = useRef<any>(null);

  // 1. Svelte의 <div> -> <p> 정규식 로직
  const formatHtml = (html: string) => {
    return html.replace(/<div/g, '<p').replace(/<\/div/g, '</p');
  };

  // 2. 업로드 어댑터 플러그인
  const uploadAdapterPlugin = (editor: any) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader);
    };
  };

  const editorConfig = {
    menuBar: { isVisible: false },
    image: {
      toolbar: ['imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
      insert: { type: 'auto' }
    },
    extraPlugins: [uploadAdapterPlugin],
    language: "ko",
    licenseKey: 'GPL'
  };

  // 3. 외부에서 contents가 바뀔 때 에디터 데이터 동기화 (Svelte의 $: 로직)
  useEffect(() => {
    if (isReady && editorRef.current && contents !== editorRef.current.getData()) {
      editorRef.current.setData(formatHtml(contents));
    }
  }, [contents, isReady]);

  return (
    <div className="ck-editor-container">
      <CKEditor
        editor={DecoupledEditor}
        config={editorConfig}
        data={formatHtml(contents)}
        onReady={(editor) => {
          editorRef.current = editor;
          
          // Svelte의 appendChild 로직 (툴바/메뉴바 배치)
          const toolbarElement = editor.ui.view.toolbar.element;
          const editableElement = editor.ui.getEditableElement();
          const menuBarElement = editor.ui.view.menuBarView.element;

          const container = editableElement.parentElement;
          if (container) {
            container.insertBefore(menuBarElement, editableElement);
            container.insertBefore(toolbarElement, editableElement);
          }

          handleGetEditor(editor);
          setIsReady(true);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          handleChangeContents(data);
        }}
      />
    </div>
  );
};

export default Editor;