import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(public http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://127.0.0.1:3000/api/posts',
      )
      .subscribe((res) => {
        this.posts = res.posts;

        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  createPostData(title: string, content: string, image: string, post: Post) {
    const postData = new FormData();
    postData.append(title, post.title);
    postData.append(content, post.content);
    postData.append(image, post.image, post.title);
    return postData;
  }

  getPost(id: string) {
    return this.http.get<{ message: string; post: Post }>(
      `http://127.0.0.1:3000/api/posts/${id}`,
    );
  }

  addPost(post: Post) {
    const postData = this.createPostData('title', 'content', 'image', post);
    this.http
      .post<{ message: string; post: Post }>(
        'http://127.0.0.1:3000/api/posts',
        postData,
      )
      .subscribe((res) => {
        this.posts.push(res.post);
        this.postUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.http
      .delete(`http://127.0.0.1:3000/api/posts/${id}`)
      .subscribe((res) => {
        const updatedPosts = this.posts.filter((post) => post._id !== id);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  updatePost(post: Post) {
    let postData: Post | FormData;
    if (!post.image) {
      postData = post;
    } else {
      postData = this.createPostData('title', 'content', 'image', post);
    }
    console.log(postData);
    this.http
      .patch<{ message: string; post: Post }>(
        `http://127.0.0.1:3000/api/posts/${post._id}`,
        postData,
      )
      .subscribe((res) => {
        const updatedPosts = this.posts.map((post) => {
          if (res.post._id === post._id) {
            return res.post;
          } else {
            return post;
          }
        });
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }
}
