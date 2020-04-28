import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';
import {mimeType} from './mime-type.validator';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create-component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;
  latitude: string;
  longitude: string;

  constructor(public  postsService: PostService, public route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.getPosition().then(position => {
      this.latitude = String(position.lat);
      this.longitude = String(position.lng);
    });

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id ,
            title : postData.title ,
            content : postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
            userName: null,
            postDate: null,
            latitude: postData.latitude,
            longitude: postData.longitude
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    }, error => {}, () => {});
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (!this.authService.isLogin()) {
      window.location.reload();
      return;
    }
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.getPosition().then(position => {
      this.latitude = String(position.lat);
      this.longitude = String(position.lng);
    });

    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image, this.latitude, this.longitude);
    } else {
      this.postsService.updatePost
        (this.postId, this.form.value.title, this.form.value.content, this.form.value.image, this.latitude, this.longitude);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        err => {
          resolve({ lng: null, lat: null });
        });
    });

  }
}
