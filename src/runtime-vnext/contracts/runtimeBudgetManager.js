import { clamp } from '../../core/utils.js';
import { RUNTIME_EVENT_TYPES } from './runtimeEventTypes.js';

/**
 * Unified budget hooks for destruction/render transient paths.
 * Phase 0 scope: normalize limit checks, emit budget events, and keep existing behavior.
 */
export function createRuntimeBudgetManager({ config, state, events }) {
  let engine = null;

  function bindEngine(nextEngine) {
    engine = nextEngine;
  }

  function getQualityScaledLimit(limit) {
    return Math.max(0, Math.floor(limit * clamp(state.qualityScale, 0, 1)));
  }

  function getSnapshot() {
    if (!engine) return null;
    return {
      qualityScale: state.qualityScale,
      particles: { active: engine.activeCounts.particles, max: config.LIMITS.maxParticles },
      smokes: { active: engine.activeCounts.smokes, max: config.LIMITS.maxSmoke },
      glows: { active: engine.activeCounts.glows, max: config.LIMITS.maxGlows },
      embers: { active: engine.activeCounts.embers, max: config.LIMITS.maxEmbers },
      shockwaves: { active: engine.activeCounts.shockwaves, max: config.LIMITS.maxShockwaves },
      targetFragments: { active: engine.activeCounts.targetFragments, max: config.LIMITS.maxTargetFragments },
      targets: { active: engine.activeCounts.targets, max: config.LIMITS.maxTargets }
    };
  }

  function request({ channel, current, hardLimit, requested = 1 }) {
    const available = Math.max(0, hardLimit - current);
    const allowed = Math.max(0, Math.min(available, requested));
    const denied = requested - allowed;

    if (denied > 0) {
      events.emit(RUNTIME_EVENT_TYPES.budgetDenied, { channel, requested, allowed, hardLimit, current });
    }

    if (allowed > 0) {
      events.emit(RUNTIME_EVENT_TYPES.budgetConsumed, { channel, requested: allowed, hardLimit, current });
    }

    return { allowed, denied, hardLimit };
  }

  return { bindEngine, getSnapshot, getQualityScaledLimit, request };
}
