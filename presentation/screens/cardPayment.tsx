import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { CreditCard, Lock, Calendar, User, Check, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { GlobalText } from '~/presentation/components/GlobalText';
import { createDemoOrder } from '~/presentation/data/demoOrderStore';
import { useCart } from '~/presentation/context/cartContext';
import { useOrderEvents } from '~/presentation/context/orderContext';

const PRIMARY_RED = '#DA2919';

type RootStackParamList = {
    CardPayment: {
        total: number;
        items: any[];
        addressTitle: string;
        addressStreet: string;
    };
};

export default function CardPayment() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'CardPayment'>>();
    const { total, items, addressTitle, addressStreet } = route.params;
    const { clearCart } = useCart();
    const { notifyOrdersChanged } = useOrderEvents();

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
        return formatted.substring(0, 19);
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
        }
        return cleaned;
    };

    const isFormValid = () => {
        return (
            cardNumber.replace(/\s/g, '').length === 16 &&
            cardName.length >= 3 &&
            expiry.length === 5 &&
            cvv.length >= 3
        );
    };

    const handlePayment = async () => {
        if (!isFormValid()) {
            Alert.alert('Error', 'Por favor completa todos los campos correctamente');
            return;
        }

        setLoading(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create demo order
        const newOrder = createDemoOrder(items, addressTitle, addressStreet);

        // Notify and clear cart
        notifyOrdersChanged();
        clearCart();

        setLoading(false);

        // Show success
        Alert.alert(
            '¡Pago exitoso! 💳',
            `Tu pedido #${newOrder.id} ha sido confirmado.\n\nTotal pagado: $${total}`,
            [
                {
                    text: 'Ver mis pedidos',
                    onPress: () => {
                        // Go back twice to exit checkout and card payment
                        navigation.goBack();
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color="#2D3436" />
                    </TouchableOpacity>
                    <GlobalText variant="bold" style={styles.title}>Pagar con tarjeta</GlobalText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>

                    {/* Card Preview */}
                    <View style={styles.cardPreview}>
                        <View style={styles.cardTop}>
                            <CreditCard size={32} color="#FFF" />
                            <Text style={styles.cardType}>VISA</Text>
                        </View>
                        <Text style={styles.cardNumberPreview}>
                            {cardNumber || '•••• •••• •••• ••••'}
                        </Text>
                        <View style={styles.cardBottom}>
                            <View>
                                <Text style={styles.cardLabel}>Titular</Text>
                                <Text style={styles.cardValue}>
                                    {cardName.toUpperCase() || 'NOMBRE DEL TITULAR'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.cardLabel}>Vence</Text>
                                <Text style={styles.cardValue}>{expiry || 'MM/AA'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Card Number */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Número de tarjeta</Text>
                            <View style={styles.inputContainer}>
                                <CreditCard size={20} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="1234 5678 9012 3456"
                                    placeholderTextColor="#CCC"
                                    value={cardNumber}
                                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                                    keyboardType="numeric"
                                    maxLength={19}
                                />
                            </View>
                        </View>

                        {/* Card Holder */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre del titular</Text>
                            <View style={styles.inputContainer}>
                                <User size={20} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Como aparece en la tarjeta"
                                    placeholderTextColor="#CCC"
                                    value={cardName}
                                    onChangeText={setCardName}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>

                        {/* Expiry and CVV */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                <Text style={styles.label}>Vencimiento</Text>
                                <View style={styles.inputContainer}>
                                    <Calendar size={20} color="#999" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="MM/AA"
                                        placeholderTextColor="#CCC"
                                        value={expiry}
                                        onChangeText={(text) => setExpiry(formatExpiry(text))}
                                        keyboardType="numeric"
                                        maxLength={5}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>CVV</Text>
                                <View style={styles.inputContainer}>
                                    <Lock size={20} color="#999" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123"
                                        placeholderTextColor="#CCC"
                                        value={cvv}
                                        onChangeText={setCvv}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        secureTextEntry
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Security Note */}
                    <View style={styles.securityNote}>
                        <Lock size={16} color="#22C55E" />
                        <Text style={styles.securityText}>
                            Tus datos están protegidos con encriptación SSL
                        </Text>
                    </View>

                </ScrollView>

                {/* Bottom Bar */}
                <View style={styles.bottomBar}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total a pagar</Text>
                        <Text style={styles.totalValue}>${total}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.payButton, !isFormValid() && styles.payButtonDisabled]}
                        onPress={handlePayment}
                        disabled={!isFormValid() || loading}>
                        {loading ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <>
                                <Check size={20} color="#FFF" />
                                <Text style={styles.payButtonText}>Pagar ahora</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    flex: {
        flex: 1,
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
    cardPreview: {
        backgroundColor: PRIMARY_RED,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: PRIMARY_RED,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    cardType: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 2,
    },
    cardNumberPreview: {
        fontSize: 22,
        fontWeight: '600',
        color: '#FFF',
        letterSpacing: 3,
        marginBottom: 20,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        marginTop: 4,
    },
    form: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#2D3436',
    },
    row: {
        flexDirection: 'row',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 8,
    },
    securityText: {
        fontSize: 13,
        color: '#22C55E',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
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
    totalContainer: {
        marginRight: 16,
    },
    totalLabel: {
        fontSize: 12,
        color: '#999',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2D3436',
    },
    payButton: {
        flex: 1,
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
