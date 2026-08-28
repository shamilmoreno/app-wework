import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-breadcrumb",
	templateUrl: "./breadcrumb.component.html",
	styleUrls: ["./breadcrumb.component.sass"],
})
export class BreadcrumbComponent implements OnInit {
	@Input() title: string | undefined;
	@Input() items: any[] | undefined;
	@Input() active_item: string | undefined;

	constructor() { }

	ngOnInit(): void { }
}
