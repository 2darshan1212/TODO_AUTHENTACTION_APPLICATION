// Navigation utility to handle redirects from axios interceptor
let navigateFunction = null;

export const setNavigate = (navigate) => {
  navigateFunction = navigate;
};

export const navigateToLogin = () => {
  if (navigateFunction) {
    navigateFunction('/login', { replace: true });
  } else {
    // Fallback to window.location if navigate not set yet
    window.location.href = '/login';
  }
};

