export class IssueStyleHelper {
  static getPriorityClasses(priority: string): string {
    const priorityMap: Record<string, string> = {
      Low: 'bg-gray-500',
      Medium: 'bg-yellow-500',
      High: 'bg-orange-500',
      Critical: 'bg-red-500',
    };

    return priorityMap[priority] || 'bg-gray-500';
  }

  static getStatusClasses(status: string): string {
    const statusMap: Record<string, string> = {
      'To Do': 'bg-gray-500',
      'In Progress': 'bg-blue-500',
      Done: 'bg-green-500',
    };

    return statusMap[status] || 'bg-gray-500';
  }

  static getStatusColumnClasses(status: string): string {
    const columnMap: Record<string, string> = {
      'To Do': 'bg-gray-500',
      'In Progress': 'bg-blue-500',
      Done: 'bg-green-500',
    };

    return columnMap[status] || 'bg-gray-500';
  }

  static getPriorityDisplayText(priority: string): string {
    return priority || 'Unknown';
  }

  static getStatusDisplayText(status: string): string {
    return status || 'Unknown';
  }
}
