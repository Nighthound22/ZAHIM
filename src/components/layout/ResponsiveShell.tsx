import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { TopNav } from './TopNav';
import { BottomTabBar } from './BottomTabBar';
import { TabType } from '../../types';

interface ResponsiveShellProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCalendarSync: () => void;
  onOpenDhikr: () => void;
  children: (isDesktop: boolean) => React.ReactNode;
}

export const ResponsiveShell: React.FC<ResponsiveShellProps> = ({
  activeTab,
  onSelectTab,
  onOpenCalendarSync,
  onOpenDhikr,
  children,
}) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 840;
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);

  const shouldRenderMobileLayout = !isLargeScreen || isMobileSimulator;

  return (
    <View style={styles.root}>
      {/* Top Navigation Bar */}
      <TopNav
        onOpenCalendarSync={onOpenCalendarSync}
        onOpenDhikr={onOpenDhikr}
        isMobileSimulator={isMobileSimulator}
        onToggleSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        isLargeScreen={isLargeScreen}
      />

      {shouldRenderMobileLayout ? (
        // Mobile View (either on actual mobile screen or desktop phone simulator)
        <View style={styles.mobileOuterWrapper}>
          <View
            style={[
              styles.mobileContainer,
              isLargeScreen && styles.simulatorFrame,
            ]}
          >
            {isLargeScreen && (
              <View style={styles.phoneSpeakerNotch}>
                <View style={styles.speakerPill} />
                <View style={styles.cameraDot} />
              </View>
            )}

            <ScrollView
              style={styles.mobileScroll}
              contentContainerStyle={styles.mobileScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {children(false)}
            </ScrollView>

            <BottomTabBar activeTab={activeTab} onSelectTab={onSelectTab} />
          </View>
        </View>
      ) : (
        // Laptop / Desktop Full Width Modular Notion Dashboard
        <View style={styles.desktopContainer}>
          <ScrollView
            style={styles.desktopScroll}
            contentContainerStyle={styles.desktopScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {children(true)}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgBase,
    height: '100%',
  },
  mobileOuterWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07080B',
  },
  mobileContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: Colors.bgBase,
    display: 'flex',
    flexDirection: 'column',
  },
  simulatorFrame: {
    maxWidth: 430,
    height: 840,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#1E232E',
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    marginVertical: 20,
  },
  phoneSpeakerNotch: {
    height: 24,
    backgroundColor: '#0B0D11',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  speakerPill: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E232E',
  },
  cameraDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E232E',
  },
  mobileScroll: {
    flex: 1,
  },
  mobileScrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  desktopContainer: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    maxWidth: 1380,
    alignSelf: 'center',
    width: '100%',
  },
});
