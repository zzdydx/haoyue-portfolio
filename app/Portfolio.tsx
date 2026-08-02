"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";

type View = "home" | "works" | "about";
type WorkProject = { title: string; year: string; tags: string; categoryIndex: number; images: string[]; thumbnail?: string; featuredImages?: string[]; featuredTitle?: string; featuredDescription?: string; featuredTools?: string; detailIntro?: string[]; detailTools?: string; detailVariant?: "motion-strip" };

const categories = ["实习项目", "品牌宣传", "插图", "UI/UX设计", "图标/动效设计", "3D技术"];
const categoryColors = ["#3e7fff", "#d9d9d9", "#e8e8e8", "#a8a8a8", "#3e7fff", "#dedede"];
const categoryTextColors = ["#fff", "#868686", "#868686", "#fff", "#fff", "#868686"];
const categoryLayouts = [
  { left: 0, top: 394, width: 723.5, height: 265, z: 1 },
  { left: 720, top: 394, width: 717, height: 266, z: 3 },
  { left: 0, top: 587, width: 723.5, height: 256, z: 2 },
  { left: 614, top: 587, width: 823, height: 256, z: 4 },
  { left: 0, top: 768, width: 723.5, height: 256, z: 5 },
  { left: 720, top: 768, width: 717, height: 256, z: 6 },
];
const previewRects = [
  [{ left: 40, top: 285.48, size: 337.44 }, { left: 412.71, top: 254, width: 305.2, height: 323.91 }, { left: 227.73, top: 287.34, width: 322.25, height: 298.4 }],
  [{ left: 752, top: 245.48, size: 337.44 }, { left: 1124.71, top: 214, width: 305.2, height: 323.91 }, { left: 939.73, top: 247.34, width: 322.25, height: 298.4 }],
  [{ left: 20, top: 401.48, size: 337.44 }, { left: 392.71, top: 370, width: 305.2, height: 323.91 }, { left: 207.73, top: 403.34, width: 322.25, height: 298.4 }],
  [{ left: 728, top: 455.48, size: 337.44 }, { left: 1100.71, top: 424, width: 305.2, height: 323.91 }, { left: 915.73, top: 457.34, width: 322.25, height: 298.4 }],
  [{ left: 0, top: 672.48, size: 337.44 }, { left: 372.71, top: 641, width: 305.2, height: 323.91 }, { left: 187.73, top: 674.34, width: 322.25, height: 298.4 }],
  [{ left: 776, top: 649.48, size: 337.44 }, { left: 1148.71, top: 618, width: 305.2, height: 323.91 }, { left: 963.73, top: 651.34, width: 322.25, height: 298.4 }],
];
const categoryPreviewGroups = [
  ["/works/图片组/01-实习项目/实习-01.webp", "/works/图片组/01-实习项目/实习-02.webp", "/works/图片组/01-实习项目/实习-03.webp"],
  ["/works/图片组/02-品牌宣传/品牌-01.webp", "/works/图片组/02-品牌宣传/品牌-02.webp", "/works/图片组/02-品牌宣传/品牌-03.webp"],
  ["/works/图片组/03-插图/插画-01.webp", "/works/图片组/03-插图/插画-02.webp", "/works/图片组/03-插图/插画-03.webp"],
  ["/works/图片组/04-UI:UX设计/UX-01.webp", "/works/图片组/04-UI:UX设计/UX-02.webp", "/works/图片组/04-UI:UX设计/UX-03.webp"],
  ["/works/图片组/05-图标:动效设计/图标-01.webp", "/works/图片组/05-图标:动效设计/图标-02.webp", "/works/图片组/05-图标:动效设计/图标-03.webp"],
  ["/works/图片组/06-3D技术/建模-01.webp", "/works/图片组/06-3D技术/建模-02.webp", "/works/图片组/06-3D技术/建模-03.webp"],
];
const signTexturePaths = [
  "/works/指路牌贴图/实习项目.webp",
  "/works/指路牌贴图/品牌宣传.webp",
  "/works/指路牌贴图/插图.webp",
  "/works/指路牌贴图/UX设计.webp",
  "/works/指路牌贴图/动效设计.webp",
  "/works/指路牌贴图/3D技术.webp",
];
const workProjects: WorkProject[] = [
  { title: "宝马南京实习项目 - 反向工程", year: "2025", tags: "UI DESIGN / INTERNSHIP / REVERSE ENGINEERING", categoryIndex: 0, images: [23, 24, 25, 26, 27, 28, 29].map((id) => `/works/03-bmw-reverse-engineering/${id}.webp`), thumbnail: "/works/缩略图/bmw.webp", featuredImages: ["/works/featured work/bmw-reverse-engineering.webp"], featuredTitle: "BMW反向工程｜AI开发者PC端产品", featuredDescription: "面向开发人员，对AI开发者工具进行产品反向分析与体验设计，重新梳理产品的信息架构、功能层级和核心使用流程，重点优化首页的信息组织与交互呈现，降低用户理解复杂代码项目和技术信息的成本。", featuredTools: "Figma、Photoshop、Illustrator", detailIntro: ["面向开发人员，对AI开发者工具进行产品反向分析与体验设计，重新梳理产品的信息架构、功能层级和核心使用流程，重点优化首页的信息组织与交互呈现，降低用户理解复杂代码项目和技术信息的成本。"], detailTools: "Figma、Photoshop、Illustrator" },
  { title: "品牌宣传", year: "2026", tags: "BRANDING / PROMOTION", categoryIndex: 1, images: ["/works/05-brand-promotion/05-brand-promotion.webp"], detailIntro: [] },
  { title: "插画作品", year: "2026", tags: "ILLUSTRATION / VISUAL", categoryIndex: 2, images: [31, 32].map((id) => `/works/04-illustration/${id}.webp`), featuredTitle: "插画设计｜扁平化视觉风格", detailIntro: ["以扁平矢量插画为主要表现形式，通过几何造型、渐变色彩和简洁线条，呈现协作、沟通、创作与数字生活等主题。整体风格轻快现代，注重画面构成、色彩层次与人物动作的视觉表达。", "使用Figma完成构图、矢量绘制与配色调整，并通过ChatGPT辅助主题构思、关键词提炼和创意方案迭代。"], detailTools: "Figma、ChatGPT" },
  { title: "Bluebird travel", year: "2026", tags: "APP / UIUX / TRAVEL", categoryIndex: 3, images: [13, 14, 15, 16, 17, 18, 19, 20, 21].map((id) => `/works/02-bluebird-travel/${id}.webp`), thumbnail: "/works/缩略图/bluebird.webp", featuredImages: ["/works/featured work/bluebird-travel.webp"], featuredTitle: "青鸟旅行｜AI旅行规划APP", featuredDescription: "面向年轻旅行用户，针对攻略信息分散、行程规划复杂和个性化不足等问题，设计AI攻略生成、路线推荐、住宿与交通比价以及旅行咨询等功能，帮助用户更高效地完成行前规划与旅行决策。", featuredTools: "Figma、Photoshop、Illustrator、AIGC工具", detailIntro: ["面向年轻旅行用户，针对攻略信息分散、行程规划复杂和个性化不足等问题，设计AI攻略生成、路线推荐、住宿与交通比价以及旅行咨询等功能，帮助用户更高效地完成行前规划与旅行决策。"], detailTools: "Figma、Photoshop、Illustrator、AIGC工具" },
  { title: "Good Cases", year: "2026", tags: "GOOD CASES / INTERFACE / MOTION", categoryIndex: 3, images: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => `/works/01-good-cases/${id}.webp`), thumbnail: "/works/缩略图/goodcases.webp", featuredImages: ["/works/featured work/good-cases.webp"], featuredTitle: "好箱子｜社区智能纸箱回收系统", featuredDescription: "针对社区纸箱堆放杂乱、回收设备状态不透明以及居民参与动力不足等问题，设计智能回收装置与移动端应用。通过回收点查询、纸箱流程追踪、积分兑换和徽章激励等功能，构建线上线下结合的社区回收服务闭环。", featuredTools: "Figma、Photoshop、Illustrator", detailIntro: ["针对社区纸箱堆放杂乱、回收设备状态不透明以及居民参与动力不足等问题，设计智能回收装置与移动端应用。通过回收点查询、纸箱流程追踪、积分兑换和徽章激励等功能，构建线上线下结合的社区回收服务闭环。"], detailTools: "Figma、Photoshop、Illustrator" },
  { title: "艺学", year: "2024", tags: "APP / UIUX / EDUCATION", categoryIndex: 3, images: [19, 20, 21, 22].map((id) => `/works/ui-yixue/${id}.webp`), thumbnail: "/works/缩略图/yixue.webp", detailIntro: ["受疫情影响，学校线下教学受到限制，师生需要依赖线上平台完成课程教学与日常事务。但现有平台功能复杂，且难以与学校办公系统衔接，增加了师生的操作成本。", "本项目面向南京艺术学院在校教师与学生，通过问卷、访谈、竞品分析和用户需求梳理，研究师生在线上授课、课程管理及校园事务处理中的使用痛点，为后续构建集教学与校园办公于一体的专属平台提供设计依据。"], detailTools: "Figma、Photoshop、Illustrator" },
  { title: "图标 / 动效设计", year: "2026", tags: "ICON DESIGN / MOTION / FILM STRIP", categoryIndex: 4, images: categoryPreviewGroups[4], detailVariant: "motion-strip" },
  { title: "3D 建模作品", year: "2026", tags: "3D MODELING / VISUAL", categoryIndex: 5, images: ["/works/06-3d-modeling/06-3d-modeling.webp"], detailIntro: [] },
];
const featuredProjects = [
  workProjects.find((item) => item.title === "Good Cases"),
  workProjects.find((item) => item.title === "Bluebird travel"),
  workProjects.find((item) => item.title === "宝马南京实习项目 - 反向工程"),
].filter((item): item is WorkProject => Boolean(item));
const directDetailCategories = new Set([1, 2, 4, 5]);
const categoryProject = (index: number) => workProjects.find((item) => item.categoryIndex === index) ?? workProjects[0];
const categoryPreviewImages = (index: number) => categoryPreviewGroups[index] ?? [];
const experiences = [
  { year: "2026/06-2026/08", company: "指南者留学", location: "江苏·南京", role: "UI设计实习生" },
  { year: "2026/01-2026/06", company: "三星电子(中国)研发中心", location: "江苏·南京", role: "视觉设计实习生（UX部门）" },
  { year: "2025/08-2026/01", company: "宝马(南京)信息技术有限公司", location: "江苏·南京", role: "UI设计实习生" },
];
const experienceImages = categoryPreviewGroups[0];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function assetPath(path: string) {
  if (!basePath || /^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

function makeArtwork(index: number, label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 512;
  const context = canvas.getContext("2d")!;
  const bases = ["#b8c9ed", "#f1e49b", "#d6d8da", "#a9bde6", "#e8e8e8", "#f0b098"];
  context.fillStyle = bases[index];
  context.fillRect(0, 0, 768, 512);
  context.fillStyle = "rgba(255,255,255,.72)";
  if (index % 3 === 0) {
    context.beginPath(); context.moveTo(500, 70); context.lineTo(690, 415); context.lineTo(335, 415); context.closePath(); context.fill();
  } else if (index % 3 === 1) {
    context.beginPath(); context.arc(150, 135, 94, 0, Math.PI * 2); context.fill();
  } else {
    context.fillRect(355, 85, 280, 320);
  }
  context.fillStyle = "#111";
  context.font = "600 48px Arial";
  context.fillText(String(index + 1).padStart(2, "0"), 42, 450);
  context.font = "500 38px Arial";
  context.fillText(label, 145, 450);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  return texture;
}

function makeContainedTexture(image: CanvasImageSource, width: number, height: number, offsetYRatio = 0, textureScale = 1, offsetXRatio = 0) {
  const aspect = width / height;
  const canvas = document.createElement("canvas");
  canvas.width = aspect >= 1 ? 1200 : Math.max(1, Math.round(1200 * aspect));
  canvas.height = aspect >= 1 ? Math.max(1, Math.round(1200 / aspect)) : 1200;
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const sourceWidth = "naturalWidth" in image ? image.naturalWidth : image.width;
  const sourceHeight = "naturalHeight" in image ? image.naturalHeight : image.height;
  const scale = Math.min(canvas.width / Number(sourceWidth), canvas.height / Number(sourceHeight)) * textureScale;
  const drawWidth = Number(sourceWidth) * scale;
  const drawHeight = Number(sourceHeight) * scale;
  const x = (canvas.width - drawWidth) / 2 + canvas.width * offsetXRatio;
  const y = (canvas.height - drawHeight) / 2 + canvas.height * offsetYRatio;
  context.drawImage(image, x, y, drawWidth, drawHeight);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
}

function makeCroppedStickerTexture(image: CanvasImageSource, crop: { x: number; y: number; width: number; height: number }) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = Math.max(1, Math.round(512 * (crop.height / crop.width)));
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const sourceWidth = Number("naturalWidth" in image ? image.naturalWidth : image.width);
  const sourceHeight = Number("naturalHeight" in image ? image.naturalHeight : image.height);
  context.drawImage(
    image,
    crop.x * sourceWidth,
    crop.y * sourceHeight,
    crop.width * sourceWidth,
    crop.height * sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
}

function makePoleStickerCollageTexture(images: CanvasImageSource[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 2800;
  canvas.height = 5200;
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.scale(2, 2);
  const placements = [
    [90, 90, 255, -0.06], [520, 68, 210, 0.08], [965, 120, 240, -0.14],
    [255, 350, 190, 0.16], [700, 320, 245, -0.08], [1120, 390, 185, 0.12],
    [55, 605, 200, -0.18], [405, 585, 235, 0.1], [805, 625, 205, -0.04], [1130, 660, 215, 0.18],
    [165, 875, 230, 0.06], [570, 850, 200, -0.12], [955, 910, 255, 0.13],
    [45, 1125, 190, 0.2], [350, 1100, 235, -0.06], [720, 1135, 215, 0.12], [1090, 1180, 235, -0.18],
    [125, 1390, 250, -0.1], [520, 1370, 200, 0.16], [880, 1420, 220, -0.02], [1180, 1460, 185, 0.12],
    [70, 1690, 200, 0.08], [380, 1660, 245, -0.15], [770, 1710, 210, 0.16], [1090, 1680, 240, -0.06],
    [155, 1985, 210, -0.2], [585, 1960, 250, 0.08], [965, 2010, 230, 0.14],
    [60, 2260, 235, 0.12], [460, 2230, 210, -0.12], [850, 2280, 250, 0.08], [1160, 2240, 190, -0.18],
  ];
  placements.forEach(([x, y, targetWidth, rotation], index) => {
    const image = images[index % images.length];
    const sourceWidth = Number("naturalWidth" in image ? image.naturalWidth : image.width);
    const sourceHeight = Number("naturalHeight" in image ? image.naturalHeight : image.height);
    const width = Number(targetWidth);
    const height = width * (sourceHeight / Math.max(sourceWidth, 1));
    context.save();
    context.translate(x + width / 2, y + height / 2);
    context.rotate(Number(rotation));
    context.drawImage(image, -width / 2, -height / 2, width, height);
    context.restore();
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function roundedRectShape(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function triangleShape(width: number, height: number, radius: number | [number, number, number]) {
  const points = [
    new THREE.Vector2(0, height / 2),
    new THREE.Vector2(width / 2, -height / 2),
    new THREE.Vector2(-width / 2, -height / 2),
  ];
  const radii = Array.isArray(radius) ? radius : [radius, radius, radius];
  const shape = new THREE.Shape();
  points.forEach((point, index) => {
    const prev = points[(index + 2) % 3];
    const next = points[(index + 1) % 3];
    const cornerRadius = radii[index];
    const from = point.clone().lerp(prev, cornerRadius);
    const to = point.clone().lerp(next, cornerRadius);
    if (index === 0) shape.moveTo(from.x, from.y);
    else shape.lineTo(from.x, from.y);
    shape.quadraticCurveTo(point.x, point.y, to.x, to.y);
  });
  shape.closePath();
  return shape;
}

function makeBoardGeometry(kind: string, width: number, height: number, depth: number) {
  if (kind === "circle") return new THREE.CylinderGeometry(width / 2, width / 2, depth, 72).rotateX(Math.PI / 2);
  if (kind === "triangle") {
    const reducedHeight = height * 0.92;
    return new THREE.ExtrudeGeometry(triangleShape(width, reducedHeight, [0.08, 0.12, 0.12]), { depth, bevelEnabled: false }).translate(0, (height - reducedHeight) / 2, -depth / 2);
  }
  return new THREE.ExtrudeGeometry(roundedRectShape(width, height, 0.12), { depth, bevelEnabled: false }).translate(0, 0, -depth / 2);
}

function faceSize(kind: string, width: number, height: number, fixedWidth?: number, fixedHeight?: number) {
  if (fixedWidth && fixedHeight) return { width: fixedWidth, height: fixedHeight };
  if (kind === "circle") return { width: width * 0.9, height: width * 0.9 };
  if (kind === "triangle") return { width: width * 0.88, height: height * 0.88 };
  const insetX = 0.06;
  const insetY = 0.1;
  return { width: Math.max(0.1, width - insetX * 2), height: Math.max(0.1, height - insetY * 2) };
}

function makePlaneGeometry(kind: string, width: number, height: number, fixedFaceWidth?: number, fixedFaceHeight?: number, clipToShape = true) {
  const size = faceSize(kind, width, height, fixedFaceWidth, fixedFaceHeight);
  const geometry = !clipToShape
    ? new THREE.PlaneGeometry(size.width, size.height)
    : kind === "circle"
    ? new THREE.CircleGeometry(size.width / 2, 72)
    : kind === "triangle"
      ? new THREE.ShapeGeometry(triangleShape(size.width, size.height, 0.06))
      : new THREE.ShapeGeometry(roundedRectShape(size.width, size.height, 0.08));
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const position = geometry.getAttribute("position");
  if (box && position) {
    const uv = new Float32Array(position.count * 2);
    const widthSpan = Math.max(0.0001, box.max.x - box.min.x);
    const heightSpan = Math.max(0.0001, box.max.y - box.min.y);
    for (let index = 0; index < position.count; index += 1) {
      uv[index * 2] = (position.getX(index) - box.min.x) / widthSpan;
      uv[index * 2 + 1] = 1 - (position.getY(index) - box.min.y) / heightSpan;
    }
    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  }
  return geometry;
}

function cylinderBetween(start: THREE.Vector3, end: THREE.Vector3, radius: number, material: THREE.Material) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 20), material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function makeCurvedStickerGeometry(width: number, height: number, radius: number) {
  const columns = 10;
  const rows = 2;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const arc = width / radius;
  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    const y = (v - 0.5) * height;
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns;
      const theta = (u - 0.5) * arc;
      positions.push(Math.sin(theta) * radius, y, Math.cos(theta) * radius);
      uvs.push(u, 1 - v);
    }
  }
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * (columns + 1) + column;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function Signpost3D({ onSelect }: { onSelect: (index: number | null) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.08, 8.4);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0xffffff, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x5f6268, 3.4));
    const key = new THREE.DirectionalLight(0xffffff, 4.8);
    key.position.set(5, 10, 10);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xaec9ff, 2.2);
    fill.position.set(-7, 5, -6);
    scene.add(fill);

    const stage = new THREE.Group();
    const rig = new THREE.Group();
    stage.add(rig);
    scene.add(stage);
    const clickable: THREE.Object3D[] = [];
    const signGroups: THREE.Group[] = [];
    const textures: THREE.Texture[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    let targetRotation = -0.38;
    let targetPitch = 0;
    let savedRotation = targetRotation;
    let savedPitch = targetPitch;
    let targetScale = 1;
    let targetShiftX = 0;
    let targetShiftY = 0;
    let savedShiftY = targetShiftY;
    let focused: number | null = null;
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let startRotation = 0;
    let startPitch = 0;
    let startShiftY = 0;

    const addMaterial = (material: THREE.Material) => {
      materials.push(material);
      return material;
    };
    const addGeometry = (geometry: THREE.BufferGeometry) => {
      geometries.push(geometry);
      return geometry;
    };
    const poleMaterial = addMaterial(new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.45, metalness: 0.25 }));
    const bandMaterial = addMaterial(new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.38, metalness: 0.62 }));
    const edgeMaterial = addMaterial(new THREE.MeshStandardMaterial({ color: 0x66696c, roughness: 0.35, metalness: 0.6 }));
    const bracketMaterial = addMaterial(new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 0.42, metalness: 0.25 }));
    const textureLoader = new THREE.TextureLoader();
    const pole = new THREE.Mesh(addGeometry(new THREE.CylinderGeometry(0.105, 0.105, 9.8, 48)), poleMaterial);
    rig.add(pole);
    const stickerSources = [
      "/works/贴图/图层 2.webp",
      "/works/贴图/图层 3.webp",
      "/works/贴图/图层 4.webp",
      "/works/贴图/图层 5.webp",
      "/works/贴图/图层 6.webp",
      "/works/贴图/图层 7.webp",
      "/works/贴图/图层 8.webp",
      "/works/贴图/图层 9.webp",
      "/works/贴图/图层 10.webp",
      "/works/贴图/图层 11.webp",
      "/works/贴图/图层 13.webp",
      "/works/贴图/图层 14.webp",
      "/works/贴图/图层 15.webp",
      "/works/贴图/图层 16.webp",
      "/works/贴图/图层 17.webp",
      "/works/贴图/图层 18.webp",
      "/works/贴图/图层 19.webp",
      "/works/贴图/图层 20.webp",
      "/works/贴图/图层 21.webp",
      "/works/贴图/图层 22.webp",
      "/works/贴图/图层 23.webp",
      "/works/贴图/图层 24.webp",
    ];
    const stickerPlacements = [
      { y: 3.5, angle: -0.2, width: 0.24, tilt: -0.08 }, { y: 3.05, angle: 0.7, width: 0.2, tilt: 0.16 },
      { y: 2.36, angle: -1.15, width: 0.27, tilt: -0.12 }, { y: 2.05, angle: 2.28, width: 0.21, tilt: 0.18 },
      { y: 1.34, angle: -0.08, width: 0.29, tilt: 0.12 }, { y: 1.04, angle: 1.06, width: 0.22, tilt: -0.16 },
      { y: 0.46, angle: -2.42, width: 0.24, tilt: -0.12 }, { y: 0.28, angle: 2.72, width: 0.28, tilt: 0.08 }, { y: 0.12, angle: -0.28, width: 0.23, tilt: -0.22 },
      { y: -0.02, angle: 0.45, width: 0.26, tilt: 0.14 }, { y: -0.16, angle: 0.72, width: 0.22, tilt: -0.18 }, { y: -0.34, angle: -0.96, width: 0.31, tilt: 0.18 },
      { y: -0.5, angle: -1.18, width: 0.24, tilt: -0.14 }, { y: -0.66, angle: 1.18, width: 0.3, tilt: 0.2 }, { y: -0.84, angle: 1.44, width: 0.21, tilt: -0.08 },
      { y: -1.0, angle: -1.72, width: 0.27, tilt: 0.16 }, { y: -1.13, angle: -2.06, width: 0.22, tilt: -0.18 }, { y: -1.28, angle: 2.08, width: 0.28, tilt: 0.14 },
      { y: -1.46, angle: -2.72, width: 0.25, tilt: -0.2 }, { y: -1.58, angle: 0.08, width: 0.29, tilt: 0.08 }, { y: -1.75, angle: 0.34, width: 0.22, tilt: -0.12 },
      { y: -1.92, angle: -0.58, width: 0.26, tilt: -0.16 }, { y: -2.08, angle: 0.96, width: 0.24, tilt: 0.18 }, { y: -2.22, angle: -1.3, width: 0.3, tilt: -0.08 },
      { y: -2.38, angle: 1.64, width: 0.23, tilt: 0.22 }, { y: -2.55, angle: -2.2, width: 0.28, tilt: -0.12 },
      { y: -2.95, angle: 2.72, width: 0.25, tilt: 0.1 }, { y: -3.35, angle: -0.82, width: 0.21, tilt: -0.16 },
    ];
    Promise.all(stickerSources.map((source) => new Promise<THREE.Texture>((resolve) => {
      textureLoader.load(encodeURI(assetPath(source)), resolve);
    }))).then((loadedTextures) => {
      textures.push(...loadedTextures);
      stickerPlacements.forEach((placement, index) => {
        const texture = loadedTextures[index % loadedTextures.length];
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 8;
        texture.needsUpdate = true;
        const image = texture.image;
        const sourceWidth = Number("naturalWidth" in image ? image.naturalWidth : image.width);
        const sourceHeight = Number("naturalHeight" in image ? image.naturalHeight : image.height);
        const width = placement.width;
        const height = width * (sourceHeight / Math.max(sourceWidth, 1));
        const material = addMaterial(new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.03, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6 }));
        const radius = 0.123 + (index % 3) * 0.002;
        const sticker = new THREE.Mesh(addGeometry(makeCurvedStickerGeometry(width, height, radius)), material);
        sticker.position.y = placement.y;
        sticker.rotation.y = placement.angle;
        sticker.rotation.z = placement.tilt;
        sticker.renderOrder = 10 + index;
        rig.add(sticker);
      });
      const boardStickerLayouts = [
        [{ x: -0.58, y: 0.1, width: 0.2, tilt: -0.18 }, { x: 0.48, y: -0.08, width: 0.16, tilt: 0.16 }],
        [{ x: -0.12, y: 0.46, width: 0.2, tilt: 0.14 }, { x: 0.05, y: 0.32, width: 0.17, tilt: -0.12 }, { x: 0.12, y: -0.38, width: 0.16, tilt: 0.2 }],
        [{ x: -0.24, y: 0.22, width: 0.19, tilt: -0.2 }, { x: 0.24, y: -0.2, width: 0.22, tilt: 0.1 }],
        [{ x: -0.28, y: -0.16, width: 0.18, tilt: 0.16 }, { x: 0.26, y: 0.12, width: 0.16, tilt: -0.18 }],
        [{ x: -0.42, y: 0.08, width: 0.2, tilt: -0.14 }, { x: 0.14, y: -0.1, width: 0.23, tilt: 0.18 }],
        [{ x: -0.2, y: 0.24, width: 0.18, tilt: 0.2 }, { x: 0.18, y: -0.18, width: 0.2, tilt: -0.16 }, { x: 0.02, y: 0.02, width: 0.16, tilt: 0.08 }],
      ];
      const boardBackStickerLayouts = [
        [{ x: -0.36, y: -0.06, width: 0.18, tilt: 0.14 }, { x: 0.36, y: 0.08, width: 0.16, tilt: -0.2 }],
        [{ x: -0.06, y: 0.28, width: 0.17, tilt: -0.16 }],
        [{ x: -0.18, y: -0.18, width: 0.2, tilt: 0.18 }, { x: 0.2, y: 0.18, width: 0.16, tilt: -0.12 }, { x: 0.04, y: 0.02, width: 0.14, tilt: 0.24 }],
        [{ x: -0.22, y: 0.12, width: 0.17, tilt: -0.22 }, { x: 0.22, y: -0.18, width: 0.15, tilt: 0.14 }],
        [{ x: -0.28, y: -0.1, width: 0.18, tilt: 0.18 }],
        [{ x: -0.16, y: 0.2, width: 0.15, tilt: -0.12 }, { x: 0.22, y: -0.1, width: 0.18, tilt: 0.2 }],
      ];
      boardStickerLayouts.forEach((layout, boardIndex) => {
        const board = signGroups[boardIndex];
        if (!board) return;
        layout.forEach((placement, stickerIndex) => {
          const texture = loadedTextures[(boardIndex * 3 + stickerIndex + 5) % loadedTextures.length];
          const image = texture.image;
          const sourceWidth = Number("naturalWidth" in image ? image.naturalWidth : image.width);
          const sourceHeight = Number("naturalHeight" in image ? image.naturalHeight : image.height);
          const width = placement.width;
          const height = width * (sourceHeight / Math.max(sourceWidth, 1));
          const material = addMaterial(new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.03, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -8 }));
          const sticker = new THREE.Mesh(addGeometry(new THREE.PlaneGeometry(width, height)), material);
          sticker.position.set(placement.x, placement.y, 0.092 + stickerIndex * 0.004);
          sticker.rotation.z = placement.tilt;
          sticker.renderOrder = 60 + boardIndex * 4 + stickerIndex;
          board.add(sticker);
        });
      });
      boardBackStickerLayouts.forEach((layout, boardIndex) => {
        const board = signGroups[boardIndex];
        if (!board) return;
        layout.forEach((placement, stickerIndex) => {
          const texture = loadedTextures[(boardIndex * 4 + stickerIndex + 11) % loadedTextures.length];
          const image = texture.image;
          const sourceWidth = Number("naturalWidth" in image ? image.naturalWidth : image.width);
          const sourceHeight = Number("naturalHeight" in image ? image.naturalHeight : image.height);
          const width = placement.width;
          const height = width * (sourceHeight / Math.max(sourceWidth, 1));
          const material = addMaterial(new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.03, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -8 }));
          const sticker = new THREE.Mesh(addGeometry(new THREE.PlaneGeometry(width, height)), material);
          sticker.position.set(placement.x, placement.y, -0.092 - stickerIndex * 0.004);
          sticker.rotation.y = Math.PI;
          sticker.rotation.z = placement.tilt;
          sticker.renderOrder = 90 + boardIndex * 4 + stickerIndex;
          board.add(sticker);
        });
      });
    });
    const signSpecs = [
      { kind: "rect", width: 2, height: 0.68, faceWidth: 1.98, faceHeight: 0.58, y: 3.72, angle: 0.2, radius: 1.35 },
      { kind: "vertical", width: 0.78, height: 1.6, faceWidth: 0.66, faceHeight: 1.55, y: 2.55, angle: -1.92, radius: 1.42 },
      { kind: "square", width: 1.15, height: 1.15, faceWidth: 1.1, faceHeight: 1.02, y: 1.42, angle: 2.48, radius: 1.28 },
      { kind: "triangle", width: 1.9, height: 1.6, faceWidth: 1.672, faceHeight: 1.496, y: 0.12, angle: -0.48, radius: 1.5 },
      { kind: "rect", width: 1.55, height: 0.82, faceWidth: 1.82, faceHeight: 0.68, textureScale: 1, textureOffsetX: 0.025, allowTextureOverflow: true, y: -1.35, angle: 1.82, radius: 1.55 },
      { kind: "circle", width: 1.22, height: 1.22, y: -2.55, angle: -2.92, radius: 1.35 },
    ];
    signSpecs.forEach((spec, index) => {
      const angle = spec.angle;
      const radial = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
      const center = radial.clone().multiplyScalar(spec.radius);
      center.y = spec.y;
      const group = new THREE.Group();
      group.position.copy(center);
      group.rotation.y = angle;
      group.userData.boardIndex = index;
      const texture = makeArtwork(index, categories[index]);
      textures.push(texture);
      const body = new THREE.Mesh(addGeometry(makeBoardGeometry(spec.kind, spec.width, spec.height, 0.14)), edgeMaterial);
      const frontMaterial = addMaterial(new THREE.MeshStandardMaterial({ map: texture, roughness: 0.55, metalness: 0.02, transparent: true, side: THREE.DoubleSide }));
      textureLoader.load(encodeURI(assetPath(signTexturePaths[index])), (loadedTexture) => {
        const size = faceSize(spec.kind, spec.width, spec.height, spec.faceWidth, spec.faceHeight);
        const fittedTexture = makeContainedTexture(loadedTexture.image, size.width, size.height, spec.kind === "triangle" ? -0.02 : 0, spec.textureScale ?? 1, spec.textureOffsetX ?? 0);
        textures.push(loadedTexture, fittedTexture);
        frontMaterial.map = fittedTexture;
        frontMaterial.needsUpdate = true;
      });
      const shouldClipFront = spec.kind !== "triangle" && !spec.allowTextureOverflow;
      const front = new THREE.Mesh(addGeometry(makePlaneGeometry(spec.kind, spec.width, spec.height, spec.faceWidth, spec.faceHeight, shouldClipFront)), frontMaterial);
      front.position.z = 0.074;
      [body, front].forEach((mesh) => {
        mesh.userData.boardIndex = index;
        clickable.push(mesh);
        group.add(mesh);
      });
      const mountPlate = new THREE.Mesh(addGeometry(new THREE.BoxGeometry(0.28, 0.22, 0.045)), bracketMaterial);
      mountPlate.position.z = -0.155;
      mountPlate.userData.boardIndex = index;
      clickable.push(mountPlate);
      group.add(mountPlate);
      rig.add(group);
      signGroups[index] = group;
      const rodStart = radial.clone().multiplyScalar(0.095);
      rodStart.y = spec.y;
      const rodEnd = radial.clone().multiplyScalar(spec.radius - 0.155);
      rodEnd.y = spec.y;
      const rod = cylinderBetween(rodStart, rodEnd, 0.038, bracketMaterial);
      geometries.push(rod.geometry);
      rig.add(rod);
      const poleSocket = new THREE.Mesh(addGeometry(new THREE.BoxGeometry(0.18, 0.18, 0.075)), bracketMaterial);
      poleSocket.position.copy(radial.clone().multiplyScalar(0.14));
      poleSocket.position.y = spec.y;
      poleSocket.rotation.y = angle;
      rig.add(poleSocket);
      const band = new THREE.Mesh(addGeometry(new THREE.TorusGeometry(0.135, 0.023, 12, 36)), bandMaterial);
      band.position.y = spec.y;
      band.rotation.x = Math.PI / 2;
      rig.add(band);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pick = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(clickable, false)[0];
    };
    const nearestSign = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      let closest = { index: -1, distance: Number.POSITIVE_INFINITY };
      signGroups.forEach((sign, index) => {
        const point = new THREE.Vector3();
        sign.getWorldPosition(point);
        point.project(camera);
        const x = rect.left + (point.x * 0.5 + 0.5) * rect.width;
        const y = rect.top + (-point.y * 0.5 + 0.5) * rect.height;
        const distance = Math.hypot(event.clientX - x, event.clientY - y);
        if (distance < closest.distance) closest = { index, distance };
      });
      return closest.distance < 118 ? closest.index : null;
    };
    const down = (event: PointerEvent) => {
      if (focused !== null) return;
      dragging = true; moved = false; startX = event.clientX; startY = event.clientY; startRotation = targetRotation; startPitch = targetPitch; startShiftY = targetShiftY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!dragging || focused !== null) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (Math.hypot(deltaX, deltaY) > 4) moved = true;
      targetRotation = startRotation + deltaX * 0.008;
      targetPitch = THREE.MathUtils.clamp(startPitch + deltaY * 0.002, -0.18, 0.18);
      targetShiftY = THREE.MathUtils.clamp(startShiftY - deltaY * 0.01, -2.65, 2.65);
    };
    const up = (event: PointerEvent) => {
      if (dragging) dragging = false;
      if (moved) return;
      const hit = pick(event);
      const pickedIndex = hit ? hit.object.userData.boardIndex as number : nearestSign(event);
      if (pickedIndex !== null) {
        const index = pickedIndex;
        if (focused === null) {
          savedRotation = targetRotation;
          savedPitch = targetPitch;
          savedShiftY = targetShiftY;
        }
        focused = index;
        const sign = signGroups[index];
        if (sign) targetRotation = -sign.rotation.y;
        targetPitch = 0;
        targetScale = 1.34;
        targetShiftX = 0;
        targetShiftY = sign ? -sign.position.y * targetScale : 0;
        onSelect(index);
      } else if (focused !== null) {
        focused = null;
        targetRotation = savedRotation;
        targetPitch = savedPitch;
        targetScale = 1;
        targetShiftX = 0;
        targetShiftY = savedShiftY;
        onSelect(null);
      }
    };
    const exitFromPageBlank = (event: PointerEvent) => {
      if (focused === null) return;
      const target = event.target as Node | null;
      const panel = document.querySelector(".focus-panel");
      if ((target && mount.contains(target)) || (target && panel?.contains(target))) return;
      focused = null;
      targetRotation = savedRotation;
      targetPitch = savedPitch;
      targetScale = 1;
      targetShiftX = 0;
      targetShiftY = savedShiftY;
      onSelect(null);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    document.addEventListener("pointerdown", exitFromPageBlank);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      rig.rotation.y += (targetRotation - rig.rotation.y) * 0.085;
      rig.rotation.x += (targetPitch - rig.rotation.x) * 0.085;
      const scale = stage.scale.x + (targetScale - stage.scale.x) * 0.075;
      stage.scale.setScalar(scale);
      stage.position.x += (targetShiftX - stage.position.x) * 0.075;
      stage.position.y += (targetShiftY - stage.position.y) * 0.075;
      renderer.render(scene, camera);
    };
    stage.scale.setScalar(targetScale);
    animate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      document.removeEventListener("pointerdown", exitFromPageBlank);
      textures.forEach((texture) => texture.dispose());
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onSelect]);

  return <div className="signpost-canvas" ref={mountRef} aria-label="可水平旋转和点击的作品路标模型" />;
}

function Header({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return <header className="site-header"><nav aria-label="主要导航">
    {(["home", "works", "about"] as View[]).map((item, index) => <button key={item} className={view === item ? "active" : ""} onClick={() => onChange(item)}>{["首页", "作品", "关于我"][index]}</button>)}
  </nav></header>;
}

function Placeholder({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div className={`placeholder ${className}`} style={style} aria-label="作品图片占位" />;
}

function WorkImage({ src, alt, className = "", style }: { src?: string; alt: string; className?: string; style?: CSSProperties }) {
  if (!src) return <Placeholder className={className} style={style} />;
  return <img className={`work-image ${className}`} src={assetPath(src)} alt={alt} style={style} loading="lazy" decoding="async" />;
}

function lottieValue(value: any, fallback: any) {
  const raw = value?.k ?? value;
  if (Array.isArray(raw) && raw.length && typeof raw[0] === "object" && "s" in raw[0]) return raw[0].s;
  return raw ?? fallback;
}

function lottieColor(value: any, fallback = "#111") {
  const color = lottieValue(value, null);
  if (!Array.isArray(color)) return fallback;
  const [r, g, b] = color.length > 4 ? [color[1], color[2], color[3]] : color;
  return `rgb(${Math.round(Number(r) * 255)}, ${Math.round(Number(g) * 255)}, ${Math.round(Number(b) * 255)})`;
}

function lottieOpacity(value: any) {
  return Number(lottieValue(value, 100)) / 100;
}

function lottiePath(shape: any) {
  const data = lottieValue(shape?.ks, null);
  if (!data?.v?.length) return "";
  const vertices = data.v as number[][];
  const ins = data.i as number[][];
  const outs = data.o as number[][];
  let path = `M ${vertices[0][0]} ${vertices[0][1]}`;
  for (let index = 1; index < vertices.length; index += 1) {
    const previous = vertices[index - 1];
    const current = vertices[index];
    const out = outs[index - 1] ?? [0, 0];
    const input = ins[index] ?? [0, 0];
    path += ` C ${previous[0] + out[0]} ${previous[1] + out[1]} ${current[0] + input[0]} ${current[1] + input[1]} ${current[0]} ${current[1]}`;
  }
  if (data.c) {
    const last = vertices[vertices.length - 1];
    const first = vertices[0];
    const out = outs[vertices.length - 1] ?? [0, 0];
    const input = ins[0] ?? [0, 0];
    path += ` C ${last[0] + out[0]} ${last[1] + out[1]} ${first[0] + input[0]} ${first[1] + input[1]} ${first[0]} ${first[1]} Z`;
  }
  return path;
}

function lottieTransform(ks: any) {
  const position = lottieValue(ks?.p, [0, 0]);
  const anchor = lottieValue(ks?.a, [0, 0]);
  const scale = lottieValue(ks?.s, [100, 100]);
  const rotation = Number(lottieValue(ks?.r, 0));
  return `translate(${Number(position?.[0] ?? 0)} ${Number(position?.[1] ?? 0)}) rotate(${rotation}) scale(${Number(scale?.[0] ?? 100) / 100} ${Number(scale?.[1] ?? 100) / 100}) translate(${-Number(anchor?.[0] ?? 0)} ${-Number(anchor?.[1] ?? 0)})`;
}

function LottieJsonIcon({ src, scale = 1 }: { src: string; scale?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let animation: { destroy: () => void } | null = null;
    import("lottie-web")
      .then((module) => {
        if (cancelled || !containerRef.current) return;
        animation = module.default.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: assetPath(src),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        });
      })
      .catch(() => {
        animation = null;
      });
    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [src]);

  return <div className="motion-lottie-icon" ref={containerRef} aria-hidden="true" style={{ "--lottie-scale": scale } as CSSProperties} />;
}

function MotionFilmStrip({ images }: { images: string[] }) {
  const [offset, setOffset] = useState(0);
  const [wrappingIndex, setWrappingIndex] = useState<number | null>(null);
  const cards = [
    { title: "Icon 01", color: "#ff6b5f", lottie: "/works/motion/motion01.json" },
    { title: "Icon 02", color: "#f7c948", lottie: "/works/motion/motion09.json" },
    { title: "Icon 03", color: "#7bdff2", lottie: "/works/motion/motion03.json", lottieScale: 1.18 },
    { title: "Icon 04", color: "#b8f2c4", lottie: "/works/motion/motion04.json", lottieScale: 1.3 },
    { title: "Icon 05", color: "#cbb2fe", lottie: "/works/motion/motion05.json", lottieScale: 1.2 },
    { title: "Icon 06", color: "#ff99c8", lottie: "/works/motion/motion06.json" },
    { title: "Icon 07", color: "#8ec5fc", lottie: "/works/motion/motion07.json", lottieScale: 1.2 },
  ];
  const slots = [
    { x: "calc(50% - 470px)", size: 104, z: 1, opacity: 1 },
    { x: "calc(50% - 338px)", size: 124, z: 2, opacity: 1 },
    { x: "calc(50% - 183px)", size: 150, z: 3, opacity: 1 },
    { x: "50%", size: 180, z: 5, opacity: 1 },
    { x: "calc(50% + 183px)", size: 150, z: 3, opacity: 1 },
    { x: "calc(50% + 338px)", size: 124, z: 2, opacity: 1 },
    { x: "calc(50% + 470px)", size: 104, z: 1, opacity: 1 },
  ];
  useEffect(() => {
    const timer = window.setInterval(() => {
      setOffset((value) => {
        setWrappingIndex(value % cards.length);
        window.setTimeout(() => setWrappingIndex(null), 880);
        return (value + 1) % cards.length;
      });
    }, 1700);
    return () => window.clearInterval(timer);
  }, [cards.length]);
  return <section className="motion-film-demo" aria-label="图标动效卡片轮播">
    <div className="motion-stage-label"><span>图标/动效设计</span><span>2026</span></div>
    <img className="motion-phone-mockup" src={assetPath("/works/motion/phone-mockup.webp")} alt="手机样机" loading="lazy" decoding="async" />
    <div className="motion-strip">
      <div className="motion-track">
        {cards.map((item, index) => {
          const slot = slots[(index - offset + cards.length) % cards.length];
          return <div className={`motion-frame ${wrappingIndex === index ? "is-wrapping" : ""}`} key={item.title} style={{
            "--slot-x": slot.x,
            "--slot-size": `${slot.size}px`,
            "--slot-z": slot.z,
            "--slot-opacity": slot.opacity,
          } as CSSProperties}>
          {item.lottie ? <LottieJsonIcon src={item.lottie} scale={item.lottieScale ?? 1} /> : <span className="motion-card-dot" style={{ "--card-color": item.color } as CSSProperties} />}
        </div>;
        })}
      </div>
    </div>
  </section>;
}

function HomeView({ openWorks, openProject }: { openWorks: (category?: number) => void; openProject: (projectTitle: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [featureProgress, setFeatureProgress] = useState(0);
  const featuredRef = useRef<HTMLElement>(null);
  const featureProgressRef = useRef(0);
  const featuredLockedRef = useRef(false);
  const onSelect = useCallback((index: number | null) => setSelected(index), []);
  useEffect(() => {
    let frame = 0;
    const cardHeight = 597;
    const maxProgress = cardHeight * 2;
    const stopDistance = 56;
    const setPinnedProgress = (next: number) => {
      const value = Math.min(maxProgress, Math.max(0, next));
      featureProgressRef.current = value;
      setFeatureProgress(value);
    };
    const pinTop = () => {
      const stack = featuredRef.current;
      return stack ? stack.offsetTop - stopDistance : 0;
    };
    const lockPage = () => {
      if (featuredLockedRef.current) return;
      featuredLockedRef.current = true;
      document.body.style.overflow = "hidden";
    };
    const unlockPage = () => {
      if (!featuredLockedRef.current) return;
      featuredLockedRef.current = false;
      document.body.style.overflow = "";
    };
    const update = () => {
      frame = 0;
      const stack = featuredRef.current;
      if (!stack) return;
      if (window.scrollY < stack.offsetTop - stopDistance - 2 && featureProgressRef.current !== 0 && !featuredLockedRef.current) setPinnedProgress(0);
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onWheel = (event: WheelEvent) => {
      const stack = featuredRef.current;
      if (!stack) return;
      const start = pinTop();
      const current = featureProgressRef.current;
      const projectedScroll = window.scrollY + event.deltaY;
      const willEnterFeatured = event.deltaY > 0 && projectedScroll >= start;
      const hasReachedFeatured = featuredLockedRef.current || window.scrollY >= start - 2 || current > 0 || willEnterFeatured;
      if (!hasReachedFeatured) return;
      const shouldDriveCards = event.deltaY > 0 || current > 0;
      if (!shouldDriveCards && featuredLockedRef.current && current <= 0) unlockPage();
      if (!shouldDriveCards) return;
      event.preventDefault();
      if (!featuredLockedRef.current) {
        lockPage();
        if (Math.abs(window.scrollY - start) > 0.5) window.scrollTo({ top: start, behavior: "auto" });
      }
      const rawDelta = willEnterFeatured && current === 0 ? Math.max(0, projectedScroll - start) : event.deltaY;
      const dampedDelta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 72) * 0.72;
      setPinnedProgress(current + dampedDelta);
      if (current + dampedDelta <= 0 && event.deltaY < 0) unlockPage();
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("wheel", onWheel);
      document.body.style.overflow = "";
    };
  }, []);
  const secondY = Math.max(0, 597 - featureProgress);
  const thirdY = Math.max(0, 1194 - featureProgress);
  const focusedWork = selected === null ? null : categoryProject(selected);
  const focusedImages = selected === null ? [] : categoryPreviewImages(selected);
  return <main>
    <section className={`hero ${selected !== null ? "is-focused" : ""}`}>
      <div className="hero-meta"><span>MY INTERACTIVE PORTFOLIO</span><span>2026/07 · LATEST UPDATE TIME</span></div>
      <Signpost3D onSelect={onSelect} />
      <aside className={`focus-panel ${selected !== null ? "show" : ""}`}>
        <p className="eyebrow">SELECTED CATEGORY</p>
        <h2>{selected === null ? "" : categories[selected]}</h2>
        <div className="focus-grid"><WorkImage className="focus-main" src={focusedImages[0]} alt={`${focusedWork?.title ?? ""} 预览`} /><WorkImage src={focusedImages[1]} alt={`${focusedWork?.title ?? ""} 预览 2`} /><WorkImage src={focusedImages[2]} alt={`${focusedWork?.title ?? ""} 预览 3`} /></div>
        <button onClick={() => selected !== null && openWorks(selected)}>查看该板块 <span>⟶</span></button>
      </aside>
      <p className="orbit-hint">拖拽旋转查看 · 点击路牌聚焦 · 点击空白恢复</p>
      <div className="scroll-cue"><span>↓</span><span>往下拉</span></div>
    </section>
    <section className="featured-stack" ref={featuredRef} style={{
      "--feature-two-y": `${secondY}px`,
      "--feature-three-y": `${thirdY}px`,
    } as CSSProperties} aria-label="精选作品">
      <div className="featured-viewport">
      {featuredProjects.map((item, index) => {
        const images = item.featuredImages ?? item.images;
        return <article className={`featured-card featured-${index + 1}`} key={item.title}>
          <div className="featured-tab">精选 <span>0{index + 1}</span></div>
          {index === 0 && <button className="all-works" onClick={() => openWorks()}>查看所有 <span>⟶</span></button>}
          <div className="featured-heading"><h2>{item.featuredTitle ?? item.title}</h2><div><span>{item.year}</span><span>{item.tags}</span></div></div>
          <div className="featured-content">
            <div className="featured-copy"><div><p>{item.featuredDescription ?? `${item.tags}。精选项目内容已根据 Figma「汇总2026」导出素材填充，后续可继续替换为更细分的项目说明。`}</p>{item.featuredTools && <p className="featured-tools">主要工具：{item.featuredTools}</p>}</div><button onClick={() => openProject(item.title)}>查看项目 <span>⟶</span></button></div>
            <WorkImage className="featured-main-image" src={images[0]} alt={`${item.title} 主图`} />
          </div>
        </article>;
      })}
      </div>
    </section>
  </main>;
}

function CategoryCard({ item, index, mode, onHover, onClick }: { item: string; index: number; mode: "normal" | "selected" | "muted"; onHover?: () => void; onClick: () => void }) {
  const layout = categoryLayouts[index];
  const style = {
    "--card-bg": mode === "muted" ? "#f7f7f7" : categoryColors[index],
    "--card-fg": mode === "muted" ? "#aeaeae" : categoryTextColors[index],
    "--card-left": `${layout.left}px`,
    "--card-top": `${layout.top - 394}px`,
    "--card-width": `${layout.width}px`,
    "--card-height": `${layout.height}px`,
    "--card-z": layout.z,
  } as CSSProperties;
  return <button className={`category-card category-${index + 1} ${mode}`} style={style} onMouseEnter={onHover} onClick={onClick}><span>0{index + 1}</span><strong>{item}</strong></button>;
}

function WorksView({ initialCategory = null, initialProjectTitle = null }: { initialCategory?: number | null; initialProjectTitle?: string | null }) {
  const initialProject = initialProjectTitle ? workProjects.find((item) => item.title === initialProjectTitle) : null;
  const startingCategory = initialProject?.categoryIndex ?? initialCategory ?? 0;
  const startingProjects = workProjects.filter((item) => item.categoryIndex === startingCategory);
  const startingProjectIndex = initialProject ? Math.max(0, startingProjects.findIndex((item) => item.title === initialProject.title)) : 0;
  const [step, setStep] = useState<"categories" | "projects" | "detail">(initialProject ? "detail" : initialCategory === null ? "categories" : directDetailCategories.has(initialCategory) ? "detail" : "projects");
  const [hovered, setHovered] = useState<number | null>(null);
  const [category, setCategory] = useState(startingCategory);
  const [project, setProject] = useState(startingProjectIndex);
  const [scale, setScale] = useState(1);
  const [detailCentered, setDetailCentered] = useState(false);
  const [showDetailTopButton, setShowDetailTopButton] = useState(false);
  useEffect(() => {
    const update = () => setScale(Math.min(1, Math.max(0.68, window.innerWidth / 1440)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => {
    if (step !== "detail") {
      setDetailCentered(false);
      setShowDetailTopButton(false);
      return;
    }
    const update = () => {
      setDetailCentered(window.scrollY > 1);
      setShowDetailTopButton(window.scrollY > 132);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [step]);
  const activeProjects = workProjects.filter((item) => item.categoryIndex === category);
  const displayedProjects = activeProjects.length ? activeProjects : [{ title: categories[category], year: "待补充", tags: "作品内容待补充", categoryIndex: category, images: [] as string[] }];
  const currentProject = displayedProjects[project] ?? displayedProjects[0];
  const isCurrentMotionDetail = currentProject.detailVariant === "motion-strip";
  const detailHeight = isCurrentMotionDetail ? 1700 : Math.max(1265, 292 + Math.max(1, currentProject.images.length) * 940);
  const projectsHeight = Math.max(1101, 220 + displayedProjects.length * 390);
  const canvasHeight = step === "detail" ? detailHeight : step === "projects" ? projectsHeight : 1024;
  const canvasStyle = {
    "--works-scale": scale,
    "--works-height": `${canvasHeight * scale}px`,
  } as CSSProperties;
  if (step === "detail") {
    const current = currentProject;
    const [coverImage, ...detailImages] = current.images;
    const galleryImages = detailImages.length ? detailImages : current.images.length ? [] : [undefined];
    const isMotionDetail = current.detailVariant === "motion-strip";
    return <main className={`works-page detail-page ${isMotionDetail ? "motion-detail" : ""} ${detailCentered ? "is-centered" : ""}`}>
      <div className="works-canvas">
      <button className="back-link" onClick={() => setStep(directDetailCategories.has(category) ? "categories" : "projects")}>{directDetailCategories.has(category) ? "← 查看所有作品" : "← 返回项目缩略图"}</button>
      {!isMotionDetail && <aside><h1>{current.featuredTitle ?? current.title}</h1><p>{current.tags}</p><p>{current.year}</p>{current.detailIntro ? current.detailIntro.map((text) => <p key={text}>{text}</p>) : <p>项目背景、设计过程与最终成果将在正式图片补充后呈现。</p>}{current.detailTools && <p className="detail-tools">主要工具：{current.detailTools}</p>}</aside>}
      {isMotionDetail ? <MotionFilmStrip images={current.images} /> : <WorkImage className="detail-intro-image" src={coverImage} alt={`${current.title} 首图`} />}
      <div className={`detail-gallery ${isMotionDetail ? "motion-gallery" : ""}`}>
        {isMotionDetail ? <>
          {current.images.slice(1, 2).map((src, index) => <WorkImage key={src} src={src} alt={`${current.title} 图标 ${index + 2}`} />)}
          <WorkImage src="/works/图片组/05-图标:动效设计/图标-01.webp" alt={`${current.title} 静态展示 1`} />
          <WorkImage src="/works/图片组/05-图标:动效设计/图标-04.webp" alt={`${current.title} 静态展示 2`} />
          <div className="motion-gallery-lottie" aria-label={`${current.title} 动效 2`}><LottieJsonIcon src="/works/motion/motion08.json" /></div>
          <div className="motion-gallery-lottie" aria-label={`${current.title} 动效 3`}><LottieJsonIcon src="/works/motion/motion02.json" /></div>
        </> : galleryImages.map((src, index) => <WorkImage key={src ?? `placeholder-${index}`} src={src} alt={`${current.title} 详情图 ${index + 2}`} />)}
      </div>
      </div>
      <button className={`detail-top-button ${showDetailTopButton ? "show" : ""}`} type="button" aria-label="回到页面顶部" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
    </main>;
  }
  return <main className="works-page works-scaled-page" style={canvasStyle}>
    <div className="works-canvas">
    <h1>作品</h1>
    {step === "categories" && <section className="category-stage" onMouseLeave={() => setHovered(null)}>
      {hovered !== null && <div className="floating-previews">
        {previewRects[hovered].map((rect, index) => <WorkImage key={`${hovered}-${index}`} src={categoryPreviewImages(hovered)[index]} alt={`${categories[hovered]} 悬浮预览 ${index + 1}`} className={`preview-${index + 1}`} style={{
          "--preview-left": `${rect.left}px`,
          "--preview-top": `${rect.top - 394}px`,
          "--preview-width": `${rect.width ?? rect.size}px`,
          "--preview-height": `${rect.height ?? rect.size}px`,
        } as CSSProperties} />)}
      </div>}
      <div className="category-grid">
        {categories.map((item, index) => <CategoryCard key={item} item={item} index={index} mode={hovered === null ? "normal" : hovered === index ? "selected" : "muted"} onHover={() => setHovered(index)} onClick={() => { setCategory(index); setProject(0); setStep(directDetailCategories.has(index) ? "detail" : "projects"); window.scrollTo({ top: 0 }); }} />)}
      </div>
    </section>}
    {step === "projects" && <section className="project-board">
      <div className="project-board-title"><button className="back-link" onClick={() => setStep("categories")}>← 查看所有作品</button><h2>0{category + 1}<br />{categories[category]}</h2></div>
      <div className="project-list">
        <div className="project-columns"><span>项目名称</span><span>预览</span></div>
        {displayedProjects.map((item, index) => <button className="project-row" key={item.title} onClick={() => { setProject(index); setStep("detail"); window.scrollTo({ top: 0 }); }}>
          <div className="project-info"><h3>{item.title}</h3><div><span>{item.year}</span><span>{item.tags}</span></div></div><WorkImage className="project-thumb" src={item.thumbnail ?? item.images[0]} alt={`${item.title} 缩略图`} />
        </button>)}
      </div>
    </section>}
    </div>
  </main>;
}

function AboutView() {
  const [profileCollapsed, setProfileCollapsed] = useState(false);
  const [skillsCollapsed, setSkillsCollapsed] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  const showExperienceDetail = selectedExperience !== null;
  const expandExperience = () => {
    setSkillsCollapsed(true);
    setProfileCollapsed(true);
    setSelectedExperience((current) => current ?? 0);
  };
  const previewExperience = (index: number) => setSelectedExperience(index);
  return <main className={`about-page ${profileCollapsed ? "profile-collapsed" : ""} ${skillsCollapsed ? "skills-collapsed" : ""} ${showExperienceDetail ? "experience-detail" : ""}`}>
    <h1>关于我</h1>
    <div className="about-stage">
      <section className="about-panel experience-panel" onClick={expandExperience}>
        <div className="panel-title experience-title"><span className="experience-title-left"><b>关于</b><b>细节</b></span><span className="experience-title-main">经历</span></div>
        <div className={`experience-photo ${showExperienceDetail ? "show" : ""}`} style={{
          "--experience-photo-y": `${48 + (selectedExperience ?? 0) * 116}px`,
        } as CSSProperties} aria-label="实习经历项目图片占位">
          <WorkImage src={experienceImages[selectedExperience ?? 0]} alt="实习经历项目配图" />
        </div>
        <h2>实习经历</h2>
        <div className="experience-table">
          <div className="experience-head"><span>年</span><span>公司</span><span>岗位</span></div>
          {experiences.map((item, index) => <button className={`experience-row ${selectedExperience === index ? "active" : ""}`} key={`${item.company}-${index}`} onMouseEnter={() => previewExperience(index)} onFocus={() => previewExperience(index)}>
            <span>{item.year}</span>
            <span><b>{item.company}</b><small>{item.location}</small></span>
            <span>{item.role}</span>
          </button>)}
        </div>
      </section>
      <button className="about-panel skills-panel" onClick={() => setSkillsCollapsed((value) => !value)}><div className="panel-title">技能</div><h2>技能</h2><ol><li>App / Web界面设计 / 图标设计</li><li>用户流程 / 功能架构 / 原型设计</li><li>界面动效 / IP动画</li><li>视觉生成 / 3D</li></ol></button>
      <button className="about-panel profile-panel" onClick={() => setProfileCollapsed((value) => !value)}><div className="panel-title">自我介绍</div><h2>王皓月 <span>HAOYUE WANG</span></h2><div className="profile-content"><WorkImage src="/works/me.webp" alt="王皓月照片" /><dl><dt>出生</dt><dd>2001/10</dd><dt>电话</dt><dd>18851906125</dd><dt>所在地</dt><dd>江苏南京</dd><dt>微信名</dt><dd>whyue1009</dd><dt>邮箱</dt><dd>2970221145@qq.com</dd></dl></div></button>
    </div>
  </main>;
}

export default function Portfolio() {
  const [view, setView] = useState<View>("home");
  const [pageKey, setPageKey] = useState(0);
  const [initialWorkCategory, setInitialWorkCategory] = useState<number | null>(null);
  const [initialWorkProjectTitle, setInitialWorkProjectTitle] = useState<string | null>(null);
  const changeView = (next: View, workCategory: number | null = null, projectTitle: string | null = null) => {
    setInitialWorkCategory(next === "works" ? workCategory : null);
    setInitialWorkProjectTitle(next === "works" ? projectTitle : null);
    setView(next); setPageKey((key) => key + 1); window.scrollTo({ top: 0, behavior: "auto" });
  };
  return <div className="portfolio-shell"><Header view={view} onChange={changeView} />
    <div key={`${view}-${pageKey}`}>{view === "home" && <HomeView openWorks={(category) => changeView("works", category ?? null)} openProject={(projectTitle) => changeView("works", null, projectTitle)} />}{view === "works" && <WorksView initialCategory={initialWorkCategory} initialProjectTitle={initialWorkProjectTitle} />}{view === "about" && <AboutView />}</div>
  </div>;
}
