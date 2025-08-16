import { Issue } from './issue.interface';

export interface KanbanColumnConfig {
  key: string;
  title: string;
  status: string;
  color: string;
  issues: Issue[];
}
