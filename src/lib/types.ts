export interface NoteType {
  id?: number;
  name: string;
  createdAt: Date | string;
  imageUrl?: string | null;
  userId: string;
  editorState?: string | null;
}
