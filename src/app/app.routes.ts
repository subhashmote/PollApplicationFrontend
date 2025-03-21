import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllPollsComponent } from './all-polls/all-polls.component';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { MyPollsComponent } from './my-polls/my-polls.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { VerifyotpComponent } from './verifyotp/verifyotp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PollanalysisComponent } from './pollanalysis/pollanalysis.component';


export const routes: Routes = [
    { path: '', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent },
    { path:'verify/:userId',component:VerifyotpComponent},
    { path:'reset-password',component:ResetPasswordComponent},

    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', component: HomeComponent }, 
            { path: 'all-polls', component: AllPollsComponent },
            { path: 'create-poll', component: CreatePollComponent },
            { path: 'my-polls', component: MyPollsComponent },
            { path: 'profile', component: ProfileComponent },
            {path:'poll-analysis/:pollId',component:PollanalysisComponent}
        ]
    },

    { path: '**', redirectTo: '' } 
];
