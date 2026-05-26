"use client";

import { useEffect, useRef, useState } from "react";

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_motionScale;

out vec4 outColor;

float hash1(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash1(i);
  float b = hash1(i + vec2(1.0, 0.0));
  float c = hash1(i + vec2(0.0, 1.0));
  float d = hash1(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.03 + 19.0;
    a *= 0.5;
  }
  return v;
}

float heightAt(vec2 p, float t) {
  float depth = mix(1.0, 0.68, p.y);
  vec2 flow = vec2(t * 0.11, t * 0.084);

  float h = fbm(p * 2.6 * depth + flow) * 0.52;
  h += fbm(p * 5.4 * depth - flow.yx + 2.5) * 0.27;
  h += fbm(p * 11.0 * depth + flow * 0.55 + 5.8) * 0.13;
  h += fbm(p * 22.0 * depth - flow * 1.1 + 1.4) * 0.06;
  return h;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time * u_motionScale;

  float eps = 0.0028;
  float h = heightAt(p, t);
  float hx = heightAt(p + vec2(eps, 0.0), t);
  float hy = heightAt(p + vec2(0.0, eps), t);

  vec2 grad = vec2(h - hx, h - hy) / eps;
  vec3 normal = normalize(vec3(-grad.x, -grad.y, 1.0));

  vec3 lightDir = normalize(vec3(0.12, 1.0, 0.35));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 reflectDir = reflect(-viewDir, normal);

  float ndotl = max(dot(normal, lightDir), 0.0);
  float mirror = max(dot(reflectDir, lightDir), 0.0);
  float slope = clamp(1.0 - normal.z, 0.0, 1.0);

  vec3 cerulean = vec3(0.0, 0.2, 0.34);
  vec3 deepSea = vec3(0.0, 0.35, 0.52);
  vec3 teal = vec3(0.02, 0.42, 0.44);
  vec3 turquoise = vec3(0.06, 0.55, 0.58);
  vec3 aqua = vec3(0.1, 0.68, 0.72);
  vec3 cyanBright = vec3(0.14, 0.78, 0.82);

  float colorNoise = noise(p * 4.5 + vec2(t * 0.04, -t * 0.03));
  vec3 col = mix(cerulean, deepSea, smoothstep(0.0, 0.32, h + colorNoise * 0.08));
  col = mix(col, teal, smoothstep(0.18, 0.5, h));
  col = mix(col, turquoise, smoothstep(0.38, 0.72, h));
  col = mix(col, aqua, smoothstep(0.55, 0.88, h));
  col = mix(col, cyanBright, smoothstep(0.72, 1.0, h) * (0.45 + ndotl * 0.55));
  col += vec3(0.02, 0.1, 0.11) * pow(slope, 1.1) * 0.35;

  vec2 bandCenter = vec2(aspect * 0.72, 0.58);
  float sunBand = exp(-dot(p - bandCenter, p - bandCenter) * 1.15);
  sunBand = clamp(sunBand * 1.35 + 0.45, 0.45, 1.65);

  vec2 glitterUV = p * 118.0 + vec2(t * 1.0, t * 0.72);
  float glitterCoarse = noise(glitterUV);
  float glitterFine = noise(glitterUV * 2.6 - t * 1.4);
  float glitterMicro = noise(glitterUV * 4.8 + t * 0.8);
  float glitterMask = smoothstep(0.18, 0.52, glitterCoarse * glitterFine);
  float glitterMask2 = smoothstep(0.22, 0.55, glitterFine * glitterMicro);
  float glitterDense = smoothstep(0.35, 0.72, glitterCoarse * glitterMicro);

  float twinklePhase = noise(p * 22.0 + 2.1) * 6.283 + t * 15.0;
  float twinkle = 0.72 + 0.28 * sin(twinklePhase);

  float specBase = pow(mirror, 18.0) * slope;
  float specMid = pow(mirror, 38.0) * slope;
  float specHot = pow(mirror, 68.0) * pow(slope, 0.75);

  float sheen = specBase * 0.95 * sunBand;
  float microSpark = specMid * glitterMask2 * twinkle * 5.5 * sunBand;
  float sparkles = specMid * glitterMask * twinkle * 9.5 * sunBand;
  float cores = specHot * glitterDense * twinkle * 14.0 * sunBand;
  float pinFlash = specHot * smoothstep(0.55, 0.92, glitterFine * glitterMicro) * 8.0 * sunBand;

  vec3 glint = vec3(1.0) * (sheen + microSpark + sparkles + cores + pinFlash);
  col += glint;

  float bloom = (specBase + specMid * 0.55) * max(glitterMask, glitterMask2) * 0.72 * sunBand;
  col += vec3(0.88, 0.98, 1.0) * bloom;

  col = pow(max(col, vec3(0.0)), vec3(0.99));
  outColor = vec4(col, 1.0);
}
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string,
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

type WaterGlintEffectProps = {
  className?: string;
};

export function WaterGlintEffect({ className }: WaterGlintEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setInitError(null);

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setInitError("WebGL2 is not available in this browser.");
      return;
    }

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) {
      setInitError("Water shader failed to compile.");
      return;
    }

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const motionScaleLoc = gl.getUniformLocation(program, "u_motionScale");
    if (!resolutionLoc || !timeLoc || !motionScaleLoc) {
      setInitError("Water shader uniforms are missing.");
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(program);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0.0, 0.41, 0.58, 1.0);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    const onMotionChange = () => {
      reduceMotion = motionQuery.matches;
    };
    motionQuery.addEventListener("change", onMotionChange);

    let width = 0;
    let height = 0;
    let rafId = 0;
    let start = performance.now();
    let frozenTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW =
        canvas.clientWidth > 0 ? canvas.clientWidth : window.innerWidth;
      const cssH =
        canvas.clientHeight > 0 ? canvas.clientHeight : window.innerHeight;
      width = Math.max(1, Math.floor(cssW * dpr));
      height = Math.max(1, Math.floor(cssH * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(resize);

    const draw = (now: number) => {
      if (document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const elapsed = (now - start) * 0.001;
      if (!reduceMotion) frozenTime = elapsed;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(resolutionLoc, width, height);
      gl.uniform1f(timeLoc, frozenTime);
      gl.uniform1f(motionScaleLoc, reduceMotion ? 0.0 : 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", onMotionChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={
          className ??
          "fixed inset-0 block h-screen w-screen touch-none"
        }
        style={{ backgroundColor: "#006994" }}
        aria-hidden={initError ? undefined : true}
      />
      {initError ? (
        <p
          className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6 text-center text-sm text-white/90"
          style={{ fontFamily: "var(--font-hind), sans-serif" }}
        >
          {initError}
        </p>
      ) : null}
    </>
  );
}
