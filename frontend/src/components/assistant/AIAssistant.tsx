import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as SkeletonUtilsClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AssistantChat } from '@/components/assistant/AssistantChat';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils/cn';

type CharacterState = 'entering' | 'hello' | 'standing' | 'sitting' | 'standing-up' | 'open';

const INACTIVITY_MS = 5000;
const ENTRANCE_MS = 1300;
const STAND_UP_MS = 1250;
const STAND_UP_FALLBACK_MS = 2200;

const WIDTH_MOBILE = 90;
const HEIGHT_MOBILE = 135;
const MARGIN_DESKTOP = 2;
const MARGIN_MOBILE = 1;

const DESKTOP_HEIGHT_RATIO = 0.34;
const DESKTOP_HEIGHT_MIN = 200;
const DESKTOP_HEIGHT_MAX = 320;
const DESKTOP_ASPECT = 0.66;

const CHAT_GAP = 12;

const FRAME_FILL_DESKTOP = 0.9;
const FRAME_SAFETY_DESKTOP = 1.08;
const FRAME_FILL_MOBILE = 0.82;
const FRAME_SAFETY_MOBILE = 1.12;

const MODEL_PATH = '/assets/models/AssistantAIModel.glb';
const MODEL_SCALE = 1;
const MODEL_FOOT_Y = 0.06;

const FRAME_CLIPS = ['Look_Wave', 'Sitting'];
const POSE_SAMPLES = 8;

interface ModelAPI {
  model: THREE.Object3D | null;
  mixer: THREE.AnimationMixer | null;
  actions: Map<string, THREE.AnimationAction>;
  currentAction: THREE.AnimationAction | null;
  box: THREE.Box3 | null;
  setCurrentAction: (action: THREE.AnimationAction | null) => void;
}

function HumanoidModel({ onLoad }: { onLoad: (api: ModelAPI) => void }) {
  const gltf = useGLTF(MODEL_PATH);

  const clonedScene = useMemo(() => {
    if (!gltf) return null;
    const cloned = SkeletonUtilsClone(gltf.scene);
    cloned.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.visible = true;
      }
    });
    return cloned;
  }, [gltf]);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);

  const setCurrentAction = useCallback((action: THREE.AnimationAction | null) => {
    currentActionRef.current = action;
  }, []);

  useEffect(() => {
    if (!clonedScene) return;

    const scene = clonedScene;
    const animations = gltf?.animations || [];

    const originalBox = new THREE.Box3().setFromObject(scene);
    const originalSize = new THREE.Vector3();
    originalBox.getSize(originalSize);

    if (originalSize.y <= 0) {
      console.error('[AIAssistant] Invalid model height:', originalSize.y);
      return;
    }

    scene.scale.setScalar(MODEL_SCALE);

    const scaledBox = new THREE.Box3().setFromObject(scene);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);

    scene.position.x -= scaledCenter.x;
    scene.position.y -= scaledCenter.y;
    scene.position.z -= scaledCenter.z;
    scene.position.y += MODEL_FOOT_Y;

    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;

    const actionMap = new Map<string, THREE.AnimationAction>();

    animations.forEach((clip: THREE.AnimationClip) => {
      const action = mixer.clipAction(clip);
      actionMap.set(clip.name, action);
    });

    actionsRef.current = actionMap;

    const restBox = new THREE.Box3().setFromObject(scene);

    // The rest-pose bounds are much larger than the animated silhouette, so the
    // framing box is sampled from the clips that actually play.
    const restTransforms = new Map<
      THREE.Object3D,
      [THREE.Vector3, THREE.Quaternion, THREE.Vector3]
    >();
    scene.traverse((object: THREE.Object3D) => {
      restTransforms.set(object, [
        object.position.clone(),
        object.quaternion.clone(),
        object.scale.clone(),
      ]);
    });

    const frameBox = new THREE.Box3();
    const measurePose = () => {
      scene.updateMatrixWorld(true);
      scene.traverse((object: THREE.Object3D) => {
        const skinned = object as THREE.SkinnedMesh;
        if (skinned.isSkinnedMesh && skinned.skeleton) {
          skinned.skeleton.update();
        }
      });
      frameBox.union(new THREE.Box3().setFromObject(scene, true));
    };

    FRAME_CLIPS.forEach((clipName: string) => {
      const action = actionMap.get(clipName);
      if (!action) return;
      const duration = action.getClip().duration;
      action.play();
      for (let step = 0; step <= POSE_SAMPLES; step++) {
        action.time = (duration * step) / POSE_SAMPLES;
        mixer.update(0);
        measurePose();
      }
      action.stop();
    });

    if (frameBox.isEmpty()) {
      frameBox.copy(restBox);
    }

    restTransforms.forEach(([position, quaternion, scale], object) => {
      object.position.copy(position);
      object.quaternion.copy(quaternion);
      object.scale.copy(scale);
    });

    const frameSize = new THREE.Vector3();
    frameBox.getSize(frameSize);

    if (process.env.NODE_ENV === 'development') {
      console.log('[AIAssistant] NEW MODEL READY:', {
        model: 'friendly_sci-fi_robot_with_animations.glb',
        originalSize: {
          x: Math.round(originalSize.x * 1000) / 1000,
          y: Math.round(originalSize.y * 1000) / 1000,
          z: Math.round(originalSize.z * 1000) / 1000,
        },
        scale: MODEL_SCALE,
        restBounds: {
          min: restBox.min.toArray().map((n) => Math.round(n * 1000) / 1000),
          max: restBox.max.toArray().map((n) => Math.round(n * 1000) / 1000),
        },
        frameBounds: {
          min: frameBox.min.toArray().map((n) => Math.round(n * 1000) / 1000),
          max: frameBox.max.toArray().map((n) => Math.round(n * 1000) / 1000),
        },
        frameSize: {
          x: Math.round(frameSize.x * 1000) / 1000,
          y: Math.round(frameSize.y * 1000) / 1000,
          z: Math.round(frameSize.z * 1000) / 1000,
        },
        animations: animations.map((clip) => clip.name),
      });
    }

    onLoad({
      model: scene,
      mixer,
      actions: actionMap,
      currentAction: currentActionRef.current,
      box: frameBox,
      setCurrentAction,
    });

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
      actionMap.forEach((action) => action.stop());
    };
  }, [clonedScene, gltf?.animations, onLoad, setCurrentAction]);

  useFrame((_state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  if (!clonedScene) return null;

  return <primitive object={clonedScene} />;
}


const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

function playActionOnce(
  action: THREE.AnimationAction | undefined | null,
  mixer: THREE.AnimationMixer | null,
  onFinished: () => void,
  timeScale: number = 1,
): void {
  if (!action || !mixer) return;
  action.reset();
  action.loop = THREE.LoopOnce;
  action.clampWhenFinished = true;
  action.timeScale = timeScale;
  action.play();

  const check = (event: { action: THREE.AnimationAction }) => {
    if (event.action !== action) return;
    mixer.removeEventListener('finished', check);
    onFinished();
  };
  mixer.addEventListener('finished', check);
}

function reverseAction(
  action: THREE.AnimationAction | undefined | null,
  mixer: THREE.AnimationMixer | null,
  onFinished: () => void,
  timeScale: number = 1,
): boolean {
  if (!action || !mixer) return false;
  const duration = action.getClip().duration;
  const from = action.isRunning() ? Math.min(action.time, duration) : duration;
  action.reset();
  action.loop = THREE.LoopOnce;
  action.clampWhenFinished = false;
  action.timeScale = -Math.max(0.1, timeScale);
  action.time = from;
  action.play();

  const check = (event: { action: THREE.AnimationAction }) => {
    if (event.action !== action) return;
    mixer.removeEventListener('finished', check);
    action.stop();
    action.reset();
    action.timeScale = 1;
    action.clampWhenFinished = true;
    onFinished();
  };
  mixer.addEventListener('finished', check);
  return true;
}


function CameraFramer({
  box,
  isMobile,
}: {
  box: THREE.Box3 | null;
  isMobile: boolean;
}) {
  const { camera, size } = useThree();
  const fill = isMobile ? FRAME_FILL_MOBILE : FRAME_FILL_DESKTOP;
  const safety = isMobile ? FRAME_SAFETY_MOBILE : FRAME_SAFETY_DESKTOP;

  const center = useMemo(() => new THREE.Vector3(), []);
  const boxSize = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!box || size.width <= 0 || size.height <= 0) return;

    box.getSize(boxSize);
    box.getCenter(center);

    const safeHeight = boxSize.y * safety;
    const safeWidth = Math.max(boxSize.x, boxSize.z) * safety;

    const fovRad = (((camera as THREE.PerspectiveCamera).fov || 38) * Math.PI) / 180;
    const tanV = Math.tan(fovRad / 2);
    const tanH = tanV * (size.width / size.height);

    const distanceForHeight = safeHeight / 2 / tanV;
    const distanceForWidth = safeWidth / 2 / tanH;
    const distance = Math.max(distanceForHeight, distanceForWidth) / fill;

    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
    camera.updateMatrixWorld();
  });

  return null;
}


export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelBox, setModelBox] = useState<THREE.Box3 | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 900,
  );
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const margin = isMobile ? MARGIN_MOBILE : MARGIN_DESKTOP;
  const desktopHeight = useMemo(() => {
    const raw = viewportHeight * DESKTOP_HEIGHT_RATIO;
    return Math.round(Math.min(DESKTOP_HEIGHT_MAX, Math.max(DESKTOP_HEIGHT_MIN, raw)));
  }, [viewportHeight]);
  const canvasHeight = isMobile ? HEIGHT_MOBILE : desktopHeight;
  const canvasWidth = isMobile ? WIDTH_MOBILE : Math.round(desktopHeight * DESKTOP_ASPECT);

  const viewportHeightRef = useRef<number>(typeof window !== 'undefined' ? window.innerHeight : 900);

  const stateRef = useRef<CharacterState>('entering');
  const entranceStartRef = useRef(0);
  const entranceOffsetRef = useRef(-200);
  const entranceCompletedRef = useRef(false);
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const lastActivityRef = useRef(Date.now());
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const standUpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const modelApiRef = useRef<ModelAPI | null>(null);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || modelReady) return;

    const startOffset = -(viewportHeightRef.current + canvasHeight);
    entranceOffsetRef.current = startOffset;
    container.style.transform = `translateY(${startOffset}px)`;
  }, [modelReady, canvasHeight]);

  const setInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      const s = stateRef.current;
      if (s === 'standing') {
        const api = modelApiRef.current;
        const sittingAction = api?.actions.get('Sitting');
        if (sittingAction && api?.mixer) {
          stateRef.current = 'sitting';
          playActionOnce(sittingAction, api?.mixer ?? null, () => {
            if (!mountedRef.current) return;
            stateRef.current = 'sitting';
          });
        }
      }
    }, INACTIVITY_MS);
  }, []);

  const markActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setInactivityTimer();
    const s = stateRef.current;
    if (s === 'sitting') {
      const api = modelApiRef.current;
      const sittingAction = api?.actions.get('Sitting');
      const mixer = api?.mixer ?? null;
      if (sittingAction && mixer) {
        stateRef.current = 'standing-up';
        const duration = sittingAction.getClip().duration || 1;
        const started = reverseAction(
          sittingAction,
          mixer,
          () => {
            if (!mountedRef.current) return;
            if (standUpTimerRef.current) {
              clearTimeout(standUpTimerRef.current);
              standUpTimerRef.current = null;
            }
            stateRef.current = 'standing';
            setInactivityTimer();
          },
          duration / (STAND_UP_MS / 1000),
        );
        if (started) {
          if (standUpTimerRef.current) {
            clearTimeout(standUpTimerRef.current);
          }
          standUpTimerRef.current = setTimeout(() => {
            standUpTimerRef.current = null;
            if (!mountedRef.current || stateRef.current !== 'standing-up') return;
            stateRef.current = 'standing';
            setInactivityTimer();
          }, STAND_UP_FALLBACK_MS);
        } else {
          stateRef.current = 'standing';
        }
      } else {
        stateRef.current = 'standing';
        setInactivityTimer();
      }
    }
  }, [setInactivityTimer]);

  const handleModelReady = useCallback((api: ModelAPI) => {
    modelApiRef.current = api;
    setModelBox(api.box);
    setModelReady(true);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (standUpTimerRef.current) {
        clearTimeout(standUpTimerRef.current);
        standUpTimerRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      const next = window.innerHeight;
      viewportHeightRef.current = next;
      setViewportHeight(next);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!modelReady) return;

    if (reduced) {
      entranceOffsetRef.current = 0;
      entranceCompletedRef.current = true;
      const container = containerRef.current;
      if (container) container.style.transform = 'none';
      stateRef.current = 'hello';
      const api = modelApiRef.current;
      const waveAction = api?.actions.get('Look_Wave');
      if (waveAction && api?.mixer) {
        playActionOnce(waveAction, api?.mixer ?? null, () => {
          if (!mountedRef.current) return;
          stateRef.current = 'standing';
          setInactivityTimer();
        }, 1.4);
      } else {
        stateRef.current = 'standing';
        setInactivityTimer();
      }
      return;
    }

    if (entranceCompletedRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    stateRef.current = 'entering';
    entranceStartRef.current = performance.now();
    const startOffset = -(viewportHeightRef.current + canvasHeight);
    entranceOffsetRef.current = startOffset;

    const container = containerRef.current;
    if (!container) return;

    container.style.transform = `translateY(${startOffset}px)`;

    const step = (now: number) => {
      const elapsed = now - entranceStartRef.current;
      const t = Math.min(1, elapsed / ENTRANCE_MS);
      const e = easeOutCubic(t);

      entranceOffsetRef.current = startOffset * (1 - e);
      container.style.transform = `translateY(${entranceOffsetRef.current}px)`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        entranceOffsetRef.current = 0;
        container.style.transform = 'none';
        rafRef.current = null;
        entranceCompletedRef.current = true;

        stateRef.current = 'hello';
        const api = modelApiRef.current;
        const waveAction = api?.actions.get('Look_Wave');
        if (waveAction && api?.mixer) {
          playActionOnce(waveAction, api?.mixer, () => {
            if (!mountedRef.current) return;
            stateRef.current = 'standing';
            setInactivityTimer();
          });
        } else {
          stateRef.current = 'standing';
          setInactivityTimer();
        }
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [modelReady, reduced, canvasHeight, setInactivityTimer]);

  useEffect(() => {
    if (reduced) return;
    const events: (keyof WindowEventMap)[] = ['scroll', 'click', 'keydown', 'touchstart', 'pointerdown'];
    events.forEach((e) => window.addEventListener(e, markActivity, { passive: true }));
    const onResize = () => {
      viewportHeightRef.current = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      events.forEach((e) => window.removeEventListener(e, markActivity));
      window.removeEventListener('resize', onResize);
    };
  }, [markActivity, reduced]);

  const handleClick = () => {
    if (stateRef.current === 'open') return;
    markActivity();
    setIsOpen(true);
    stateRef.current = 'open';
  };

  const handleClose = () => {
    setIsOpen(false);
    stateRef.current = 'standing';
    setInactivityTimer();
  };

  const rightOffset = isMobile ? 12 : 8;

  return (
    <>
      <button
        ref={containerRef}
        type="button"
        onClick={handleClick}
        aria-label="Open AI Assistant"
        data-cursor="button"
        className={cn(
          'fixed z-[150] touch-manipulation',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-terminal-accent focus-visible:outline-offset-2',
        )}
        style={{
          right: `${rightOffset}px`,
          bottom: `${margin}px`,
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          overflow: 'visible',
          willChange: 'transform',
        }}
      >
        <Canvas
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <perspectiveCamera attach="camera" fov={isMobile ? 40 : 38} />
          <CameraFramer box={modelBox} isMobile={isMobile} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[2, 4, 5]} intensity={2} />
          <directionalLight position={[-2, 2, 3]} intensity={1} />
          <HumanoidModel onLoad={handleModelReady} />
        </Canvas>

        {!modelReady && (
          <div
            className="absolute inset-0 flex items-center justify-center text-terminal-dim pointer-events-none"
            style={{ pointerEvents: 'none' }}
          >
            Loading...
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed z-[160]"
          style={{ bottom: `${canvasHeight + margin + CHAT_GAP}px`, right: `${rightOffset}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <AssistantChat onClose={handleClose} />
        </div>
      )}
    </>
  );
}
