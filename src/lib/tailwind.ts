export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const appLayout = {
  shell: "flex h-screen",
  main: "flex-1 sm:ml-20 lg:ml-32",
  content: "pb-20 sm:pb-0",
} as const;

export const navStyles = {
  shell: "nav-shell-desktop",
  sidebar: "nav-sidebar",
  sidebarInner: "nav-sidebar-inner",
  list: "nav-list",
  item: "nav-item group",
  homeLogo: "nav-home-logo-wrap",
  linkBase: "nav-link group",
  linkInactive: "nav-link nav-link--inactive",
  linkActive: "nav-link nav-link--active",
  desktopModifier: "nav-link--desktop nav-link--desktop-item",
  homeModifier: "nav-link-home",
  mobileShell: "nav-mobile-bar",
  mobileInner: "nav-mobile-inner",
  mobileLinkBase: "nav-mobile-link",
  mobileLinkInactive: "nav-mobile-link nav-mobile-link--inactive",
  mobileLinkActive: "nav-mobile-link nav-mobile-link--active",
  mobileHomeInactive: "nav-mobile-home-link nav-mobile-link--inactive group",
  mobileHomeActive: "nav-mobile-home-link nav-mobile-link--active group",
  mobileHomeLogo: "nav-mobile-home-logo-wrap",
  icon: "flex-shrink-0",
  label: "nav-link-label",
  mobileLabel: "nav-mobile-label",
  mobileIcon: "nav-mobile-icon",
} as const;

export const communityStyles = {
  section:
    "p-6 rounded-lg bg-primary-100 dark:bg-slate-600 border border-primary-200 dark:border-slate-500",
  inner: "text-center",
  title: "text-3xl font-bold mb-3 text-neutral-900 dark:text-neutral-100",
  text: "text-start sm:text-center text-primary-700 dark:text-neutral-300 mb-6",
  actions: "flex flex-col sm:flex-row gap-4 justify-center",
  primaryButton:
    "bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors",
  secondaryButton:
    "bg-white dark:bg-tertiary-800 hover:bg-neutral-50 dark:hover:bg-tertiary-900 text-neutral-600 dark:text-neutral-100 font-medium py-3 px-6 rounded-lg border border-primary-300 dark:border-none transition-colors",
} as const;

export const searchStyles = {
  title: "text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4",
  container: "space-y-4",
  input:
    "block w-full pl-3 pr-12 py-2.5 h-10 text-base border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-900 dark:placeholder-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-text hover:border-slate-400 dark:hover:border-slate-500 transition-colors",
  searchButton:
    "absolute inset-y-0 right-0 pr-3 flex items-center text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed",
  inputIcon: "h-4 w-4",
  dropdownButton:
    "w-full px-3 py-2.5 h-10 text-base border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors text-left flex items-center justify-between",
  dropdownIcon:
    "h-4 w-4 text-slate-900 dark:text-slate-100 transition-transform",
  dropdownMenu:
    "absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md max-h-60 overflow-auto shadow-lg",
  dropdownItem:
    "w-full px-3 py-2.5 text-left text-base hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-600 transition-colors first:rounded-t-md last:rounded-b-md",
  dropdownItemActive:
    "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300",
  dropdownItemInactive: "text-slate-900 dark:text-slate-100",
  results: "text-xs text-slate-600 dark:text-slate-300",
} as const;

export const articleListStyles = {
  section: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
  skeletonCard: "animate-pulse",
  skeletonBlock:
    "bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4",
  skeletonLine: "bg-neutral-200 dark:bg-neutral-700 rounded h-6 mb-2",
  skeletonMeta: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2",
  skeletonMetaShort: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3",
  emptyWrapper: "text-center py-12",
  emptyImage: "flex justify-center mb-8 rounded-lg mx-auto",
  emptyText: "text-xl text-neutral-900 dark:text-neutral-100",
  loadMoreWrap: "mt-8 text-center",
  loadMoreButton:
    "bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2",
  errorText: "text-red-600 dark:text-red-400",
} as const;

export const homeArticleStyles = {
  sectionLoading:
    "p-6 rounded-lg bg-tertiary-100 dark:bg-tertiary-800 border border-tertiary-200 dark:border-tertiary-700",
  sectionLoaded:
    "p-6 rounded-lg bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700",
  titleWrap: "text-center mb-8",
  title: "text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4",
  description:
    "text-lg text-neutral-600 dark:text-neutral-200 max-w-2xl mx-auto",
  descriptionMobile:
    "sm:mx-auto text-lg text-start sm:text-center text-neutral-600 dark:text-neutral-200 max-w-2xl",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  skeletonCard: "animate-pulse",
  skeletonBlock:
    "bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4",
  skeletonLine: "bg-neutral-200 dark:bg-neutral-700 rounded h-6 mb-2",
  skeletonMeta: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2",
  skeletonMetaShort: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3",
  ctaWrap: "text-center mt-8",
  ctaButton: "block w-full",
} as const;

export const articleSidebarStyles = {
  panelBase:
    "bg-slate-100 dark:bg-slate-800 shadow-lg transition-all duration-300 ease-in-out relative h-screen pb-20 sm:pb-0",
  panelOpen:
    "translate-x-0 opacity-100 border-l border-slate-300 dark:border-slate-600",
  panelClosed: "translate-x-full lg:translate-x-0 opacity-90 lg:opacity-100",
  collapseButtonBase:
    "absolute top-4 -left-10 bg-slate-200 dark:bg-slate-600 shadow-xl cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors z-30 focus:outline-none focus:ring-2 focus:ring-primary-500 w-10 h-16 flex items-center justify-center rounded-l-md lg:hidden",
  collapseButtonOpen:
    "border-l border-t border-b border-slate-300 dark:border-slate-600",
  collapseButtonClosed: "border border-slate-300 dark:border-slate-600",
  collapseIcon: "w-4 h-4 text-slate-600 dark:text-slate-300",
  content: "p-6 pt-6 h-full overflow-y-auto",
  sectionTitle: "text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4",
  skeletonWrap: "space-y-4",
  skeletonItem: "animate-pulse",
  skeletonDivider:
    "border-b border-slate-300 dark:border-slate-500 pb-4 animate-pulse",
  skeletonBlock: "h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2",
  skeletonLine: "h-3 bg-slate-300 dark:bg-slate-600 rounded mb-2",
  skeletonShort: "h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/3",
  errorText: "text-sm text-red-600 dark:text-red-400",
  relatedEmpty: "text-sm text-slate-600 dark:text-slate-300 italic",
  divider: "border-t border-slate-300 dark:border-slate-500 mb-6",
  listWrap: "space-y-4",
} as const;

export const articlePageHeaderStyles = {
  wrapper: "text-center mb-12",
  title: "text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4",
  copy: "text-lg text-start text-neutral-600 dark:text-neutral-200 max-w-2xl mx-auto",
} as const;

export const bannerStyles = {
  header:
    "relative flex flex-col items-center text-center overflow-hidden rounded-lg min-h-[400px]",
  video: "absolute inset-0 w-full h-full object-cover z-0",
  overlay:
    "absolute inset-0 z-10 w-full flex flex-col items-center justify-center",
  logoWrap: "h-[125px] sm:h-[225px] w-full flex",
} as const;

export const greetingStyles = {
  wrapper:
    "rounded-lg p-6 bg-tertiary-100 dark:bg-tertiary-800 border border-tertiary-200 dark:border-tertiary-700 flex flex-col items-start sm:items-center py-3 w-full",
  heading:
    "text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-300 text-center",
  text: "text-start sm:text-center text-lg text-neutral-900 dark:text-neutral-300 mt-1",
} as const;

export const errorStyles = {
  shell:
    "min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark p-4",
  card: "flex flex-col items-center text-center max-w-2xl w-full space-y-6",
  image: "flex justify-center mb-8 rounded-lg",
  section: "space-y-4",
  title: "text-2xl font-bold text-foreground-light dark:text-foreground-dark",
  text: "text-lg leading-relaxed text-neutral-700 dark:text-neutral-300",
  actions: "flex flex-col sm:flex-row gap-4 justify-center pt-6",
  primaryButton:
    "px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors",
  secondaryButton:
    "px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors",
  details:
    "w-full mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-left",
  summary:
    "cursor-pointer font-medium text-neutral-800 dark:text-neutral-200 mb-2",
  detailBlock:
    "space-y-2 text-sm font-mono text-neutral-700 dark:text-neutral-300",
  codeBlock:
    "whitespace-pre-wrap text-xs mt-1 p-2 bg-neutral-200 dark:bg-neutral-700 rounded text-neutral-800 dark:text-neutral-200",
} as const;

export const articleCardStyles = {
  card: "bg-primary-50 dark:bg-slate-500 rounded-lg shadow-lg overflow-hidden min-w-0 flex flex-col",
  imageWrap: "h-48 sm:h-64 bg-slate-800",
  image: "w-full h-full rounded-b-none",
  content: "px-6 pb-6 py-4 flex flex-col flex-grow",
  meta: "flex items-center mb-2",
  metaText: "text-neutral-700 dark:text-neutral-200 text-sm",
  title:
    "text-xl lg:text-2xl xl:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3",
  excerpt:
    "text-neutral-700 dark:text-neutral-200 text-base sm:text-lg mb-4 sm:mb-6 line-clamp-3",
  button:
    "bg-tertiary-500 hover:bg-tertiary-600 dark:bg-tertiary-600 dark:hover:bg-tertiary-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors mt-auto inline-block text-center",
  buttonNarrow: "self-center",
} as const;
