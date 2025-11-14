import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator as createStack } from '@react-navigation/stack';

import Cart from '~/assets/cart.svg';
import Chicken from '~/assets/chicken.svg';
import HomeIcon from '~/assets/home.svg';
import User from '~/assets/profile.svg';
import { EnhancedTabBarIcon } from '~/presentation/components/enhancedTabBarIcon';
import { useCart } from '~/presentation/context/cartContext';
import { AuthScreen } from '~/presentation/screens/auth';
import Checkout from '~/presentation/screens/checkout';
import { CommerceDetail } from '~/presentation/screens/commerceDetail';
import { CommerceList } from '~/presentation/screens/commerceList';
import Home from '~/presentation/screens/home';
import CategoryList from '~/presentation/screens/categoryList';
import AllMenus from '~/presentation/screens/allMenus';
import MenuByCategory from '~/presentation/screens/menuByCategory';
import { MenuItem } from '~/presentation/screens/menuItem';
import { OrderDetail } from '~/presentation/screens/orderDetail';
import { OrderList } from '~/presentation/screens/orderList';
import { Privacy } from '~/presentation/screens/privacy';
import Profile from '~/presentation/screens/profile';
import { ProfileAddresses } from '~/presentation/screens/profileAddressList';
import { ProfileDetail } from '~/presentation/screens/profileDetail';
import { ResetPassword } from '~/presentation/screens/resetPassword';
import Subcategories from '~/presentation/screens/subcategories';
import { Terms } from '~/presentation/screens/terms';
import { getThemedStyles } from '~/presentation/styles/theme';

const Stack = createStack();
const Tab = createBottomTabNavigator();

const defaultStackScreenOptions = {
  headerShown: false,
};

interface ScreenConfig {
  name: string;
  component: React.ComponentType<any>;
  options?: Record<string, any>;
}

const createStackNavigator = (screens: ScreenConfig[], initialRouteName: string) => {
  return () => {
    return (
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={defaultStackScreenOptions}>
        {screens.map((screen: ScreenConfig) => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={screen.options || {}}
          />
        ))}
      </Stack.Navigator>
    );
  };
};

const homeScreens: ScreenConfig[] = [
  { name: 'HomeScreen', component: Home, options: { title: 'Inicio' } },
  {
    name: 'AllMenus',
    component: AllMenus,
    options: {
      headerShown: true,
      headerBackTitle: '',
      headerShadowVisible: false,
      title: 'Menús',
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'CategoryList',
    component: CategoryList,
    options: {
      headerShown: true,
      headerBackTitle: '',
      headerShadowVisible: false,
      title: 'Categorías',
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'Subcategories',
    component: Subcategories,
    options: {
      headerShown: true,
      headerBackTitle: '',
      headerShadowVisible: false,
      title: 'Categorías',
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'MenuByCategory',
    component: MenuByCategory,
    options: {
      headerShown: true,
      headerBackTitle: '',
      headerShadowVisible: false,
      title: 'Menús',
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'CommerceDetail',
    component: CommerceDetail,
    options: {
      headerShown: true,
      title: '',
      headerBackTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'CommerceList',
    component: CommerceList,
    options: {
      headerShown: true,
      title: '',
      headerBackTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'MenuItem',
    component: MenuItem,
    options: {
      headerShown: false,
      title: '',
      headerBackTitle: '',
      headerShadowVisible: false,
      backgroundColor: '#FFFCFA',
    },
  },
];
const orderScreen: ScreenConfig[] = [
  {
    name: 'OrderList',
    component: OrderList,
    options: {
      headerShown: false,
      title: 'Mis Pedidos',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'OrderDetail',
    component: OrderDetail,
    options: {
      headerShown: true,
      title: '',
      headerBackTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
];
const checkoutScreens: ScreenConfig[] = [
  {
    name: 'CheckoutScreen',
    component: Checkout,
    options: {
      headerShown: true,
      title: 'Carrito',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'CheckoutList',
    component: OrderList,
    options: {
      headerShown: true,
      title: 'Mis Pedidos',
      headerTintColor: '#FFFCFA',
      headerStyle: { backgroundColor: '#1a3260' },
    },
  },
  {
    name: 'CheckoutDetail',
    component: OrderDetail,
    options: {
      headerShown: true,
      title: 'Pedidos',
      headerTintColor: '#FFFCFA',
      headerBackTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#1a3260' },
    },
  },
];

const profileScreens: ScreenConfig[] = [
  {
    name: 'ProfileScreen',
    component: Profile,
    options: {
      title: 'Perfil',
      headerShown: true,
      headerBackTitle: false,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'ProfileDetail',
    component: ProfileDetail,
    options: {
      title: 'Datos personales',
      headerTitleAlign: 'left',
      headerShown: true,
      headerShadowVisible: false,
      headerBackTitle: false,
      headerStyle: {
        backgroundColor: '#fffcfa',
      },
    },
  },
  {
    name: 'ProfileAddresses',
    component: ProfileAddresses,
    options: {
      headerShown: true,
      title: 'Direcciones',
      headerBackTitle: false,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'Terms',
    component: Terms,
    options: {
      headerShown: true,
      title: '',
      headerBackTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'Privacy',
    component: Privacy,
    options: {
      headerShown: true,
      title: '',
      headerBackTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
];

const HomeStackScreen = createStackNavigator(homeScreens, 'HomeScreen');
const OrderStackScreen = createStackNavigator(orderScreen, 'OrderList');
const CheckoutStackScreen = createStackNavigator(checkoutScreens, 'CheckoutScreen');
const ProfileStackScreen = createStackNavigator(profileScreens, 'ProfileScreen');

export const AuthNavigator = () => {
  const theme = getThemedStyles();
  return (
    <Stack.Navigator initialRouteName="Authentication" screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="Authentication" component={AuthScreen} options={{}} />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: true,
          headerTitle: 'Recuperar contraseña',
          headerTintColor: theme.backgroundColor,
          headerStyle: {
            backgroundColor: theme.primaryColor,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { items } = useCart();
  const theme = getThemedStyles();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.primaryColor,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 16,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarItemStyle: {
          height: 54,
          borderRadius: 16,
          marginHorizontal: 4,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          color: '#FFFFFF',
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          title: 'Inicio',
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          tabBarLabelStyle: { color: '#FFFFFF' },
          tabBarIcon: ({ color, size, focused }) => (
            <EnhancedTabBarIcon icon={HomeIcon} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="OrderList"
        component={OrderStackScreen}
        options={{
          title: 'Pedidos',
          headerTintColor: theme.backgroundColor,
          headerShown: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.backgroundColor,
          },
          tabBarLabelStyle: { color: '#FFFFFF' },
          tabBarIcon: ({ color, size, focused }) => (
            <EnhancedTabBarIcon
              icon={Chicken}
              color={color}
              size={size}
              focused={focused}
              isChicken
            />
          ),
        }}
      />
      {items.length > 0 && (
        <Tab.Screen
          name="Checkout"
          component={CheckoutStackScreen}
          options={{
            title: 'Carrito',
            headerTintColor: theme.backgroundColor,
            headerShown: false,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: theme.primaryColor,
            },
            tabBarLabelStyle: { color: '#FFFFFF' },
            tabBarIcon: ({ color, size, focused }) => (
              <EnhancedTabBarIcon
                icon={Cart}
                color={color}
                size={size}
                focused={focused}
                badge={items.length}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          title: 'Perfil',
          headerTintColor: theme.backgroundColor,
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.primaryColor,
          },
          tabBarLabelStyle: { color: '#FFFFFF' },
          tabBarIcon: ({ color, size, focused }) => (
            <EnhancedTabBarIcon icon={User} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
