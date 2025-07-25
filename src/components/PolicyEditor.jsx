import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const PolicyEditor = ({ title }) => {
  const [status, setStatus] = useState('draft');
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  // Fetch existing content and version history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [versionsRes, contentRes] = await Promise.all([
          axios.get(`/api/policies/${title}/versions`),
          axios.get(`/api/policies/${title}`),
        ]);

        setVersions(versionsRes.data);
        editor?.commands.setContent(contentRes.data?.content || '');
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (editor) fetchData();
  }, [title, editor]);

  const saveVersion = async () => {
    const content = editor?.getHTML() || '';
    await axios.post(`/api/policies/${title}`, { content, status });
    alert('Saved!');
  };

  return (
    <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
      <h2 className="text-xl font-semibold capitalize">{title.replace(/-/g, ' ')}</h2>

      {loading ? (
        <p>Loading editor...</p>
      ) : (
        <EditorContent editor={editor} className="border p-2 rounded min-h-[200px]" />
      )}

      <div className="flex gap-4 items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button
          onClick={saveVersion}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      <div>
        <h3 className="font-medium">Version History</h3>
        <ul className="list-disc pl-5 text-sm">
          {versions.map((v, i) => (
            <li key={i}>
              {v.status} — {new Date(v.updatedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PolicyEditor;
