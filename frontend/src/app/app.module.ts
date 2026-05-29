import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {NgxPrintModule} from 'ngx-print';
import {AuthService} from './auth/auth.service';
import { AuthGuardService } from './auth/auth-gaurd.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TovnavComponent } from './components/tovnav/tovnav.component';
import { CreateProjectComponent } from './pages/project/create-project/create-project.component';
import { ProjectDetailsComponent } from './pages/project/project-details/project-details.component';
import { DocumentRepoComponent } from './pages/project/project-details/components/document-repo/document-repo.component';
import { PhysicalProgressComponent } from './pages/project/project-details/components/physical-progress/physical-progress.component';
import { FundsReceivedComponent } from './pages/project/project-details/components/funds-received/funds-received.component';
import { ImageGalleryComponent } from './pages/project/project-details/components/image-gallery/image-gallery.component';
import { UploadComponent } from './pages/project/project-details/components/upload/upload.component';
import { MorrisJsModule } from 'angular-morris-js';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CostDisbursementComponent } from './pages/project/project-details/components/cost-disbursement/cost-disbursement.component';
import { ProjectNavbarComponent } from './pages/project/project-details/components/project-navbar/project-navbar.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddNoteComponent } from './pages/project/project-details/components/add-note/add-note.component';
import { MeasurementBookComponent } from './pages/project/project-details/components/measurement-book/measurement-book.component';
import { PublicRegistrationComponent } from './pages/public-registration/public-registration.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { FeedbackComponent } from './pages/project/project-details/components/feedback/feedback.component';
import { FeedbackOverallComponent } from './pages/feedback-overall/feedback-overall.component';
import { PublicLoginComponent } from './pages/public-login/public-login.component';
import { HomePublicComponent } from './pages/home-public/home-public.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AssemblyQuestionsComponent } from './pages/project/project-details/components/assembly-questions/assembly-questions.component';
import { DohuaGeotagComponent } from './pages/project/dohua-geotag/dohua-geotag.component';
import { MapviewComponent } from './pages/project/mapview/mapview.component';
import { AgmCoreModule } from '@agm/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { LandDetailsComponent } from './pages/land-details/land-details.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    TovnavComponent,
    CreateProjectComponent,
    ProjectDetailsComponent,
    DocumentRepoComponent,
    PhysicalProgressComponent,
    FundsReceivedComponent,
    ImageGalleryComponent,
    UploadComponent,
    CostDisbursementComponent,
    ProjectNavbarComponent,
    AddNoteComponent,
    MeasurementBookComponent,
    PublicRegistrationComponent,
    ResetPasswordComponent,
    FeedbackComponent,
    FeedbackOverallComponent,
    PublicLoginComponent,
    HomePublicComponent,
    AssemblyQuestionsComponent,
    DohuaGeotagComponent,
    MapviewComponent,
    LandDetailsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    MorrisJsModule,
    Ng2SmartTableModule,
    Ng2SearchPipeModule,
    NgxPrintModule,
    InfiniteScrollModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAIlGebBZfP0CmrbofmCkHgjOKrfvW8vOM',
      libraries: ['places']
    })
  ],
  providers: [AuthService, AuthGuardService, DatePipe, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
