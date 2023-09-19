import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  messageForm: FormGroup;
  private isEdit: boolean = false;
  private id: string;
  isLoading: boolean = false;
  imagePreview: string;

  constructor(
    public postsService: PostService,
    public route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit() {
    this.messageForm = this.createForm(null, null, null, null);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isEdit = true;
        this.id = paramMap.get('id');
      } else {
        this.isEdit = false;
        this.id = null;
      }
    });

    if (this.id) {
      this.isLoading = true;
      this.postsService.getPost(this.id).subscribe((res) => {
        const title = res.post.title;
        const content = res.post.content;
        const imagePath = res.post.imagePath;
        this.isLoading = false;
        this.messageForm = this.createForm(title, content, null, imagePath);
      });
    }
  }

  onSavePost() {
    if (this.messageForm.invalid && !this.messageForm.get('imagePath').value) {
      return;
    }

    const post: Post = this.messageForm.value;

    if (this.isEdit) {
      post._id = this.id;
      this.postsService.updatePost(post);
    } else {
      this.postsService.addPost(post);
    }
    this.isLoading = false;
    this.router.navigate(['/']);
  }

  onImageLoaded(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.messageForm.patchValue({ image: file });
    this.messageForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  createForm(title: string, content: string, image: File, imagePath: string) {
    return new FormGroup({
      title: new FormControl(title, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(content, { validators: [Validators.required] }),
      image: new FormControl(image, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      imagePath: new FormControl(imagePath),
    });
  }
}
