import { NgModule } from "@angular/core";
import {
  ExtraOptions,
  Routes,
  RouterModule,
  CanActivate
} from "@angular/router";
import { AuthGuardService as AuthGuard } from "./auth/auth-gaurd.service";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { CreateProjectComponent } from "./pages/project/create-project/create-project.component";
import { ProjectDetailsComponent } from "./pages/project/project-details/project-details.component";
import { DocumentRepoComponent } from "./pages/project/project-details/components/document-repo/document-repo.component";
import { CostDisbursementComponent } from "./pages/project/project-details/components/cost-disbursement/cost-disbursement.component";
import { PhysicalProgressComponent } from "./pages/project/project-details/components/physical-progress/physical-progress.component";
import { FundsReceivedComponent } from "./pages/project/project-details/components/funds-received/funds-received.component";
import { ImageGalleryComponent } from "./pages/project/project-details/components/image-gallery/image-gallery.component";
import { AddNoteComponent } from "./pages/project/project-details/components/add-note/add-note.component";
import { MeasurementBookComponent } from "./pages/project/project-details/components/measurement-book/measurement-book.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { FeedbackComponent } from "./pages/project/project-details/components/feedback/feedback.component";
import { PublicLoginComponent } from './pages/public-login/public-login.component';
import { FeedbackOverallComponent } from "./pages/feedback-overall/feedback-overall.component";
import { PublicRegistrationComponent } from "./pages/public-registration/public-registration.component";
import { HomePublicComponent } from "./pages/home-public/home-public.component";
import { AssemblyQuestionsComponent } from "./pages/project/project-details/components/assembly-questions/assembly-questions.component";
import { DohuaGeotagComponent } from './pages/project/dohua-geotag/dohua-geotag.component';
import { MapviewComponent } from './pages/project/mapview/mapview.component';
import { LandDetailsComponent } from "./pages/land-details/land-details.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "public-login",
    component: PublicLoginComponent
  },
  {
    path: 'registration',
    component: PublicRegistrationComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "create-project",
    component: CreateProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "project-details/:projectId",
    component: ProjectDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "funds-received/:projectId",
    component: FundsReceivedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "cost-disbursement/:projectId",
    component: CostDisbursementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "physical-progress/:projectId",
    component: PhysicalProgressComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "project-documents/:projectId",
    component: DocumentRepoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "image-gallery/:projectId",
    component: ImageGalleryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "add-note/:projectId",
    component: AddNoteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "measurement-book/:projectId",
    component: MeasurementBookComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "feedback/:projectId",
    component: FeedbackComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "assembly/:projectId",
    component: AssemblyQuestionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "feedback-overall",
    component: FeedbackOverallComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "home-public",
    component: HomePublicComponent,
  },
  {
    path: "dohua-geotag/:projectId",
    component: DohuaGeotagComponent,
  },
  {
    path: "mapview/:latitude/:longitude",
    component: MapviewComponent,
  },
  {
    path: "land-details",
    component: LandDetailsComponent,
  },
  { path: "**", redirectTo: "home" }
];

const config: ExtraOptions = {
  useHash: true
};

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
