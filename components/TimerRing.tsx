import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface TimerRingProps {
  progress: number; // 0-1
  formattedTime: string;
  message?: string;
}

/**
 * TimerRing — shows a circular progress indicator.
 * Uses four quarter-circle Views to fake a full-circle sweep.
 * The progress arc is layered on top of a dimmed background ring.
 */
export const TimerRing: React.FC<TimerRingProps> = ({
  progress,
  formattedTime,
  message,
}) => {
  const SIZE = 260;
  const STROKE = 12;

  // Color transitions: green → gold → red as progress increases
  const getColor = (): string => {
    if (progress < 0.33) return COLORS.neonGreen;
    if (progress < 0.66) return COLORS.gold;
    return COLORS.red;
  };

  const color = getColor();

  // We simulate the arc using up to 4 rotated half-circle clipping masks.
  // Each "sector" covers 90°. We show as many fully filled sectors as needed,
  // plus a partial sector for the fractional piece.
  const arcDegrees = progress * 360;

  // Build the filled quadrant segments
  const segments: { rotation: number; fillDegrees: number }[] = [];
  let remaining = arcDegrees;
  for (let i = 0; i < 4; i++) {
    const fill = Math.min(90, remaining);
    if (fill > 0) {
      segments.push({ rotation: i * 90, fillDegrees: fill });
    }
    remaining -= 90;
    if (remaining <= 0) break;
  }

  return (
    <View style={styles.container}>
      {/* Ring */}
      <View style={[styles.ringOuter, { width: SIZE, height: SIZE, borderRadius: SIZE / 2 }]}>
        {/* Background track ring */}
        <View
          style={[
            styles.track,
            {
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              borderWidth: STROKE,
              borderColor: COLORS.purple,
            },
          ]}
        />

        {/* Progress arcs — each covers up to 90° */}
        {segments.map((seg, i) => (
          <ArcSegment
            key={i}
            size={SIZE}
            stroke={STROKE}
            rotation={seg.rotation}
            fillDegrees={seg.fillDegrees}
            color={color}
          />
        ))}

        {/* Center display */}
        <View style={styles.center}>
          <Text style={[styles.timerText, { color }]}>{formattedTime}</Text>
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

/**
 * Renders a colored arc segment using the half-circle clipping trick.
 * `fillDegrees` is how many degrees of this 90° quadrant are filled (0-90).
 */
function ArcSegment({
  size,
  stroke,
  rotation,
  fillDegrees,
  color,
}: {
  size: number;
  stroke: number;
  rotation: number;
  fillDegrees: number;
  color: string;
}) {
  // Half-circle approach: clip a full colored ring to a half-plane,
  // then rotate the inner half to expose only `fillDegrees` of the quadrant.
  const half = size / 2;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          transform: [{ rotate: `${rotation}deg` }],
          overflow: 'hidden',
          width: size,
          height: half, // Top half only
          borderRadius: 0,
        },
      ]}
    >
      {/* The inner arc piece — rotate within the clipped top half */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          top: 0,
          left: 0,
          transform: [{ rotate: `${fillDegrees - 90}deg` }],
          // The pivot is center-bottom of the top-half, i.e. center of the full circle
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: size,
            height: half,
            top: 0,
            left: 0,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: size,
              height: size,
              borderRadius: half,
              borderWidth: stroke,
              borderColor: color,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  ringOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'] as any,
  },
  progressPercent: {
    fontSize: 14,
    color: COLORS.textGray,
    fontWeight: '600',
    marginTop: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
