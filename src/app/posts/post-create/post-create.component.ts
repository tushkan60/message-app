import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  messageForm: FormGroup;

  constructor(public postsService: PostService) {}

  ngOnInit() {
    this.messageForm = new FormGroup({
      title: new FormControl(null),
      content: new FormControl(null),
    });
  }

  onAddPost() {
    if (this.messageForm.invalid) {
      return;
    }
    const post: Post = this.messageForm.value;
    this.postsService.addPost(post);
    this.messageForm.reset();
    this.messageForm.markAllAsTouched();
    Object.keys(this.messageForm.controls).forEach((key) => {
      this.messageForm.get(key).setErrors(null);
    });
  }
}
