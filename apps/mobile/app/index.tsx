import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_CLIENT, APP_NAME } from '@love/shared';

// Placeholder screen proving the mobile toolchain works, including
// imports from shared workspace packages. No features belong here yet.
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>
          {APP_NAME} Mobile
        </Text>
        <Text style={styles.status}>Repository Successfully Initialized</Text>
        <Text style={styles.caption}>{APP_CLIENT}</Text>
      </View>
    </SafeAreaView>
  );
}

// Colors match the web design tokens; text sizes are generous and still
// scale with the user's OS font-size setting (allowFontScaling defaults on).
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#9f1239',
  },
  status: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  caption: {
    fontSize: 18,
    color: '#525252',
  },
});
