import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { WheelItem } from '../types';
import { COLORS } from '../constants';

interface SpinWheelProps {
  items: WheelItem[];
  isSpinning: boolean;
  onSpinComplete?: () => void;
  selectedIndex?: number;
}

/**
 * SpinWheel renders the wheel as a stack of pie-slice segments using
 * clipping and rotation. Each segment is a colored half-circle clipped
 * to the correct angular slice, then the whole wheel spins via Animated.
 */
export const SpinWheel: React.FC<SpinWheelProps> = ({
  items,
  isSpinning,
  onSpinComplete,
  selectedIndex = 0,
}) => {
  const WHEEL_SIZE = 280;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  // Track the current rotation so spins accumulate (no snap-back)
  const currentRotationRef = useRef(0);

  useEffect(() => {
    if (!isSpinning) return;

    const segmentAngle = 360 / items.length;
    // We want the pointer (top) to land on the selectedIndex segment.
    // Segments are drawn starting at 0°. Segment i covers [i*seg, (i+1)*seg].
    // The pointer is at top (0°/360°). To center segment i under the pointer:
    //   targetAngle = -(selectedIndex * segmentAngle + segmentAngle / 2)
    const targetOffset = -(selectedIndex * segmentAngle + segmentAngle / 2);
    // Add multiple full rotations for drama (min 5 full rotations)
    const fullRotations = 5 * 360;
    const finalRotation = currentRotationRef.current + fullRotations + targetOffset - (currentRotationRef.current % 360);

    currentRotationRef.current = finalRotation;

    Animated.timing(rotationAnim, {
      toValue: finalRotation,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && onSpinComplete) {
        onSpinComplete();
      }
    });
  }, [isSpinning, selectedIndex, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const spin = rotationAnim.interpolate({
    inputRange: [-100000, 100000],
    outputRange: ['-100000deg', '100000deg'],
  });

  const segmentAngle = 360 / items.length;

  return (
    <View style={styles.container}>
      {/* Outer glow ring */}
      <View style={styles.outerRing}>
        {/* The spinning wheel */}
        <Animated.View
          style={[
            styles.wheel,
            { transform: [{ rotate: spin }] },
          ]}
        >
          {items.map((item, index) => (
            <WheelSegment
              key={item.id}
              item={item}
              index={index}
              totalItems={items.length}
              segmentAngle={segmentAngle}
              wheelSize={WHEEL_SIZE}
            />
          ))}
        </Animated.View>
      </View>

      {/* Pointer (triangle) at the top */}
      <View style={styles.pointerWrapper}>
        <View style={styles.pointer} />
      </View>

      {/* Center hub */}
      <View style={styles.center}>
        <Text style={styles.centerText}>{isSpinning ? '...' : 'SPIN'}</Text>
      </View>
    </View>
  );
};

interface SegmentProps {
  item: WheelItem;
  index: number;
  totalItems: number;
  segmentAngle: number;
  wheelSize: number;
}

/**
 * Renders a single pie-slice segment.
 * Strategy: each segment is positioned as an absolute view rotated around
 * the wheel center. We use a large rectangle masked by overflow:hidden on
 * the parent to approximate a pie slice shape. For a clean look we draw
 * each segment as a rotated wedge.
 *
 * Since RN doesn't support SVG natively without a library, we use a
 * "half-disk clipping" technique: render a colored square at half the
 * wheel size, positioned at the center, rotated to its angle.
 */
const WheelSegment: React.FC<SegmentProps> = ({
  item,
  index,
  totalItems,
  segmentAngle,
  wheelSize,
}) => {
  const half = wheelSize / 2;
  // Rotation for this segment so it starts at the correct angle
  const rotation = index * segmentAngle;
  // Label sits at 60% of radius, centered within the segment
  const labelAngle = rotation + segmentAngle / 2; // degrees from 12-o'clock
  const labelRad = (labelAngle - 90) * (Math.PI / 180);
  const labelRadius = half * 0.62;
  const labelX = half + labelRadius * Math.cos(labelRad) - 30; // 30 = half of label width
  const labelY = half + labelRadius * Math.sin(labelRad) - 14; // 14 = half of label height

  return (
    <>
      {/* Pie slice - drawn as a rotated half-rectangle clipped by the wheel */}
      <View
        style={[
          styles.segment,
          {
            width: half,
            height: wheelSize,
            backgroundColor: item.color,
            transform: [
              { translateX: half },
              { rotate: `${rotation}deg` },
              { translateX: 0 },
            ],
            transformOrigin: 'left center',
          } as any,
        ]}
      />
      {/* Label positioned absolutely */}
      <View
        pointerEvents="none"
        style={[
          styles.labelWrapper,
          {
            left: labelX,
            top: labelY,
            width: 60,
            height: 28,
            transform: [{ rotate: `${labelAngle}deg` }],
          },
        ]}
      >
        <Text style={styles.labelText} numberOfLines={2}>
          {item.label}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 360,
    marginVertical: 20,
  },
  outerRing: {
    width: 296,
    height: 296,
    borderRadius: 148,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    // Gold glow border
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  wheel: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    backgroundColor: COLORS.purple,
  },
  segment: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRightWidth: 2,
    borderRightColor: 'rgba(0,0,0,0.3)',
  },
  labelWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pointerWrapper: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.gold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 8,
  },
  center: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.darkBg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 4,
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  centerText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1,
  },
});
