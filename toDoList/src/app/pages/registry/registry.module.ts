import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistryPageRoutingModule } from './registry-routing.module';

import { RegistryPage } from './registry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistryPageRoutingModule
  ],
  declarations: [RegistryPage]
})
export class RegistryPageModule {}
