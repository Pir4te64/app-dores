import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { CreditCard, Plus, Check, ArrowLeft, Trash2 } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { GlobalText } from '~/presentation/components/GlobalText';
import { createDemoOrder } from '~/presentation/data/demoOrderStore';
import { useCart } from '~/presentation/context/cartContext';
import { useOrderEvents } from '~/presentation/context/orderContext';

const PRIMARY_RED = '#DA2919';

// Mock saved cards
interface SavedCard {
    id: number;
    type: 'visa' | 'mastercard';
    lastFour: string;
    expiryMonth: string;
    expiryYear: string;
    holderName: string;
    isDefault: boolean;
}

const MOCK_SAVED_CARDS: SavedCard[] = [
    {
        id: 1,
        type: 'visa',
        lastFour: '4532',
        expiryMonth: '12',
        expiryYear: '26',
        holderName: 'USUARIO DEMO',
        isDefault: true,
    },
    {
        id: 2,
        type: 'mastercard',
        lastFour: '8891',
        expiryMonth: '08',
        expiryYear: '25',
        holderName: 'USUARIO DEMO',
        isDefault: false,
    },
];

type RootStackParamList = {
    SavedCards: {
        total: number;
        items: any[];
        addressTitle: string;
        addressStreet: string;
    };
    CardPayment: {
        total: number;
        items: any[];
        addressTitle: string;
        addressStreet: string;
    };
};

export default function SavedCards() {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'SavedCards'>>();
    const { total, items, addressTitle, addressStreet } = route.params;
    const { clearCart } = useCart();
    const { notifyOrdersChanged } = useOrderEvents();

    const [savedCards, setSavedCards] = useState<SavedCard[]>(MOCK_SAVED_CARDS);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(
        MOCK_SAVED_CARDS.find(c => c.isDefault)?.id || null
    );
    const [loading, setLoading] = useState(false);

    const handleSelectCard = (cardId: number) => {
        setSelectedCardId(cardId);
    };

    const handleDeleteCard = (cardId: number) => {
        Alert.alert(
            'Eliminar tarjeta',
            '¿Estás seguro de que deseas eliminar esta tarjeta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        setSavedCards(prev => prev.filter(c => c.id !== cardId));
                        if (selectedCardId === cardId) {
                            setSelectedCardId(null);
                        }
                    },
                },
            ]
        );
    };

    const handleAddNewCard = () => {
        navigation.navigate('CardPayment', {
            total,
            items,
            addressTitle,
            addressStreet,
        });
    };

    const handlePayWithSelectedCard = async () => {
        if (!selectedCardId) {
            Alert.alert('Error', 'Selecciona una tarjeta');
            return;
        }

        setLoading(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create demo order
        const newOrder = createDemoOrder(items, addressTitle, addressStreet);

        // Notify and clear cart
        notifyOrdersChanged();
        clearCart();

        setLoading(false);

        const selectedCard = savedCards.find(c => c.id === selectedCardId);

        // Show success
        Alert.alert(
            '¡Pago exitoso! 💳',
            `Pedido #${newOrder.id} confirmado\n\nPagado con •••• ${selectedCard?.lastFour}\nTotal: $${total}`,
            [
                {
                    text: 'Ver mis pedidos',
                    onPress: () => {
                        navigation.goBack();
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const getCardColor = (type: 'visa' | 'mastercard') => {
        return type === 'visa' ? '#1A1F71' : '#EB001B';
    };

    const getCardGradient = (type: 'visa' | 'mastercard') => {
        return type === 'visa' ? '#1A1F71' : '#FF5F00';
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#2D3436" />
                </TouchableOpacity>
                <GlobalText variant="bold" style={styles.title}>Mis tarjetas</GlobalText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Total Amount */}
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Total a pagar</Text>
                    <Text style={styles.amountValue}>${total}</Text>
                </View>

                {/* Saved Cards */}
                <Text style={styles.sectionTitle}>Tarjetas guardadas</Text>

                {savedCards.length === 0 ? (
                    <View style={styles.emptyState}>
                        <CreditCard size={48} color="#DDD" />
                        <Text style={styles.emptyText}>No tienes tarjetas guardadas</Text>
                    </View>
                ) : (
                    savedCards.map((card) => (
                        <TouchableOpacity
                            key={card.id}
                            style={[
                                styles.cardItem,
                                selectedCardId === card.id && styles.cardItemSelected,
                            ]}
                            onPress={() => handleSelectCard(card.id)}
                            activeOpacity={0.7}>

                            {/* Card Visual */}
                            <View style={[styles.cardVisual, { backgroundColor: getCardColor(card.type) }]}>
                                <CreditCard size={24} color="#FFF" />
                            </View>

                            {/* Card Info */}
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardType}>
                                    {card.type === 'visa' ? 'Visa' : 'Mastercard'}
                                </Text>
                                <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFour}</Text>
                                <Text style={styles.cardExpiry}>
                                    Vence {card.expiryMonth}/{card.expiryYear}
                                </Text>
                            </View>

                            {/* Selection indicator or delete */}
                            <View style={styles.cardActions}>
                                {selectedCardId === card.id ? (
                                    <View style={styles.selectedBadge}>
                                        <Check size={16} color="#FFF" />
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteCard(card.id)}>
                                        <Trash2 size={18} color="#999" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {/* Add New Card Button */}
                <TouchableOpacity
                    style={styles.addCardButton}
                    onPress={handleAddNewCard}
                    activeOpacity={0.7}>
                    <View style={styles.addCardIcon}>
                        <Plus size={24} color={PRIMARY_RED} />
                    </View>
                    <Text style={styles.addCardText}>Agregar nueva tarjeta</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Bottom Bar */}
            {savedCards.length > 0 && (
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={[
                            styles.payButton,
                            !selectedCardId && styles.payButtonDisabled,
                        ]}
                        onPress={handlePayWithSelectedCard}
                        disabled={!selectedCardId || loading}>
                        {loading ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <>
                                <CreditCard size={20} color="#FFF" />
                                <Text style={styles.payButtonText}>
                                    Pagar ${total}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        color: '#2D3436',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 120,
    },
    amountCard: {
        backgroundColor: PRIMARY_RED,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
    },
    amountLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    amountValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFF',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3436',
        marginBottom: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 15,
        color: '#999',
        marginTop: 12,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardItemSelected: {
        borderColor: PRIMARY_RED,
        backgroundColor: '#FFF9F8',
    },
    cardVisual: {
        width: 52,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    cardInfo: {
        flex: 1,
    },
    cardType: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3436',
        marginTop: 2,
    },
    cardExpiry: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    cardActions: {
        marginLeft: 12,
    },
    selectedBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: PRIMARY_RED,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        padding: 5,
    },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: PRIMARY_RED,
        borderStyle: 'dashed',
        marginTop: 8,
    },
    addCardIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: `${PRIMARY_RED}10`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    addCardText: {
        fontSize: 16,
        fontWeight: '600',
        color: PRIMARY_RED,
    },
    bottomBar: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    payButton: {
        backgroundColor: PRIMARY_RED,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    payButtonDisabled: {
        backgroundColor: '#CCC',
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
});
