export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: string;
  creationDate: string;
  updateDate: string;
}

type IssueStatus = 'To Do' | 'In Progress' | 'Done';
type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
