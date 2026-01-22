import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "./lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, Trash2Icon, PencilIcon } from "lucide-react";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch {
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    }
    fetchNote();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete note");
    }
  }

  async function handleSave() {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Title and content required");
      return;
    }
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update note");
    }
  }

  // ✅ UPDATED LOADING UI (FULL SCREEN)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-base-100 border border-base-300 rounded-md p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="btn btn-ghost btn-sm text-base-content/70">
            <ArrowLeftIcon className="w-4" /> Back
          </Link>

          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline btn-sm"
              >
                <PencilIcon className="w-4" /> Edit
              </button>
            )}

            <button
              onClick={handleDelete}
              className="btn btn-outline btn-error btn-sm"
            >
              <Trash2Icon className="w-4" /> Delete
            </button>
          </div>
        </div>

        {/* Title */}
        {isEditing ? (
          <input
            className="input input-bordered w-full text-xl font-semibold mb-4"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
          />
        ) : (
          <h1 className="text-3xl font-semibold mb-4">
            {note.title}
          </h1>
        )}

        {/* Content */}
        {isEditing ? (
          <textarea
            className="textarea textarea-bordered w-full min-h-[220px]"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
          />
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-base-content/80">
            {note.content}
          </p>
        )}

        {/* Save */}
        {isEditing && (
          <div className="flex justify-end mt-6 gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="btn btn-primary btn-sm"
            >
              Save Changes
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default NoteDetailPage;
