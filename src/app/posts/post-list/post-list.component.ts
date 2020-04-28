import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';

import {Post} from '../post.model';
import {PostService} from '../post.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  unsortedPosts: Post[] = [];
  sortedPosts: Post[] = [];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postSub: Subscription;
  private authStatusSub: Subscription;

  curentCreateTimes: 0;
  currentDeleteTimes: 0;

  searchTermByTitle: string;
  searchTermByContent: string;
  searchTermByName: string;

  sketchs: any[] = [];
  toggleSort = false;

  constructor(public postService: PostService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number, sketchs: any[]}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.unsortedPosts = [...postData.posts];
        this.unsortedPosts.sort((a, b) =>  (a.postDate < b.postDate) ? 1 : -1);

        this.sortedPosts = [...this.unsortedPosts].reverse();
        this.sketchs = postData.sketchs;

        // tslint:disable-next-line:max-line-length
        this.sortedPosts.sort((a, b) =>  (this.sketchs.find(c => c.key === a.id).count < this.sketchs.find(c => c.key === b.id).count) ? 1 : -1);
        this.posts = this.unsortedPosts;
        console.log('sketchs', this.sketchs);
        console.log('unsortedPosts', this.unsortedPosts);
        console.log('sortedPosts', this.sortedPosts);
        console.log('posts', this.posts);
      }, error => {}, () => {});
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.postService.getCms().subscribe((d: any) => {
      this.curentCreateTimes = d.doc[0];
      this.currentDeleteTimes = d.doc[1];
    });
  }
  onSortList(mouseData: MouseEvent) {
    if (this.toggleSort) {
      this.posts = [...this.unsortedPosts];
    } else {
      this.posts = [...this.sortedPosts];
    }
    this.toggleSort = !this.toggleSort;
    console.log('posts', this.posts);
    // this.toggleSort = !this.toggleSort;
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    if (!this.authService.isLogin()) {
      window.location.reload();
      return;
    }
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
