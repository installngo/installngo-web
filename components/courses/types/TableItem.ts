export interface Item {
  id: string;
  name: string;
  type: "file" | "folder";
  createdAt: string;
  fileCount?: number;
  size?: string;
  parentId?: string | null;
}