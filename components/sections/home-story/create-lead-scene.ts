import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Scroll-scrubbable lead diagram.
 * Ported from the approved mockup: matte white tiles, thin navy outlines,
 * graph paper, green only once a connection is working.
 * `tick(progress)` expects progress in 0–1. 0 is the opening (scattered) frame.
 */

const INK = 0x101828;
const GREEN = 0x2e9e45;
const Y = 0.42;
const TILE = 1.25;
const TH = 0.3;
const AZ = Math.PI / 4;
const EL = 0.56;
const RADIUS = 30;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);
const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type NodeId = "crm" | "sms" | "email" | "voice" | "cal";

type SceneNode = {
  id: NodeId;
  label: string;
  sub: string;
  at: THREE.Vector3;
  sc: [number, number, number];
  rot: [number, number, number];
  snap: [number, number];
  phase: number;
  group: THREE.Group;
  ledMat: THREE.MeshBasicMaterial;
  shadow: THREE.Mesh;
  shadowMat: THREE.MeshBasicMaterial;
  tag: HTMLDivElement;
};

type Edge = {
  key: string;
  curve: THREE.Curve<THREE.Vector3>;
  geo: THREE.TubeGeometry;
  count: number;
  head: THREE.Mesh;
  draw: [number, number];
};

export type LeadScene = {
  tick: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
};

function P(x: number, z: number) {
  return new THREE.Vector3(x, Y, z);
}

function makeTexture(
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  size: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function gridTexture() {
  return makeTexture((g, size) => {
    const minor = size / 64;
    const major = size / 16;
    for (let i = 0; i <= 64; i++) {
      const x = i * minor;
      g.strokeStyle = "rgba(16,24,40,0.05)";
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, size);
      g.stroke();
      g.beginPath();
      g.moveTo(0, x);
      g.lineTo(size, x);
      g.stroke();
    }
    for (let i = 0; i <= 16; i++) {
      const x = i * major;
      g.strokeStyle = "rgba(16,24,40,0.11)";
      g.lineWidth = 1.3;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, size);
      g.stroke();
      g.beginPath();
      g.moveTo(0, x);
      g.lineTo(size, x);
      g.stroke();
    }
    g.globalCompositeOperation = "destination-in";
    const fade = g.createRadialGradient(size / 2, size / 2, size * 0.12, size / 2, size / 2, size / 2);
    fade.addColorStop(0, "rgba(0,0,0,1)");
    fade.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = fade;
    g.fillRect(0, 0, size, size);
  }, 1024);
}

function radialTexture(inner: string, outer: string) {
  return makeTexture((g, size) => {
    const fade = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    fade.addColorStop(0, inner);
    fade.addColorStop(1, outer);
    g.fillStyle = fade;
    g.fillRect(0, 0, size, size);
  }, 128);
}

function iconTexture(kind: NodeId | "check" | "in") {
  return makeTexture((g, S) => {
    g.strokeStyle = "#101828";
    g.lineWidth = 9;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.fillStyle = "#101828";
    g.translate(S / 2, S / 2);
    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      g.beginPath();
      g.roundRect(x, y, w, h, r);
      g.stroke();
    };
    if (kind === "crm") {
      rr(-70, -62, 140, 36, 8);
      rr(-70, -18, 140, 36, 8);
      rr(-70, 26, 140, 36, 8);
      for (const y of [-44, 0, 44]) {
        g.beginPath();
        g.arc(-46, y, 5, 0, Math.PI * 2);
        g.fill();
        g.beginPath();
        g.moveTo(-26, y);
        g.lineTo(40, y);
        g.stroke();
      }
    } else if (kind === "sms") {
      rr(-72, -58, 144, 96, 18);
      g.beginPath();
      g.moveTo(-34, 38);
      g.lineTo(-48, 70);
      g.lineTo(-6, 38);
      g.stroke();
      for (const x of [-30, 0, 30]) {
        g.beginPath();
        g.arc(x, -10, 8, 0, Math.PI * 2);
        g.fill();
      }
    } else if (kind === "email") {
      rr(-74, -52, 148, 104, 10);
      g.beginPath();
      g.moveTo(-66, -42);
      g.lineTo(0, 10);
      g.lineTo(66, -42);
      g.stroke();
    } else if (kind === "voice") {
      const bars = [-60, -36, -12, 12, 36, 60];
      const heights = [22, 58, 90, 70, 44, 20];
      bars.forEach((x, i) => {
        const h = heights[i];
        g.beginPath();
        g.moveTo(x, -h / 2);
        g.lineTo(x, h / 2);
        g.stroke();
      });
    } else if (kind === "cal") {
      rr(-70, -56, 140, 124, 10);
      g.beginPath();
      g.moveTo(-70, -22);
      g.lineTo(70, -22);
      g.stroke();
      g.beginPath();
      g.moveTo(-36, -74);
      g.lineTo(-36, -44);
      g.moveTo(36, -74);
      g.lineTo(36, -44);
      g.stroke();
      for (let r = 0; r < 3; r++) {
        for (let k = 0; k < 4; k++) {
          if (r === 1 && k === 2) {
            g.fillStyle = "#2e9e45";
            g.fillRect(-52 + k * 30, -6 + r * 24, 18, 16);
            g.fillStyle = "#101828";
          } else {
            g.fillRect(-48 + k * 30, -2 + r * 24, 10, 8);
          }
        }
      }
    } else if (kind === "check") {
      g.strokeStyle = "#ffffff";
      g.lineWidth = 14;
      g.beginPath();
      g.moveTo(-48, -6);
      g.lineTo(-14, 48);
      g.lineTo(48, -62);
      g.stroke();
    } else {
      g.beginPath();
      g.moveTo(-50, 0);
      g.lineTo(40, 0);
      g.moveTo(10, -30);
      g.lineTo(42, 0);
      g.lineTo(10, 30);
      g.stroke();
    }
  }, 256);
}

function route(points: THREE.Vector3[], radius = 0.28) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  let prev = points[0];
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (i < points.length - 1) {
      const next = points[i + 1];
      const a = point.clone().add(prev.clone().sub(point).setLength(radius));
      const b = point.clone().add(next.clone().sub(point).setLength(radius));
      path.add(new THREE.LineCurve3(prev, a));
      path.add(new THREE.QuadraticBezierCurve3(a, point, b));
      prev = b;
    } else {
      path.add(new THREE.LineCurve3(prev, point));
    }
  }
  return path;
}

function tagFor(tags: HTMLElement, label: string, sub: string, extra = "") {
  const el = document.createElement("div");
  el.className = `hl-tag${extra ? ` ${extra}` : ""}`;
  const text = document.createElement("div");
  text.className = "hl-t";
  const dot = document.createElement("span");
  dot.className = "hl-d";
  text.append(dot, document.createTextNode(label));
  if (sub) {
    const small = document.createElement("small");
    small.textContent = sub;
    text.append(small);
  }
  const lead = document.createElement("div");
  lead.className = "hl-lead";
  el.append(text, lead);
  tags.append(el);
  return el;
}

export function createLeadScene(host: HTMLElement, tags: HTMLElement): LeadScene | null {
  const mobileAtStart = window.innerWidth < 1024;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !mobileAtStart,
      alpha: true,
      powerPreference: mobileAtStart ? "low-power" : "default",
    });
  } catch {
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.pointerEvents = "none";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const look = new THREE.Vector3(0.1, 0.9, 0.45);
  camera.position.set(
    Math.sin(AZ) * Math.cos(EL) * RADIUS,
    Math.sin(EL) * RADIUS,
    Math.cos(AZ) * Math.cos(EL) * RADIUS
  );
  camera.position.add(look);
  camera.lookAt(look);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9ddd3, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(-4, 10, 6);
  scene.add(sun);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(geometry: T) => {
    geometries.push(geometry);
    return geometry;
  };
  const trackMat = <T extends THREE.Material>(material: T) => {
    materials.push(material);
    return material;
  };
  const trackTex = (texture: THREE.Texture | null) => {
    if (!texture) return null;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.push(texture);
    return texture;
  };

  const gridMap = trackTex(gridTexture());
  if (gridMap) {
    const grid = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(16, 16)),
      trackMat(new THREE.MeshBasicMaterial({ map: gridMap, transparent: true, depthWrite: false }))
    );
    grid.rotation.x = -Math.PI / 2;
    scene.add(grid);
  }

  const shadowMap = trackTex(radialTexture("rgba(16,24,40,0.30)", "rgba(16,24,40,0)"));
  const glowMap = trackTex(radialTexture("rgba(46,158,69,0.55)", "rgba(46,158,69,0)"));
  const outlineMat = trackMat(new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide }));
  const tileGeo = trackGeo(new RoundedBoxGeometry(TILE, TH, TILE, 4, 0.09));
  const tubeMat = trackMat(new THREE.MeshBasicMaterial({ color: GREEN }));
  const dashMat = trackMat(
    new THREE.LineDashedMaterial({
      color: 0x8a94a6,
      dashSize: 0.12,
      gapSize: 0.1,
      transparent: true,
      opacity: 0,
    })
  );

  const nodeSpecs: Array<Omit<SceneNode, "phase" | "group" | "ledMat" | "shadow" | "shadowMat" | "tag">> = [
    { id: "crm", label: "CRM", sub: "GoHighLevel", at: P(-2.2, 0), sc: [0.35, 1.7, 0.45], rot: [0.1, 0.55, -0.07], snap: [0.27, 0.33] },
    { id: "sms", label: "SMS", sub: "Twilio", at: P(0, -2.15), sc: [1, 2, -0.7], rot: [-0.08, -0.45, 0.1], snap: [0.4, 0.45] },
    { id: "email", label: "Email", sub: "Mailgun", at: P(0, 2.15), sc: [-0.2, 0.55, 0.15], rot: [0.07, 0.3, 0.06], snap: [0.4, 0.45] },
    { id: "voice", label: "Voice Agent", sub: "Voice AI", at: P(0, 0), sc: [-1.1, 3, -2.4], rot: [-0.1, -0.25, -0.09], snap: [0.52, 0.57] },
    { id: "cal", label: "Calendar", sub: "Booking", at: P(2.2, 0), sc: [0.9, 1, 0.9], rot: [0.09, 0.4, 0.08], snap: [0.64, 0.69] },
  ];

  const nodes: SceneNode[] = nodeSpecs.map((spec, index) => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(
      tileGeo,
      trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, metalness: 0 }))
    );
    const outline = new THREE.Mesh(tileGeo, outlineMat);
    outline.scale.set(1.035, 1.12, 1.035);
    const iconMap = trackTex(iconTexture(spec.id));
    const icon = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(0.78, 0.78)),
      trackMat(new THREE.MeshBasicMaterial({ map: iconMap, transparent: true, depthWrite: false }))
    );
    icon.rotation.set(-Math.PI / 2, 0, AZ);
    icon.position.y = TH / 2 + 0.002;
    const ledMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xc4c9c0 }));
    const led = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 16)), ledMat);
    led.position.set(TILE / 2 - 0.16, TH / 2 + 0.01, TILE / 2 - 0.16);
    group.add(outline, mesh, icon, led);
    scene.add(group);

    const shadowMat = trackMat(
      new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false })
    );
    const shadow = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(2.1, 2.1)), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(spec.at.x, 0.004, spec.at.z);
    scene.add(shadow);

    return {
      ...spec,
      phase: index * 1.7,
      group,
      ledMat,
      shadow,
      shadowMat,
      tag: tagFor(tags, spec.label, spec.sub),
    };
  });

  function pin(color: number, kind: "in" | "check") {
    const group = new THREE.Group();
    const geo = trackGeo(new THREE.CylinderGeometry(0.34, 0.34, 0.16, 32));
    const mesh = new THREE.Mesh(geo, trackMat(new THREE.MeshStandardMaterial({ color, roughness: 0.7 })));
    const outline = new THREE.Mesh(geo, outlineMat);
    outline.scale.set(1.06, 1.18, 1.06);
    const icon = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(0.5, 0.5)),
      trackMat(
        new THREE.MeshBasicMaterial({
          map: trackTex(iconTexture(kind)),
          transparent: true,
          depthWrite: false,
        })
      )
    );
    icon.rotation.set(-Math.PI / 2, 0, AZ);
    icon.position.y = 0.082;
    group.add(outline, mesh, icon);
    scene.add(group);
    return group;
  }

  const entryAt = P(-4.05, 0);
  const bookAt = P(4.05, 0);
  const entry = pin(0xffffff, "in");
  entry.position.copy(entryAt);
  entry.scale.setScalar(0.0001);

  const booked = new THREE.Group();
  const bookGeo = trackGeo(new RoundedBoxGeometry(0.95, 0.26, 0.95, 4, 0.08));
  const bookMesh = new THREE.Mesh(bookGeo, trackMat(new THREE.MeshStandardMaterial({ color: INK, roughness: 0.6 })));
  const bookOutline = new THREE.Mesh(
    bookGeo,
    trackMat(new THREE.MeshBasicMaterial({ color: GREEN, side: THREE.BackSide }))
  );
  bookOutline.scale.set(1.05, 1.12, 1.05);
  const bookIcon = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(0.6, 0.6)),
    trackMat(
      new THREE.MeshBasicMaterial({
        map: trackTex(iconTexture("check")),
        transparent: true,
        depthWrite: false,
      })
    )
  );
  bookIcon.rotation.set(-Math.PI / 2, 0, AZ);
  bookIcon.position.y = 0.132;
  bookIcon.scale.setScalar(1.15);
  booked.add(bookOutline, bookMesh, bookIcon);
  booked.position.copy(bookAt);
  booked.scale.setScalar(0.0001);
  scene.add(booked);

  const entryTag = tagFor(tags, "New lead", "form · ad · call");
  const bookTag = tagFor(tags, "Appointment booked", "", "hl-end hl-below");
  const lostTag = tagFor(tags, "Lead lost", "", "hl-lost hl-below");

  const half = TILE / 2 + 0.04;
  const edgeSpecs: Array<{ key: string; pts: THREE.Vector3[]; draw: [number, number] }> = [
    { key: "in", pts: [P(-4.05 + 0.36, 0), P(-2.2 - half, 0)], draw: [0.31, 0.37] },
    { key: "sms", pts: [P(-2.2, -half), P(-2.2, -2.15), P(-half, -2.15)], draw: [0.44, 0.5] },
    { key: "email", pts: [P(-2.2, half), P(-2.2, 2.15), P(-half, 2.15)], draw: [0.44, 0.5] },
    { key: "voice", pts: [P(-2.2 + half, 0), P(-half, 0)], draw: [0.56, 0.62] },
    { key: "cal", pts: [P(half, 0), P(2.2 - half, 0)], draw: [0.68, 0.74] },
    { key: "book", pts: [P(2.2 + half, 0), P(4.05 - 0.5, 0)], draw: [0.8, 0.85] },
  ];

  const edges: Edge[] = edgeSpecs.map((spec) => {
    const curve = route(spec.pts);
    const tubular = Math.max(24, Math.round(curve.getLength() * 28));
    const geo = trackGeo(new THREE.TubeGeometry(curve, tubular, 0.038, 8, false));
    const mesh = new THREE.Mesh(geo, tubeMat);
    geo.setDrawRange(0, 0);
    scene.add(mesh);
    const flat = curve.getPoints(60).map((point) => new THREE.Vector3(point.x, 0.006, point.z));
    const line = new THREE.Line(trackGeo(new THREE.BufferGeometry().setFromPoints(flat)), dashMat);
    line.computeLineDistances();
    scene.add(line);
    const head = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.06, 12, 8)), tubeMat);
    head.visible = false;
    scene.add(head);
    return { key: spec.key, curve, geo, count: geo.index ? geo.index.count : 0, head, draw: spec.draw };
  });

  nodes.forEach((node) => {
    const s = TILE / 2 + 0.06;
    const corners = [
      [-s, -s],
      [s, -s],
      [s, s],
      [-s, s],
      [-s, -s],
    ].map(([x, z]) => new THREE.Vector3(node.at.x + x, 0.006, node.at.z + z));
    const line = new THREE.Line(trackGeo(new THREE.BufferGeometry().setFromPoints(corners)), dashMat);
    line.computeLineDistances();
    scene.add(line);
  });

  const lead = new THREE.Group();
  const leadMat = trackMat(new THREE.MeshBasicMaterial({ color: GREEN }));
  const leadCore = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.1, 20, 14)), leadMat);
  const glowMat = trackMat(
    new THREE.SpriteMaterial({ map: glowMap, transparent: true, depthWrite: false })
  );
  const leadGlow = new THREE.Sprite(glowMat);
  leadGlow.scale.set(0.75, 0.75, 1);
  lead.add(leadGlow, leadCore);
  scene.add(lead);

  const trail = Array.from({ length: 6 }, (_, i) => {
    const material = trackMat(
      new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.35 * (1 - i / 6) })
    );
    const mesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.07 * (1 - i * 0.12), 10, 8)), material);
    scene.add(mesh);
    return { mesh, material };
  });
  const history = Array.from({ length: 24 }, () => new THREE.Vector3());
  let historyIndex = 0;

  const pulses = ["sms", "email"].map(() => {
    const mesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.065, 12, 8)), tubeMat);
    mesh.visible = false;
    scene.add(mesh);
    return mesh;
  });

  const ringMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x8a94a6,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    })
  );
  const ring = new THREE.Mesh(trackGeo(new THREE.RingGeometry(0.18, 0.2, 40)), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(-1.1, 0.008, 0);
  scene.add(ring);

  const fallAt = new THREE.Vector3(-1.1, 0, 0);
  const flow = new THREE.LineCurve3(P(-4.05, 0), P(4.05, 0));
  const proj = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  let prog = 0;
  let last = performance.now();
  let mobile = mobileAtStart;

  function place(el: HTMLElement, pos: THREE.Vector3, show = 1) {
    proj.copy(pos).project(camera);
    const x = ((proj.x + 1) / 2) * host.clientWidth;
    const y = ((1 - proj.y) / 2) * host.clientHeight;
    const below = el.classList.contains("hl-below");
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, ${below ? "0%" : "-100%"})`;
    el.style.opacity = show <= 0.01 ? "0" : show.toFixed(3);
  }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width === 0 || height === 0) return;
    mobile = window.innerWidth < 1024;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const span = mobile ? Math.max(9.6 / aspect, 5.4) : Math.max(10.2 / aspect, 7.2);
    camera.top = span / 2;
    camera.bottom = -span / 2;
    camera.left = (-span * aspect) / 2;
    camera.right = (span * aspect) / 2;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }

  function tick(target: number) {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    prog += (target - prog) * Math.min(1, dt * 7);
    if (Math.abs(target - prog) < 0.0001) prog = target;
    const p = prog;
    const t = now / 1000;

    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

    nodes.forEach((node) => {
      const scattered = 1 - eio(seg(p, node.snap[0], node.snap[1]));
      const drift = scattered;
      const liftScale = mobile ? 0.62 : 1;
      node.group.position.set(
        node.at.x + node.sc[0] * scattered,
        node.at.y + node.sc[1] * scattered * liftScale + Math.sin(t * 0.8 + node.phase) * 0.09 * drift,
        node.at.z + node.sc[2] * scattered
      );
      node.group.rotation.set(
        node.rot[0] * scattered + Math.sin(t * 0.6 + node.phase) * 0.03 * drift,
        node.rot[1] * scattered,
        node.rot[2] * scattered + Math.cos(t * 0.5 + node.phase) * 0.03 * drift
      );
      const lift = node.group.position.y - Y;
      node.shadowMat.opacity = clamp(1 - lift / 3.2) * 0.9;
      node.shadow.scale.setScalar(1 + lift * 0.25);
      node.shadow.position.set(node.group.position.x, 0.004, node.group.position.z);
      const seated = scattered < 0.02;
      node.ledMat.color.set(seated ? GREEN : 0xc4c9c0);
      node.tag.classList.toggle("is-on", seated);
      tmp.set(node.group.position.x, node.group.position.y + 0.32, node.group.position.z);
      place(node.tag, tmp, 1);
    });

    const entryIn = ease(seg(p, 0.27, 0.31));
    entry.scale.setScalar(Math.max(0.0001, entryIn));
    tmp.set(entryAt.x, Y + 0.22, entryAt.z);
    place(entryTag, tmp, entryIn);

    const bookedIn = ease(seg(p, 0.77, 0.81));
    booked.scale.setScalar(Math.max(0.0001, bookedIn));
    booked.position.y = Y + (1 - bookedIn) * 0.6;
    tmp.set(bookAt.x + 0.35, booked.position.y - 0.15, bookAt.z + 0.35);
    place(bookTag, tmp, bookedIn);

    dashMat.opacity = 0.85 * ease(seg(p, 0.14, 0.22)) * (1 - ease(seg(p, 0.8, 0.9)));

    edges.forEach((edge) => {
      const amount = eio(seg(p, edge.draw[0], edge.draw[1]));
      const count = Math.floor((edge.count * amount) / 3) * 3;
      edge.geo.setDrawRange(0, count);
      edge.head.visible = amount > 0 && amount < 1;
      if (edge.head.visible) edge.head.position.copy(edge.curve.getPointAt(amount));
    });

    let leadPos: THREE.Vector3 | null = null;
    let alpha = 1;
    if (p < 0.27) {
      const cycle = (t % 3.4) / 3.4;
      const fall = clamp(cycle / 0.72);
      const fy = 3.2 - 3.2 * (fall * fall);
      tmp.set(fallAt.x, Math.max(0.1, fy), fallAt.z);
      leadPos = tmp;
      alpha = cycle < 0.72 ? 1 : clamp(1 - (cycle - 0.72) / 0.2);
      const ringProgress = clamp((cycle - 0.7) / 0.3);
      ring.scale.setScalar(1 + ringProgress * 3);
      ringMat.opacity = cycle > 0.7 ? (1 - ringProgress) * 0.9 : 0;
      const lostOn = ease(seg(p, 0.13, 0.18)) * (1 - ease(seg(p, 0.25, 0.27)));
      if (lostOn > 0) {
        ringMat.opacity = Math.max(ringMat.opacity, 0.6 * lostOn);
        if (cycle <= 0.7) ring.scale.setScalar(1.6);
      }
      proj.set(fallAt.x + 0.5, 0, fallAt.z + 0.5);
      place(lostTag, proj, lostOn);
    } else {
      ringMat.opacity = 0;
      place(lostTag, fallAt, 0);
      pulses.forEach((pulse) => {
        pulse.visible = false;
      });
      if (p >= 0.85) {
        const cycle = (t % 5) / 5;
        const along = eio(clamp(cycle / 0.8));
        if (cycle >= 0.8) {
          tmp.copy(bookAt);
          tmp.y += 0.25 + Math.sin((cycle - 0.8) * 20) * 0.03;
        } else {
          tmp.copy(flow.getPointAt(along));
          tmp.y += 0.3;
        }
        leadPos = tmp;
        alpha = cycle < 0.8 ? 1 : clamp(1 - (cycle - 0.86) / 0.14);
        const crmU = (4.05 - 2.2) / 8.1;
        const pulseAlong = clamp((along - crmU) / 0.18);
        ["sms", "email"].forEach((key, index) => {
          const edge = edges.find((item) => item.key === key);
          const pulse = pulses[index];
          if (!edge || !pulse) return;
          pulse.visible = along > crmU && pulseAlong < 1;
          if (pulse.visible) pulse.position.copy(edge.curve.getPointAt(pulseAlong));
        });
      } else if (p >= 0.31) {
        const stops: Array<[number, number]> = [
          [0.31, -4.05],
          [0.37, -2.2],
          [0.62, 0],
          [0.74, 2.2],
        ];
        let x = -4.05;
        for (const [at, value] of stops) if (p >= at) x = value;
        tmp.set(x, Y + 0.42 + Math.sin(t * 2.2) * 0.04, 0);
        leadPos = tmp;
        alpha = 1;
      }
    }

    if (leadPos) {
      lead.visible = true;
      lead.position.copy(leadPos);
      leadMat.opacity = alpha;
      leadMat.transparent = alpha < 1;
      glowMat.opacity = alpha * 0.9;
      leadGlow.scale.setScalar(0.7 + Math.sin(t * 3) * 0.06);
      historyIndex = (historyIndex + 1) % history.length;
      history[historyIndex].copy(leadPos);
      trail.forEach((item, index) => {
        const sample = history[(historyIndex - (index + 1) * 3 + history.length * 4) % history.length];
        item.mesh.position.copy(sample);
        item.mesh.visible = true;
        item.material.opacity = 0.3 * (1 - index / 6) * alpha;
      });
    } else {
      lead.visible = false;
      trail.forEach((item) => {
        item.mesh.visible = false;
      });
    }

    renderer.render(scene, camera);
  }

  resize();

  return {
    tick,
    resize,
    dispose() {
      tags.replaceChildren();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
