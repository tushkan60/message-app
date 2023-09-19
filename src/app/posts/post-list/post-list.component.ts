import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postSubscription: Subscription;
  isLoading: boolean = false;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postSubscription = this.postService
      .getPostUpdateListener()
      .subscribe((posts) => {
        this.posts = posts;
        this.isLoading = false;
      });

    this.postService.getPosts();
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
    this.isLoading = false;
  }
}
