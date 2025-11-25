import { Button } from '@react-navigation/elements';
import { Text, View } from 'react-native';
import { useAuthStore } from '../state/auth-store';

export default function Auth() {
    const { singIn } = useAuthStore();

    const onSignIn = () => {
        singIn('Boardadmin');
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text>Soft Step</Text>
            <Button onPress={onSignIn}>Enter</Button>
        </View>
    );
}
