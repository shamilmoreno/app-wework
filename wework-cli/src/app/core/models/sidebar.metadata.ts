export class SideMetadataModel {
  path?: string;
  title?: string;
  moduleName?: string;
  iconType?: string;
  icon?: string;
  class?: string;
  groupTitle?: boolean;
  badge?: string;
  badgeClass?: string;
  role?: string[];
  submenu?: SideMetadataModel[];
}
