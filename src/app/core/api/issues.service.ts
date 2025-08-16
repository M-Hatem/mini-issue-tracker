import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.interface';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private readonly apiUrl = 'http://localhost:3000/issues';

  constructor(private http: HttpClient) {}

  getIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl);
  }

  getIssuesForInfiniteScroll(offset: number, limit: number): Observable<Issue[]> {
    const httpParams = new HttpParams()
      .set('_start', offset.toString())
      .set('_limit', limit.toString());

    return this.http.get<Issue[]>(this.apiUrl, { params: httpParams });
  }

  searchIssuesByTitle(
    searchTerm: string,
    offset: number = 0,
    limit: number = 12
  ): Observable<Issue[]> {
    let httpParams = new HttpParams()
      .set('_start', offset.toString())
      .set('_limit', limit.toString());

    if (searchTerm && searchTerm.trim()) {
      httpParams = httpParams.set('title_like', searchTerm.trim());
    }

    return this.http.get<Issue[]>(this.apiUrl, { params: httpParams });
  }

  getIssueById(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`);
  }

  createIssue(issue: Omit<Issue, 'id'>): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, issue);
  }

  updateIssue(id: number, issue: Partial<Issue>): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${id}`, issue);
  }

  deleteIssue(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
