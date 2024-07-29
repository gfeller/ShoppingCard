import {effect, inject, Signal, TemplateRef, untracked, ViewContainerRef} from "@angular/core";
import {UiService} from "../../core/services/ui.service";
import {TemplatePortal} from "@angular/cdk/portal";

export function useMenu(menu: "sub" | "header", template: Signal<TemplateRef<Element> | undefined>){

  const uiService = inject(UiService)
  const viewContainerRef = inject(ViewContainerRef);

  const setter = menu === "header" ? uiService.setHeaderMenu.bind(uiService) : uiService.setSubMenu.bind(uiService)

  effect((onCleanup) => {
    //debugger;
    const portalTemplate = template();

    untracked(() => {
      if(portalTemplate !== undefined){
        setter(new TemplatePortal(portalTemplate, viewContainerRef));
      }
    })

    onCleanup(() => {
      setter(null);
    })
  });
}
