import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator as createStack } from '@react-navigation/stack';
import { Home as HomeIcon, ClipboardList, ShoppingCart, User as UserIcon } from 'lucide-react-native';
import { Text } from 'react-native';

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
import CardPayment from '~/presentation/screens/cardPayment';
import SavedCards from '~/presentation/screens/savedCards';
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
      headerBackTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'CheckoutDetail',
    component: OrderDetail,
    options: {
      headerShown: true,
      title: 'Detalle',
      headerBackTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#fffcfa' },
    },
  },
  {
    name: 'CardPayment',
    component: CardPayment,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'SavedCards',
    component: SavedCards,
    options: {
      headerShown: false,
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
          paddingTop: 10,
          paddingBottom: 30,
          paddingHorizontal: 16,
          height: 85,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 15,
        },
        tabBarItemStyle: {
          paddingTop: 6,
          paddingBottom: 2,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 6,
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
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: focused ? '700' : '500', marginTop: 4 }}>Inicio</Text>
          ),
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
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: focused ? '700' : '500', marginTop: 4 }}>Pedidos</Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <EnhancedTabBarIcon
              icon={ClipboardList}
              color={color}
              size={size}
              focused={focused}
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
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: focused ? '700' : '500', marginTop: 4 }}>Carrito</Text>
            ),
            tabBarIcon: ({ color, size, focused }) => (
              <EnhancedTabBarIcon
                icon={ShoppingCart}
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
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: focused ? '700' : '500', marginTop: 4 }}>Perfil</Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <EnhancedTabBarIcon icon={UserIcon} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
