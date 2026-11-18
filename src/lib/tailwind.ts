// Runs the cn logic for this component.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const appLayout = {
  shell: "min-h-screen",
  main: "flex-1 sm:pl-24 lg:pl-40",
  content: "pb-20 sm:pb-0",
} as const;

export const buttonStyles = {
  primary:
    "px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors",
  secondary:
    "px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white dark:bg-secondary-700 dark:hover:bg-secondary-800 rounded-md transition-colors",
  tertiary:
    "px-4 py-2 bg-tertiary-400 hover:bg-tertiary-500 text-neutral-950 rounded-md transition-colors",
  danger:
    "px-4 py-2 text-white rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-70 bg-[#dc2626] hover:bg-[#b91c1c] dark:bg-[#7f1d1d] dark:hover:bg-[#5b1010]",
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
  toggleButton: "nav-link--toggle",
  homeModifier: "nav-link-home",
  mobileShell: "nav-mobile-bar",
  mobileInner: "nav-mobile-inner",
  mobileLinkBase: "nav-mobile-link",
  mobileLinkInactive: "nav-mobile-link nav-mobile-link--inactive",
  mobileLinkActive: "nav-mobile-link nav-mobile-link--active",
  mobileToggleButton: "nav-mobile-link--toggle",
  mobileHomeInactive: "nav-mobile-home-link nav-mobile-link--inactive group",
  mobileHomeActive: "nav-mobile-home-link nav-mobile-link--active group",
  mobileHomeLogo: "nav-mobile-home-logo-wrap",
  icon: "flex-shrink-0",
  label: "nav-link-label",
  mobileLabel: "nav-mobile-label",
  mobileIcon: "nav-mobile-icon",
} as const;

export const customBuildStyles = {
  section:
    "p-6 rounded-lg bg-primary-100 dark:bg-slate-600 border border-primary-200 dark:border-slate-500",
  inner: "text-center",
  title:
    "text-2xl sm:text-3xl font-bold mb-3 text-foreground-light dark:text-foreground-dark",
  text: "text-start sm:text-center text-foreground-light dark:text-foreground-dark mb-6",
  list: "list-disc space-y-3 pl-6 text-left text-foreground-light dark:text-foreground-dark mb-6",
  actions: "flex flex-col sm:flex-row gap-4 justify-center",
  primaryButton: buttonStyles.primary,
  secondaryButton: buttonStyles.secondary,
  tertiaryButton: buttonStyles.tertiary,
} as const;

export const searchStyles = {
  title:
    "text-xl font-semibold text-foreground-light dark:text-foreground-dark mb-4",
  container: "space-y-4",
  inputWrap: "relative",
  dropdownWrap: "relative",
  input:
    "auth-input block w-full pl-3 pr-12 py-2.5 h-10 text-base border border-slate-300 dark:border-primary-200 rounded-md bg-white dark:bg-primary-100 text-neutral-900 placeholder:text-neutral-500 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-text hover:border-slate-400 dark:hover:border-primary-300 transition-colors",
  searchButton:
    "absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-900 hover:text-slate-600 dark:hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed",
  inputIcon: "h-4 w-4",
  dropdownButton:
    "auth-input w-full px-3 py-2.5 h-10 min-h-[2.5rem] text-base border border-slate-300 dark:border-primary-200 rounded-md bg-white dark:bg-primary-100 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-slate-400 dark:hover:border-primary-300 transition-colors text-left flex items-center justify-between",
  dropdownIcon: "h-4 w-4 text-neutral-900 transition-transform",
  dropdownMenu:
    "absolute z-50 w-full mt-1 bg-white dark:bg-primary-100 border border-slate-300 dark:border-primary-200 rounded-md max-h-60 overflow-auto shadow-lg",
  dropdownItem:
    "w-full px-3 py-2.5 text-left text-base hover:bg-slate-50 dark:hover:bg-primary-100 focus:outline-none focus:bg-slate-50 dark:focus:bg-primary-100 transition-colors first:rounded-t-md last:rounded-b-md",
  dropdownItemActive: "bg-primary-50 dark:bg-primary-100 text-primary-700",
  dropdownItemInactive: "text-neutral-900",
  results: "text-base text-foreground-light dark:text-foreground-dark",
} as const;

export const PostListStyles = {
  section: "grid grid-cols-1 md:grid-cols-2 gap-6",
  sectionLoadingMore: "mt-6",
  skeletonCard: "animate-pulse",
  skeletonBlock:
    "bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4",
  skeletonLine: "bg-neutral-200 dark:bg-neutral-700 rounded h-6 mb-2",
  skeletonMeta: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2",
  skeletonMetaShort: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3",
  emptyWrapper: "text-center py-12",
  emptyImage: "flex justify-center mb-8 rounded-lg mx-auto",
  emptyText: "text-xl text-foreground-light dark:text-foreground-dark",
  loadMoreWrap: "mt-8 text-center",
  loadMoreButton: cn(
    buttonStyles.primary,
    "disabled:bg-primary-400 px-8 py-3 inline-flex items-center gap-2"
  ),
  errorWrap: "mt-8 text-center",
  errorText: "text-red-600 dark:text-red-400",
} as const;

export const homePostStyles = {
  sectionLoading:
    "p-6 rounded-lg bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700",
  sectionLoaded:
    "p-6 rounded-lg bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700",
  titleWrap: "text-center mb-2",
  title:
    "text-2xl sm:text-3xl font-bold text-foreground-light dark:text-foreground-dark mb-2",
  description:
    "text-lg text-foreground-light dark:text-foreground-dark max-w-2xl mx-auto mt-1 mb-4",
  descriptionMobile:
    "text-lg text-start text-foreground-light dark:text-foreground-dark max-w-2xl mx-auto mt-1 mb-4",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  skeletonCard: "animate-pulse",
  skeletonBlock:
    "bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4",
  skeletonLine: "bg-neutral-200 dark:bg-neutral-700 rounded h-6 mb-2",
  skeletonMeta: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2",
  skeletonMetaShort: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3",
  ctaWrap: "mt-8 flex justify-center",
  ctaButton: "inline-flex w-fit",
} as const;

export const PostSidebarStyles = {
  panelBase:
    "bg-primary-100 dark:bg-slate-600 shadow-lg transition-all duration-300 ease-in-out relative h-screen pb-20 sm:pb-0 border border-primary-200 dark:border-slate-500",
  panelOpen:
    "translate-x-0 opacity-100 border-l border-primary-200 dark:border-slate-500",
  panelClosed: "translate-x-full lg:translate-x-0 opacity-90 lg:opacity-100",
  collapseButtonBase:
    "absolute top-4 -left-10 bg-primary-100 dark:bg-slate-600 shadow-xl cursor-pointer hover:bg-primary-200 dark:hover:bg-slate-500 transition-colors z-30 focus:outline-none focus:ring-2 focus:ring-primary-500 w-10 h-16 flex items-center justify-center rounded-l-md lg:hidden border border-primary-200 dark:border-slate-500",
  collapseButtonOpen:
    "border-l border-t border-b border-primary-200 dark:border-slate-500",
  collapseButtonClosed: "border border-primary-200 dark:border-slate-500",
  collapseIcon: "w-4 h-4 text-foreground-light dark:text-foreground-dark",
  content: "p-6 pt-6 h-full overflow-y-auto",
  sectionTitle:
    "text-xl font-semibold text-foreground-light dark:text-foreground-dark mb-4",
  skeletonWrap: "space-y-4",
  skeletonItem: "animate-pulse",
  skeletonDivider:
    "border-b border-primary-200 dark:border-slate-500 pb-4 animate-pulse",
  skeletonBlock: "h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2",
  skeletonLine: "h-3 bg-slate-300 dark:bg-slate-600 rounded mb-2",
  skeletonShort: "h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/3",
  errorText: "text-sm text-red-600 dark:text-red-400",
  relatedEmpty: "text-sm text-slate-600 dark:text-slate-300 italic",
  divider: "my-6 border-0 border-t border-primary-200 dark:border-slate-500",
  listWrap: "space-y-4",
  sectionSpacing: "mb-8",
  sectionErrorSpacing: "mb-8",
  searchWrap: "mb-8",
} as const;

export const PostPageHeaderStyles = {
  wrapper: "text-center mb-12",
  title: "text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4",
  copy: "text-xl text-start text-foreground-light dark:text-foreground-dark max-w-2xl mx-auto",
  actions: "mt-6 flex justify-center",
} as const;

export const viewAllPostsStyles = {
  button: "inline-flex items-center justify-center gap-2 w-fit",
  iconLeft: "w-5 h-5 mr-2",
  iconRight: "w-5 h-5 ml-2",
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
    "rounded-lg p-6 bg-tertiary-100 dark:bg-tertiary-800 border border-tertiary-200 dark:border-tertiary-700 flex flex-col items-start sm:items-center w-full",
  heading:
    "text-2xl sm:text-4xl font-bold text-foreground-light dark:text-foreground-dark text-center",
  text: "text-start sm:text-center text-lg text-foreground-light dark:text-foreground-dark mt-1 mb-4",
} as const;

export const fontStyleTestStyles = {
  section:
    "p-6 rounded-lg bg-primary-100 dark:bg-slate-600 border border-primary-200 dark:border-slate-500",
  title:
    "text-2xl font-bold mb-4 text-foreground-light dark:text-foreground-dark",
  stack: "space-y-4",
  caption: "text-xs text-foreground-light/80 dark:text-foreground-dark/80",
  secondary: "text-sm italic text-foreground-light dark:text-foreground-dark",
  defaultText: "text-base text-foreground-light dark:text-foreground-dark",
  largeText: "text-lg text-foreground-light dark:text-foreground-dark",
  extraLargeText:
    "text-xl font-bold text-foreground-light dark:text-foreground-dark",
  accentText:
    "text-lg font-semibold text-foreground-light dark:text-foreground-dark",
  actions: "flex gap-4 flex-wrap",
  primaryButton: buttonStyles.primary,
  secondaryButton: buttonStyles.secondary,
  tertiaryButton: buttonStyles.tertiary,
  dangerButton: buttonStyles.danger,
} as const;

export const errorStyles = {
  shell:
    "min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark p-4",
  card: "flex flex-col items-center text-center max-w-2xl w-full space-y-6",
  image: "flex justify-center mb-8 rounded-lg",
  section: "space-y-4",
  title: "text-2xl font-bold text-foreground-light dark:text-foreground-dark",
  text: "text-lg leading-relaxed text-foreground-light dark:text-foreground-dark",
  actions: "flex flex-col sm:flex-row gap-4 justify-center pt-6",
  primaryButton: buttonStyles.primary,
  secondaryButton: buttonStyles.secondary,
  details:
    "w-full mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-left",
  summary:
    "cursor-pointer font-medium text-foreground-light dark:text-foreground-dark mb-2",
  detailBlock:
    "space-y-2 text-sm font-mono text-foreground-light dark:text-foreground-dark",
  codeBlock:
    "whitespace-pre-wrap text-xs mt-1 p-2 bg-neutral-200 dark:bg-neutral-700 rounded text-foreground-light dark:text-foreground-dark",
} as const;

export const errorTesterStyles = {
  shell:
    "p-6 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700",
  content: "space-y-4",
  title:
    "text-lg font-semibold text-foreground-light dark:text-foreground-dark mb-2",
  text: "text-foreground-light dark:text-foreground-dark",
  actions: "flex gap-3",
  primaryButton: buttonStyles.danger,
  secondaryButton: buttonStyles.secondary,
  meta: "text-xs text-foreground-light dark:text-foreground-dark space-y-1",
} as const;

export const PostCardStyles = {
  card: "bg-tertiary-100 dark:bg-slate-500 rounded-lg shadow-lg overflow-hidden min-w-0 flex flex-col",
  imageWrap: "h-48 sm:h-64 bg-slate-800",
  image: "w-full h-full rounded-b-none",
  content: "px-6 pb-6 py-4 flex flex-col flex-grow",
  meta: "flex items-center mb-2 justify-between gap-3",
  metaText: "text-foreground-light dark:text-neutral-200 text-sm",
  title:
    "text-xl lg:text-2xl xl:text-3xl font-bold text-foreground-light dark:text-foreground-dark mb-3",
  excerpt:
    "text-foreground-light dark:text-foreground-dark text-base sm:text-lg mb-4 sm:mb-6 line-clamp-3",
  voteBadge:
    "inline-flex items-center gap-2 rounded-full bg-slate-200 px-2 py-1 text-base font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100",
  button: cn(
    buttonStyles.tertiary,
    "mt-auto inline-flex items-center justify-center text-center"
  ),
  buttonIcon: "w-5 h-5 ml-2 text-neutral-950",
  buttonNarrow: "self-center",
} as const;

export const featuredPostStyles = {
  wrapper: "",
  skeletonCard: "animate-pulse",
  skeletonBlock:
    "bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4",
  skeletonLine: "bg-neutral-200 dark:bg-neutral-700 rounded h-8 mb-3",
  skeletonMeta: "bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2",
  skeletonMetaShort:
    "bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3 mb-4",
  skeletonAction: "bg-neutral-200 dark:bg-neutral-700 rounded h-10 w-32",
  imageClassName: "h-60 sm:h-80",
  featuredTitleClassName: "sm:text-3xl md:text-3xl lg:text-3xl",
} as const;

export const recentPostsStyles = {
  shell: "recent-posts ",
  title: "text-xl font-semibold mb-4",
  list: "space-y-3",
  item: "border-b border-gray-200 pb-2",
  itemTitle: "font-medium text-sm",
  itemMeta: "text-xs text-gray-600",
} as const;

export const PostListItemStyles = {
  item: "border-b border-slate-300 dark:border-slate-500 pb-4 ",
  itemNoBorder: "",
  title: "font-medium text-foreground-light dark:text-foreground-dark mb-2",
  titleLink:
    "text-foreground-light dark:text-foreground-dark underline hover:no-underline hover:text-primary-600 dark:hover:text-primary-300 transition-colors",
  excerpt: "text-sm text-foreground-light dark:text-foreground-dark mb-2",
  date: "text-xs text-foreground-light dark:text-foreground-dark",
} as const;

export const POST_FORM_COPY = {
  formTitle: {
    create: "Write a Gardening Post",
    edit: "Edit your Garden Post",
  },
  emptyState: "Sign in to create a gardening Post.",
  labels: {
    title: "Title",
    category: "Category",
    coverImage: "Cover Image",
    chooseFile: "Choose File",
    fileSelected: "File selected",
    noFileSelected: "No file selected",
    youtube: "YouTube",
    summary: "Summary",
    postBody: "Post Body",
    cancel: "Cancel",
    publish: "Publish Post",
    publishPending: "Publishing...",
    save: "Save Changes",
    savePending: "Saving...",
  },
  placeholders: {
    title: "Give your post a searchable name",
    youtube: "https://www.youtube.com/watch?v=...",
    summary: "How would you describe your post?",
    body: "Share what you've learned in detail...",
  },
  uploadHelp: "Upload a JPG, PNG, GIF, or WebP image up to 10 MB.",
} as const;

const postFormInputBase =
  "auth-input w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-lg placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-200 dark:bg-primary-100 dark:placeholder:text-neutral-600";

export const PostFormStyles = {
  shell:
    "mx-auto max-w-4xl space-y-6 rounded-2xl border border-secondary-200 bg-primary-100 p-6 shadow-xl dark:border-secondary-700 dark:bg-secondary-800",
  header: "mt-2 space-y-2",
  title:
    "pt-2 text-center text-2xl font-bold text-foreground-light dark:text-foreground-dark md:text-3xl",
  intro: "text-lg text-foreground-light dark:text-foreground-dark",
  error:
    "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  grid: "grid gap-6 md:grid-cols-2",
  field: "space-y-2",
  fieldFull: "space-y-2 md:col-span-2",
  label:
    "whitespace-nowrap text-lg font-medium text-foreground-light dark:text-foreground-dark",
  input: postFormInputBase,
  textarea:
    "auth-input block w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-lg placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-200 dark:bg-primary-100 dark:placeholder:text-neutral-600",
  selectWrap: "relative",
  selectInput:
    "auth-input w-full appearance-none pr-10 cursor-pointer focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500",
  selectIcon: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",
  editorWrap: "space-y-3",
  postBodyField: "!mt-4 space-y-2 md:col-span-2",
  toolbarRow: "flex items-center gap-2",
  editorToolbar: "flex flex-wrap items-center gap-2",
  editorBodyWrap: "relative",
  editorButton: cn(
    buttonStyles.tertiary,
    "h-auto rounded-md border border-primary-200 px-4 py-1 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
  ),
  uploadButton: cn(
    buttonStyles.tertiary,
    "border border-transparent py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
  ),
  editor:
    "auth-input block min-h-[240px] rounded-lg border border-neutral-300 bg-white px-4 py-3 text-lg shadow-inner outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-primary-200 dark:bg-primary-100",
  previewWrap:
    "mt-3 overflow-hidden rounded-lg border border-primary-200 bg-white dark:border-tertiary-700 dark:bg-tertiary-700",
  previewImage: "h-48 w-full object-cover",
  previewHint:
    "mt-2 text-left text-base text-foreground-light dark:text-foreground-dark",
  actions: "flex justify-end gap-4",
  cancelButton: cn(
    buttonStyles.danger,
    "inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
  ),
  submitButton: cn(
    buttonStyles.primary,
    "inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
  ),
  selectField: "relative",
  fieldRow: "flex items-center gap-2",
  emptyState:
    "rounded-lg border border-primary-200 bg-primary-100 p-8 text-foreground-light dark:border-tertiary-700 dark:bg-tertiary-800 dark:text-foreground-dark",
} as const;

export const PostDetailStyles = {
  shell: "min-h-screen bg-background-light dark:bg-background-dark",
  content: "lg:pr-80 relative",
  inner: "mx-auto max-w-screen-2xl px-6 py-12",
  banner:
    "relative mb-8 h-96 overflow-hidden rounded-lg bg-slate-800 md:h-[500px]",
  bannerImage: "w-full h-full object-cover",
  badge:
    "mb-4 inline-block rounded-full bg-tertiary-400 px-3 py-1 text-sm font-medium text-neutral-950 dark:text-neutral-950",
  title:
    "mb-4 text-4xl font-bold leading-tight text-primary-900 dark:text-primary-100 md:text-5xl",
  meta: "flex items-center text-lg text-neutral-700 dark:text-neutral-200",
  body: "text-xl",
  PostBody: "Post-content",
  footer: "mt-4 border-t border-gray-200 pt-8 dark:border-gray-700",
  buttonRow: "flex flex-wrap items-center justify-center gap-4",
  editButton: cn(
    buttonStyles.tertiary,
    "inline-flex items-center justify-center rounded-lg text-lg font-medium"
  ),
  deleteButton: cn(
    buttonStyles.danger,
    "inline-flex items-center justify-center rounded-lg text-lg font-medium"
  ),
  deleteButtonConfirm: "ring-2 ring-red-300",
  deleteError: "mt-4 text-center text-red-600 dark:text-red-400",
  commentsSection:
    "mt-12 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800",
  commentsHeader:
    "mb-4 text-2xl font-bold text-foreground-light dark:text-foreground-dark",
  commentList: "space-y-4",
  commentItem:
    "rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/60",
  commentMeta: "mb-2 text-sm text-neutral-700 dark:text-neutral-200",
  commentBody: "text-foreground-light dark:text-foreground-dark",
  commentComposer:
    "mb-6 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/60",
  textarea:
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100",
  actionRow: "flex justify-end",
  loadingWrap: "flex justify-center py-4",
  commentDot: "mx-2",
  mutedText: "text-sm text-foreground-light/80 dark:text-foreground-dark/80",
  inlineAction: "inline-flex items-center justify-center",
  primaryAction:
    "inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60",
  voteRow: "mb-8 flex gap-3",
  upvoteButton: cn(
    buttonStyles.primary,
    "inline-flex items-center justify-center font-medium disabled:cursor-not-allowed disabled:opacity-60"
  ),
  downvoteButton: cn(
    buttonStyles.danger,
    "inline-flex items-center justify-center font-medium"
  ),
  voteButtonActive: "ring-2 ring-offset-2 ring-primary-500",
  sidebarWrap: "fixed right-0 top-0 z-40 w-80",
} as const;

export const loadingSpinnerStyles = {
  shell:
    "inline-flex items-center justify-center gap-2 text-center text-lg text-neutral-700",
  icon: "animate-spin text-neutral-950 dark:text-neutral-950",
  text: "whitespace-nowrap text-lg text-neutral-950 dark:text-neutral-950",
  sizes: {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  },
} as const;
