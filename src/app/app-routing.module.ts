import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostListComponent} from './posts/post-list/post-list.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {AuthGuard} from './auth/auth.guard';

import {CommentListComponent} from './comments/comment-list/comment-list.component';
import {CommentCreateComponent} from './comments/comment-create/comment-create.component';
import {ChatComponent} from './web-socket/socket-io/chat.component';
import {MapComponent} from './map/map-google/map.component';
import {UserActivityLevelComponent} from './user_activity_level/user_activity_level.component';
import {DuplicatesInTitlesComponent} from './duplicates_in_titles/duplicates_in_titles.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},

  {path: 'posts', component: PostListComponent},
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},

  { path: 'comments/list/:postid', component: CommentListComponent },
  { path: 'comments/create/:postid', component: CommentCreateComponent, canActivate: [AuthGuard] },
  { path: 'comments/edit/:commentId', component: CommentCreateComponent, canActivate: [AuthGuard] },

  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  { path: 'map', component: MapComponent, canActivate: [AuthGuard]},

  { path: 'd3groupby', component: UserActivityLevelComponent, canActivate: [AuthGuard] },
  { path: 'd3groupby_2', component: DuplicatesInTitlesComponent, canActivate: [AuthGuard] },

  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
