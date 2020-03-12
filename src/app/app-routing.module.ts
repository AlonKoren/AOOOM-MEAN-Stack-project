import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostListComponent} from './posts/post-list/post-list.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {AuthGuard} from './auth/auth.guard';

import {CommentListComponent} from './comments/comment-list/comment-list.component';
import {CommentCreateComponent} from './comments/comment-create/comment-create.component';
import {ChatComponent} from './web-socket/socket-io/chat.component';


const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},

  { path: 'comments/list/:postid', component: CommentListComponent },
  { path: 'comments/create/:postid', component: CommentCreateComponent, canActivate: [AuthGuard] },
  { path: 'comments/edit/:commentId', component: CommentCreateComponent, canActivate: [AuthGuard] },

  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},

  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
