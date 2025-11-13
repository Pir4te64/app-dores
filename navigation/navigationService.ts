import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigation service for navigating outside of React components
 */
export const NavigationService = {
  /**
   * Navigate to a screen
   */
  navigate<T extends object>(name: string, params?: T): void {
    if (navigationRef.isReady()) {
      // @ts-ignore: We know this works
      navigationRef.navigate(name, params);
    } else {
      console.warn('Navigation attempted before navigation is ready');
    }
  },

  /**
   * Go back to the previous screen
   */
  goBack(): void {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  },

  /**
   * Reset the navigation state
   */
  reset(routeName: string, params?: object): void {
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      });
    }
  },

  /**
   * Get the current route name
   */
  getCurrentRoute(): string | undefined {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.name;
    }
    return undefined;
  },
};
