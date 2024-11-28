import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
// Directly import a fixed color set
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.primary, // Use fixed color for active tab
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Transparent background for iOS blur effect
						position: 'absolute',
					},
					default: {},
				}),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name="house.fill"
							color={color || Colors.primary} // Fallback to fixed color if necessary
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: 'Explore',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name="paperplane.fill"
							color={color || Colors.primary} // Fallback to fixed color if necessary
						/>
					),
				}}
			/>
		</Tabs>
	);
}
