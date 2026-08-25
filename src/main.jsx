import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowDownRight, ArrowRight, Menu, X } from "lucide-react";
import "./styles.css";

const content = {
  jp: {
    nav: ["宇宙を知る", "仕事", "思想", "接続"],
    title: (
      <>
        まだ見ぬ軌道を、
        <br />
        描く。
      </>
    ),
    sub: "ブランドの可能性を、宇宙規模へ。",
    explore: "探索をはじめる",
    services: [
      ["戦略", "未来の重力を定義する。"],
      ["ブランド", "記憶に残る星座をつくる。"],
      ["クリエイティブ", "感情を動かす光を放つ。"],
      ["グロース", "成長の軌道を加速する。"],
      ["デジタル体験", "触れたくなる世界を実装する。"],
    ],
    selected: "選択された星",
    works: "仕事",
    workTitle: "文化を動かす、\n新しい引力。",
    workBody:
      "戦略から体験まで、ひとつの軌道で。ビジネスの本質を見つめ、まだ名前のない価値を社会へ放ちます。",
    view: "プロジェクトを見る",
    process: "私たちの軌道",
    processTitle: "発見。定義。放射。",
    contact: "次の宇宙を、\n一緒につくろう。",
    contactSub:
      "東京から、世界へ。新しいプロジェクトの相談をお待ちしています。",
    talk: "話をはじめる",
  },
  en: {
    nav: ["Studio", "Work", "Thinking", "Contact"],
    title: (
      <>
        We draw orbits
        <br />
        not yet seen.
      </>
    ),
    sub: "Taking brand potential to a cosmic scale.",
    explore: "Begin exploration",
    services: [
      ["Strategy", "Define the gravity of tomorrow."],
      ["Brand", "Build constellations that stay in memory."],
      ["Creative", "Emit light that moves people."],
      ["Growth", "Accelerate the orbit of growth."],
      ["Digital Experience", "Build worlds people want to touch."],
    ],
    selected: "Selected star",
    works: "Selected work",
    workTitle: "A new gravity\nthat moves culture.",
    workBody:
      "From strategy to experience, one connected orbit. We find the truth of a business and release unnamed value into the world.",
    view: "View projects",
    process: "Our orbit",
    processTitle: "Discover. Define. Radiate.",
    contact: "Let’s create the\nnext universe.",
    contactSub:
      "From Tokyo to the world. Tell us what you want to make possible.",
    talk: "Start a conversation",
  },
};
const starPos = [
  [-3.5, 1.4, 0],
  [3.8, 2, -1],
  [-4, -2, -1],
  [3.6, -1.7, 0],
  [5.3, 0.2, -2],
];

function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,235,1)");
  gradient.addColorStop(0.08, "rgba(255,220,140,.95)");
  gradient.addColorStop(0.3, "rgba(220,150,60,.38)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function GalaxyDisk() {
  const ref = React.useRef();
  const geometry = useMemo(() => {
    const count = 5200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const warm = new THREE.Color("#e6b86a");
    const cool = new THREE.Color("#7296b9");
    for (let i = 0; i < count; i++) {
      const arm = i % 3;
      const radius = 0.9 + Math.pow(Math.random(), 0.62) * 6;
      const angle =
        arm * ((Math.PI * 2) / 3) + radius * 1.15 + (Math.random() - 0.5) * 0.7;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * (0.12 + radius * 0.045);
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.5;
      const c = warm.clone().lerp(cool, Math.min(1, radius / 7));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.018;
  });
  return (
    <points ref={ref} geometry={geometry} rotation={[0.22, 0, -0.06]}>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.78}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SolarCore() {
  const core = React.useRef();
  const glow = useMemo(makeGlowTexture, []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec3 vPos; varying vec3 vNormal; void main(){vPos=position;vNormal=normalMatrix*normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `uniform float uTime; varying vec3 vPos; varying vec3 vNormal;
          float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
          float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
          void main(){float n=noise(vPos*7.+vec3(uTime*.13))+noise(vPos*18.-vec3(uTime*.07))*.35;float rim=pow(1.-abs(dot(normalize(vNormal),vec3(0,0,1))),2.);vec3 col=mix(vec3(1.,.55,.12),vec3(1.,.98,.72),smoothstep(.25,1.1,n));col+=rim*vec3(1.,.55,.08);gl_FragColor=vec4(col,1.);}`,
      }),
    [],
  );
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    if (core.current) core.current.rotation.y += 0.0018;
  });
  return (
    <group rotation={[0, 0, -0.08]}>
      <mesh ref={core} material={material}>
        <sphereGeometry args={[0.78, 96, 96]} />
      </mesh>
      <sprite scale={[3.7, 3.7, 1]}>
        <spriteMaterial
          map={glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
        />
      </sprite>
      <pointLight intensity={18} color="#ffd17a" distance={12} />
      <Sparkles count={180} scale={2.5} size={5} speed={0.2} color="#f8cf7f" />
    </group>
  );
}

function Orbit({ r = 3, tilt = 0.1 }) {
  const pts = useMemo(
    () =>
      Array.from({ length: 160 }, (_, i) => {
        const a = (i / 159) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(a) * r,
          Math.sin(a) * r * 0.38,
          Math.sin(a) * tilt,
        );
      }),
    [r, tilt],
  );
  const geo = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(pts),
    [pts],
  );
  return (
    <line geometry={geo} rotation={[0, 0, 0.05]}>
      <lineBasicMaterial color="#d6b677" transparent opacity={0.3} />
    </line>
  );
}
function Star({ p, index, selected, onSelect, onHover }) {
  const ref = React.useRef(),
    [hover, setHover] = useState(false);
  const glow = useMemo(makeGlowTexture, []);
  useFrame(({ clock }) => {
    if (ref.current) {
      const base = hover ? 1.8 : selected ? 1.35 : 1;
      const s = base + Math.sin(clock.elapsedTime * 2 + index) * 0.08;
      ref.current.scale.setScalar(
        THREE.MathUtils.lerp(ref.current.scale.x, s, 0.12),
      );
    }
  });
  const hoverStar = (value) => {
    setHover(value);
    onHover(value ? index : null);
  };
  return (
    <group
      position={p}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoverStar(true);
      }}
      onPointerOut={() => hoverStar(false)}
      ref={ref}
    >
      <mesh>
        <sphereGeometry args={[selected ? 0.12 : 0.085, 24, 24]} />
        <meshBasicMaterial
          color={hover ? "#ffffff" : selected ? "#fff4c8" : "#ead5a3"}
        />
      </mesh>
      <pointLight
        color="#ffc56f"
        intensity={hover ? 14.4 : selected ? 9.6 : 4.8}
        distance={4}
      />
      <Sparkles
        count={selected || hover ? 32 : 10}
        scale={selected || hover ? 1.3 : 0.6}
        size={2}
        speed={0.25}
        color="#e9bd72"
      />
      <sprite scale={[0.95, 0.95, 1]}>
        <spriteMaterial
          map={glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={selected || hover ? 1 : 0.62}
        />
      </sprite>
      <sprite scale={[1.55, 0.055, 1]}>
        <spriteMaterial
          map={glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={selected || hover ? 0.9 : 0.45}
        />
      </sprite>
      <sprite scale={[0.055, 1.55, 1]}>
        <spriteMaterial
          map={glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={selected || hover ? 0.9 : 0.45}
        />
      </sprite>
    </group>
  );
}
function Universe({ selected, onSelect, onHover }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 48 }}
      dpr={[1, 1.7]}
      onPointerMissed={() => onHover(null)}
    >
      <color attach="background" args={["#07090c"]} />
      <Sparkles
        count={320}
        scale={[18, 10, 8]}
        size={1.1}
        speed={0.08}
        opacity={0.72}
      />
      <GalaxyDisk />
      {[3, 4.3, 5.5, 6.7].map((r, i) => (
        <Orbit key={r} r={r} tilt={i * 0.25} />
      ))}
      <SolarCore />
      {starPos.map((p, i) => (
        <Star
          key={i}
          p={p}
          index={i}
          selected={selected === i}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.045}
        minDistance={6.8}
        maxDistance={11}
        minPolarAngle={Math.PI * 0.32}
        maxPolarAngle={Math.PI * 0.68}
        rotateSpeed={0.32}
        zoomSpeed={0.55}
        autoRotate
        autoRotateSpeed={0.08}
      />
    </Canvas>
  );
}

function App() {
  const [lang, setLang] = useState("jp"),
    [selected, setSelected] = useState(0),
    [hovered, setHovered] = useState(null),
    [menu, setMenu] = useState(false),
    [loaded, setLoaded] = useState(false);
  const t = content[lang];
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 650);
    return () => clearTimeout(id);
  }, []);
  const choose = (i) => {
    setSelected(i);
    if (window.matchMedia("(max-width:800px)").matches)
      document.querySelector(".hero")?.classList.add("touched");
  };
  return (
    <main
      className={`${loaded ? "loaded " : ""}${hovered !== null ? "star-hover" : ""}`}
    >
      <div className="loader">
        <span>ORBITAL</span>
        <i />
      </div>
      <header>
        <a className="logo" href="#top">
          ORBITAL<small>CREATIVE STUDIO</small>
        </a>
        <nav>
          {t.nav.map((n, i) => (
            <a href={["#about", "#work", "#process", "#contact"][i]} key={n}>
              {n}
            </a>
          ))}
        </nav>
        <button
          className="lang"
          onClick={() => setLang(lang === "jp" ? "en" : "jp")}
        >
          {lang === "jp" ? "JP / EN" : "EN / JP"}
        </button>
        <button
          className="menu"
          aria-label="menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      {menu && (
        <div className="mobileNav">
          {t.nav.map((n, i) => (
            <a
              onClick={() => setMenu(false)}
              href={["#about", "#work", "#process", "#contact"][i]}
              key={n}
            >
              {n}
            </a>
          ))}
        </div>
      )}
      <section className="hero" id="top">
        <div className="scene">
          <Universe
            selected={selected}
            onSelect={choose}
            onHover={setHovered}
          />
        </div>
        <div className="heroCopy">
          <h1>{t.title}</h1>
          <p>{t.sub}</p>
          <a className="circleCta" href="#about">
            {t.explore}
            <ArrowDownRight />
          </a>
        </div>
        <div className="starLabels">
          {t.services.map((s, i) => (
            <button
              key={s[0]}
              className={selected === i ? "active" : ""}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onPointerDown={() => choose(i)}
              onClick={() => choose(i)}
              style={{ "--x": starPos[i][0], "--y": starPos[i][1] }}
            >
              <b>0{i + 1}</b>
              {s[0]}
            </button>
          ))}
        </div>
        <aside className="starDock" aria-live="polite">
          <span>0{selected + 1} / 05</span>
          <strong>{t.services[selected][0]}</strong>
          <p>{t.services[selected][1]}</p>
          <button
            onClick={() => choose((selected + 1) % 5)}
            aria-label="next service"
          >
            <ArrowRight />
          </button>
        </aside>
        <div className="gesture">
          {lang === "jp"
            ? "ドラッグで銀河を回転 ・ スクロールで接近"
            : "DRAG TO ORBIT · SCROLL TO ZOOM"}
        </div>
        <div className="scroll">
          SCROLL TO EXPLORE <i />
        </div>
      </section>
      <a className="referencePreview" href="#work">
        <div className="previewTitle">
          <span>✦ PROJECTS</span>
          <strong>WORKS</strong>
        </div>
        <div className="previewSelected">
          <span>SELECTED</span>
          <strong>{t.services[selected][0]}</strong>
          <small>{t.services[selected][1]}</small>
        </div>
        <div className="previewOrbit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </a>
      <section className="service" id="about">
        <div className="sectionIndex">01 — {t.selected}</div>
        <div className="serviceNum">0{selected + 1}</div>
        <div className="serviceCopy" key={`${lang}-${selected}`}>
          <h2>{t.services[selected][0]}</h2>
          <p>{t.services[selected][1]}</p>
          <div className="serviceNav">
            {t.services.map((s, i) => (
              <button
                className={selected === i ? "active" : ""}
                onClick={() => choose(i)}
                key={s[0]}
                aria-label={s[0]}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="works" id="work">
        <div className="sectionIndex">02 — {t.works}</div>
        <h2>{t.workTitle}</h2>
        <div className="workVisual">
          <div className="planet">
            <i />
            <i />
            <i />
          </div>
          <span>
            CASE 001
            <br />
            LUMINA / BRAND PLATFORM
          </span>
        </div>
        <div className="workFoot">
          <p>{t.workBody}</p>
          <a href="#contact">
            {t.view}
            <ArrowRight />
          </a>
        </div>
      </section>
      <section className="process" id="process">
        <div className="sectionIndex">03 — {t.process}</div>
        <h2>{t.processTitle}</h2>
        <div className="steps">
          {["DISCOVER", "DEFINE", "RADIATE"].map((s, i) => (
            <div key={s}>
              <b>0{i + 1}</b>
              <span>{s}</span>
              <p>
                {lang === "jp"
                  ? [
                      "本質を観測する",
                      "進むべき軌道を描く",
                      "世界に体験を放つ",
                    ][i]
                  : [
                      "Observe the essential",
                      "Draw the right orbit",
                      "Release the experience",
                    ][i]}
              </p>
            </div>
          ))}
        </div>
      </section>
      <footer id="contact">
        <div className="sun" />
        <h2>{t.contact}</h2>
        <p>{t.contactSub}</p>
        <a href="mailto:hello@orbital.studio">
          {t.talk}
          <ArrowRight />
        </a>
        <div className="footerLine">
          <span>ORBITAL © 2026</span>
          <span>TOKYO — 35.6762° N</span>
          <span>INSTAGRAM / LINKEDIN</span>
        </div>
      </footer>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
