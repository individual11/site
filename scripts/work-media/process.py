"""Copy curated portfolio media from the archive into public/work.

Usage (macOS; needs sips, qlmanage and avconvert, which ship with the OS, and swift from Xcode):
    python3 -I scripts/work-media/process.py            # uses plan.json next to this file
Edit plan.json to change which photos/clips each project uses, then re-run.
Re-running re-encodes everything, so revert files you didn't mean to change
(git restore public/work/<slug>) before committing.

Images: rotate per EXIF, resize to 1600px long edge, JPEG q78, strip all
metadata (EXIF incl. GPS). Videos: short muted-autoplay loops via avconvert
(which filters privacy metadata by default), audio track removed, plus a
poster frame.
Writes lib/work-media.ts.
"""
import json, os, struct, subprocess, sys, shutil, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
# The original archive lives next to the repo; override with I11_ARCHIVE=/path
SRC = os.environ.get("I11_ARCHIVE", os.path.join(os.path.dirname(REPO), "_individual11"))
OUT = os.path.join(REPO, "public/work")
TMP = tempfile.mkdtemp(prefix="i11media-")

PLAN = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "plan.json")))


def exif_orientation(path):
    try:
        d = open(path, "rb").read(200000)
    except Exception:
        return 1
    i = d.find(b"Exif\x00\x00")
    if i < 0:
        return 1
    t = i + 6
    endian = "<" if d[t:t + 2] == b"II" else ">"
    ifd = struct.unpack(endian + "I", d[t + 4:t + 8])[0]
    n = struct.unpack(endian + "H", d[t + ifd:t + ifd + 2])[0]
    for k in range(n):
        e = t + ifd + 2 + k * 12
        tag = struct.unpack(endian + "H", d[e:e + 2])[0]
        if tag == 0x0112:
            return struct.unpack(endian + "H", d[e + 8:e + 10])[0]
    return 1


def strip_jpeg(path):
    d = open(path, "rb").read()
    assert d[:2] == b"\xff\xd8"
    out = bytearray(b"\xff\xd8")
    i = 2
    while i < len(d):
        if d[i] != 0xFF:
            raise ValueError("bad marker")
        m = d[i + 1]
        if m == 0xDA:  # start of scan: copy the rest
            out += d[i:]
            break
        ln = struct.unpack(">H", d[i + 2:i + 4])[0]
        seg = d[i:i + 2 + ln]
        # drop APP1..APP15 (EXIF, XMP, Photoshop, etc.) and COM; keep APP0/JFIF, APP2 ICC
        if not ((0xE1 <= m <= 0xEF and m != 0xE2) or m == 0xFE):
            out += seg
        i += 2 + ln
    open(path, "wb").write(bytes(out))


def dims(path):
    o = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", path], capture_output=True, text=True).stdout
    w = int(o.split("pixelWidth:")[1].split()[0])
    h = int(o.split("pixelHeight:")[1].split()[0])
    return w, h


def image(src, dest, maxpx=1600):
    # paths are relative to the archive; "repo:" paths are relative to this repo
    s = os.path.join(REPO, src[5:]) if src.startswith("repo:") else os.path.join(SRC, src)
    tmp = os.path.join(TMP, "x.png")
    subprocess.run(["sips", "-s", "format", "png", s, "--out", tmp], check=True, capture_output=True)
    rot = {3: "180", 6: "90", 8: "270"}.get(exif_orientation(s))
    if rot:
        subprocess.run(["sips", "-r", rot, tmp], check=True, capture_output=True)
    subprocess.run(["sips", "-Z", str(maxpx), "-s", "format", "jpeg", "-s", "formatOptions", "78", tmp, "--out", dest],
                   check=True, capture_output=True)
    strip_jpeg(dest)
    return dims(dest)


def loop(src, dest, start, dur):
    s = os.path.join(SRC, src)
    subprocess.run(["avconvert", "-s", s, "-o", dest, "-p", "Preset960x540", "--start", str(start),
                    "--duration", str(dur), "--replace"], check=True, capture_output=True)
    silent = os.path.join(TMP, "silent.mp4")
    subprocess.run(["swift", os.path.join(HERE, "strip-audio.swift"), dest, silent], check=True, capture_output=True)
    shutil.move(silent, dest)
    poster = dest.replace(".mp4", "-poster.jpg")
    qd = os.path.join(TMP, "q")
    shutil.rmtree(qd, ignore_errors=True)
    os.makedirs(qd)
    subprocess.run(["qlmanage", "-t", "-s", "1280", "-o", qd, dest], capture_output=True)
    png = os.path.join(qd, os.path.basename(dest) + ".png")
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "75", png, "--out", poster],
                   check=True, capture_output=True)
    strip_jpeg(poster)
    w, h = dims(poster)
    return w, h


manifest = {}
for slug, spec in PLAN.items():
    d = os.path.join(OUT, slug)
    os.makedirs(d, exist_ok=True)
    entry = {"images": []}
    for n, (src, alt) in enumerate(spec.get("images", [])):
        name = f"{n + 1:02d}.jpg"
        w, h = image(src, os.path.join(d, name))
        entry["images"].append({"src": f"/work/{slug}/{name}", "width": w, "height": h, "alt": alt})
        print(slug, name, w, h, flush=True)
    if "loop" in spec:
        src, start, dur, alt = spec["loop"]
        dest = os.path.join(d, "loop.mp4")
        w, h = loop(src, dest, start, dur)
        entry["loop"] = {"src": f"/work/{slug}/loop.mp4", "poster": f"/work/{slug}/loop-poster.jpg",
                         "width": w, "height": h, "alt": alt}
        print(slug, "loop", w, h, os.path.getsize(dest) // 1024, "KB", flush=True)
    manifest[slug] = entry

ts = ["// Generated by scripts/work-media/process.py from plan.json. Edit the plan and re-run instead of hand-editing.",
      "export type WorkImage = { src: string; width: number; height: number; alt: string };",
      "export type WorkLoop = WorkImage & { poster: string };",
      "export const WORK_MEDIA: Record<string, { images: WorkImage[]; loop?: WorkLoop }> = " +
      json.dumps(manifest, indent=2) + ";", ""]
open(os.path.join(REPO, "lib/work-media.ts"), "w").write("\n".join(ts))
print("done")
