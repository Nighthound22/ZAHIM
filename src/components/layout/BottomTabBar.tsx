import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { TabType } from '../../types';
import { LayoutDashboard, CheckSquare, Compass, BookOpen, FileText } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';

interface BottomTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'habits', label: 'Rutinitas', icon: CheckSquare },
    { key: 'prayer', label: 'Sholat & Doa', icon: Compass },
    { key: 'quran', label: 'Al-Qur\'an', icon: BookOpen },
    { key: 'memos', label: 'Smart Memo', icon: FileText },
  ];

  const handlePress = (tab: TabType) => {
    soundHaptics.lightTap();
    onSelectTab(tab);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => handlePress(tab.key)}
            style={styles.tabItem}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <IconComponent
                size={20}
                color={isActive ? Colors.primary : Colors.textDim}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0B0D11',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    padding: 4,
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textDim,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
