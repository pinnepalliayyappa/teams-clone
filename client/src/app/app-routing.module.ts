import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoSharingComponent } from './video-sharing/video-sharing.component';

const routes: Routes = [
  { path :'',component : VideoSharingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
