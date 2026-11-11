// The signed-in navigation links, shared by the desktop navbar and the phone menu.
export const MAIN_NAV_LINKS = [
  { href: '/homepage', label: 'Home' },
  { href: '/my-signups', label: 'My sign-ups' },
  { href: '/following', label: 'Following' },
] as const;

export const ADD_NONPROFIT_LINK = { href: '/nonprofits/new', label: 'Add a nonprofit' } as const;
