import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  Camera,
  ChevronRight,
  User as UserIcon,
  MapPin,
  FileText,
  Shield,
  LogOut,
  ShoppingBag,
  Heart,
  Star,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

import { AvatarData } from '~/domain/repositories/iuserRepository';
import { UserService } from '~/domain/services/userService';
import { AvatarGrid } from '~/presentation/components/avatarModal';
import { GlobalText } from '~/presentation/components/GlobalText';
import { useUser } from '~/presentation/context/userContext';

type RootStackParamList = {
  ProfileDetail: undefined;
  ProfileAddresses: undefined;
  Terms: undefined;
  Privacy: undefined;
};

const PRIMARY_RED = '#DA2919';

export default function Profile() {
  const [showAvatarGrid, setShowAvatarGrid] = useState<boolean>(false);
  const [images, setImages] = useState<AvatarData[]>();
  const router = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const userService = UserService.getInstance();

  const handleAvatarPress = async () => {
    try {
      const imgs = await userService.getAvatars();
      setImages(imgs);
      setShowAvatarGrid(true);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los avatares');
    }
  };

  const handleLogout = async () => {
    Alert.alert('¿Estás seguro?', 'Tendrás que volver a iniciar sesión', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Si',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const ProfileMenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    showBorder = true,
  }: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showBorder?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.menuItem, showBorder && styles.menuItemBorder]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        <Icon size={20} color={PRIMARY_RED} />
      </View>
      <View style={styles.menuTextContainer}>
        <GlobalText style={styles.menuTitle}>{title}</GlobalText>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header con avatar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarRing}>
                <Image
                  source={{
                    uri:
                      user?.imageProfile ??
                      'https://ui-avatars.com/api/?name=Usuario+Demo&background=DA2919&color=fff&size=200',
                  }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.cameraButton}>
                <Camera size={12} color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>

          <GlobalText variant="bold" style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </GlobalText>
          <Text style={styles.userEmail}>{user?.email ?? 'demo@dores.app'}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <ShoppingBag size={16} color={PRIMARY_RED} />
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Pedidos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Heart size={16} color={PRIMARY_RED} />
              </View>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
              </View>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Mi cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MI CUENTA</Text>
          <View style={styles.card}>
            <ProfileMenuItem
              icon={UserIcon}
              title="Datos personales"
              subtitle="Nombre, teléfono, DNI"
              onPress={() => router.navigate('ProfileDetail')}
            />
            <ProfileMenuItem
              icon={MapPin}
              title="Direcciones"
              subtitle="Gestiona tus direcciones"
              onPress={() => router.navigate('ProfileAddresses')}
              showBorder={false}
            />
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEGAL</Text>
          <View style={styles.card}>
            <ProfileMenuItem
              icon={FileText}
              title="Términos y condiciones"
              onPress={() => router.navigate('Terms')}
            />
            <ProfileMenuItem
              icon={Shield}
              title="Política de privacidad"
              onPress={() => router.navigate('Privacy')}
              showBorder={false}
            />
          </View>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <LogOut size={18} color={PRIMARY_RED} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versión 1.0.0</Text>
      </ScrollView>

      <AvatarGrid
        visible={showAvatarGrid}
        avatars={images}
        onClose={() => setShowAvatarGrid(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffcfa',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // Header
  header: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: PRIMARY_RED,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F0F0F0',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: PRIMARY_RED,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    color: '#2D3436',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3436',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E8E8E8',
  },
  // Sections
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BBB',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: `${PRIMARY_RED}0D`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    color: '#2D3436',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#BBB',
    marginTop: 1,
  },
  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: `${PRIMARY_RED}30`,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: PRIMARY_RED,
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#DDD',
    marginTop: 20,
  },
});
