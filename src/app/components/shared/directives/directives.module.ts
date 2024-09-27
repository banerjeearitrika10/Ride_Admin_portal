import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { EFDndDirective } from './dragNDrop.directive';
import { EFNumberDirectiveDirective } from './efnumber-directive.directive';
import { EfSrollSpyDirective } from './ef-sroll-spy.directive';



@NgModule({
    declarations: [EFDndDirective, EFNumberDirectiveDirective, EfSrollSpyDirective],
    imports: [],
    exports: [EFDndDirective, EFNumberDirectiveDirective, EfSrollSpyDirective],
})
export class DirectivesModule { }
