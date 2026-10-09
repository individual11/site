"use client";

import { useEffect, useRef } from "react";

export type ShaderMode = "calm" | "liquid" | "chaos";

export const SHADER_EVENT = "i11:shader";

// speed: how fast time flows; warp: how hard the domain warp folds space
const MODES: Record<ShaderMode, { speed: number; warp: number }> = {
  calm: { speed: 0.35, warp: 2.6 },
  liquid: { speed: 1, warp: 4 },
  chaos: { speed: 3.2, warp: 7.5 },
};

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Domain-warped fbm (after Inigo Quilez) mapped to ink/paper,
// with neon-green streaks riding the contour lines.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouseStr;
uniform float u_warp;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  float s = min(u_res.x, u_res.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / s;
  vec2 m = (u_mouse - 0.5) * u_res / s;
  float t = u_time;

  // the cursor stirs the liquid: a local swirl that fades with distance
  vec2 d = p - m;
  float infl = u_mouseStr * exp(-dot(d, d) * 5.0);
  float ang = infl * 1.4;
  p = m + mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * d;

  p *= 1.5;
  vec2 q = vec2(
    fbm(p + vec2(0.0, t * 0.05)),
    fbm(p + vec2(5.2, 1.3) - t * 0.04)
  );
  vec2 r = vec2(
    fbm(p + u_warp * q + vec2(1.7, 9.2) + t * 0.07),
    fbm(p + u_warp * q + vec2(8.3, 2.8) - t * 0.06)
  );
  float f = fbm(p + u_warp * r);

  float g = smoothstep(0.32, 0.78, f);
  vec3 ink = vec3(0.04);
  vec3 paper = vec3(0.95, 0.94, 0.91);
  vec3 col = mix(ink, paper, g * (0.6 + 0.4 * g));

  float band = abs(fract(f * 5.0 + length(r) * 2.0) - 0.5);
  float streak = smoothstep(0.05, 0.0, band) * smoothstep(0.5, 0.75, length(q));
  col = mix(col, vec3(0.13, 1.0, 0.4), streak);

  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) * 0.07;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function LiquidShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return; // CSS background on body takes over

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // one oversized triangle covers the whole viewport
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMouseStr = gl.getUniformLocation(prog, "u_mouseStr");
    const uWarp = gl.getUniformLocation(prog, "u_warp");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // the liquid is soft anyway, so render well below native resolution
    const scale = coarse || window.innerWidth < 768 ? 0.35 : 0.5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(window.innerWidth * dpr * scale));
      canvas.height = Math.max(1, Math.round(window.innerHeight * dpr * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let time = 12; // start on a frame that already looks good
    let speed = MODES.liquid.speed;
    let warp = MODES.liquid.warp;
    let target = MODES.liquid;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, str: 0 };

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseStr, mouse.str);
      gl.uniform1f(uWarp, warp);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      speed += (target.speed - speed) * Math.min(dt * 2, 1);
      warp += (target.warp - warp) * Math.min(dt * 2, 1);
      time += dt * speed;
      mouse.x += (mouse.tx - mouse.x) * Math.min(dt * 4, 1);
      mouse.y += (mouse.ty - mouse.y) * Math.min(dt * 4, 1);
      mouse.str *= Math.pow(0.25, dt); // swirl relaxes when the cursor rests
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || reducedMotion.matches || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointer = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
      mouse.str = Math.min(mouse.str + 0.08, 1);
    };
    const onResize = () => {
      resize();
      if (!raf) draw();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionPref = () => {
      if (reducedMotion.matches) {
        stop();
        draw();
      } else start();
    };
    const onMode = (e: Event) => {
      const mode = (e as CustomEvent<ShaderMode>).detail;
      target = MODES[mode] ?? MODES.liquid;
      if (!raf) {
        // no animation loop running: jump straight to the new look
        speed = target.speed;
        warp = target.warp;
        draw();
      }
    };

    resize();
    draw();
    start();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener(SHADER_EVENT, onMode);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionPref);
    canvas.dataset.ready = "true";

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener(SHADER_EVENT, onMode);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionPref);
    };
  }, []);

  return <canvas ref={canvasRef} className="shader" aria-hidden="true" />;
}
